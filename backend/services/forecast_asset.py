import json
import re
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from ai.llm import llm_query
from ai.prompts import forecast_prompts
from models.defects import Defects
from models.forecast import Forecast
from models.inspection import Inspection


def _bounded_float(
    value,
    default: float = 0.0,
    minimum: float = 0.0,
    maximum: float = 100.0,
) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        number = default

    return max(minimum, min(number, maximum))


def _extract_json_object(response: str) -> dict:
    cleaned = response.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


def _normalize_forecast_response(response: str | dict) -> dict:
    payload = _extract_json_object(response) if isinstance(response, str) else response

    return {
        "risk_30_days": _bounded_float(payload.get("risk_30_days")),
        "risk_60_days": _bounded_float(payload.get("risk_60_days")),
        "risk_90_days": _bounded_float(payload.get("risk_90_days")),
        "degradation_rate": _bounded_float(
            payload.get("degradation_rate"),
            minimum=0.0,
            maximum=100.0,
        ),
        "recommended_action": str(
            payload.get("recommended_action") or "Schedule maintenance review."
        ),
        "at_risk_component": str(payload.get("at_risk_component") or "Unknown component"),
        "reasoning": str(
            payload.get("reasoning")
            or "Forecast generated from recent inspection history."
        ),
    }


async def _latest_inspection_snapshot(asset_id: UUID, db: AsyncSession) -> dict:
    result = await db.execute(
        select(Inspection)
        .where(Inspection.asset_id == asset_id)
        .order_by(desc(Inspection.capture_date))
        .limit(3)
    )
    inspections = result.scalars().all()

    if not inspections:
        raise HTTPException(
            status_code=400,
            detail="At least 1 inspection is required to generate a forecast.",
        )

    history = []
    for inspection in inspections:
        defect_result = await db.execute(
            select(Defects).where(Defects.inspection == inspection.id)
        )
        defects = defect_result.scalars().all()
        history.append(
            {
                "inspection_id": str(inspection.id),
                "capture_date": inspection.capture_date.isoformat(),
                "analysis_status": inspection.analysis_status.value,
                "health_score": inspection.health_score,
                "defects": [
                    {
                        "defect_type": defect.defect_type.value,
                        "severity": defect.severity.value,
                        "location_description": defect.location_description,
                        "confidence_score": defect.confidence_score,
                        "ai_reasoning": defect.ai_reasoning,
                        "ai_recommendation": defect.ai_recommendation,
                    }
                    for defect in defects
                ],
            }
        )

    inspection_ids = [item["inspection_id"] for item in history]
    return {
        "version": 1,
        "asset_id": str(asset_id),
        "inspection_ids": inspection_ids,
        "forecast_key": ":".join(inspection_ids),
        "history": history,
    }


async def _find_cached_forecast(
    asset_id: UUID,
    forecast_key: str,
    db: AsyncSession,
) -> Forecast | None:
    result = await db.execute(select(Forecast).where(Forecast.asset_id == asset_id))
    forecasts = result.scalars().all()

    for item in forecasts:
        snapshot = item.inspection_history_snapshot or {}
        if snapshot.get("forecast_key") == forecast_key:
            return item

    return None


def ai_forecast(forecast_input: dict) -> dict:
    system_prompt, user_prompt = forecast_prompts()
    response = llm_query(
        system_prompt,
        user_prompt.format(forecast_input=json.dumps(forecast_input, indent=2)),
    )
    return _normalize_forecast_response(response)


async def forecast(asset_id: UUID, db: AsyncSession) -> tuple[UUID, bool]:
    snapshot = await _latest_inspection_snapshot(asset_id, db)
    cached_forecast = await _find_cached_forecast(asset_id, snapshot["forecast_key"], db)
    if cached_forecast:
        return cached_forecast.id, True

    try:
        forecast_results = ai_forecast(snapshot)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="AI forecast generation failed") from exc

    new_forecast = Forecast(
        asset_id=asset_id,
        risk_30_days=forecast_results["risk_30_days"],
        risk_60_days=forecast_results["risk_60_days"],
        risk_90_days=forecast_results["risk_90_days"],
        degradation_rate=forecast_results["degradation_rate"],
        at_risk_component=forecast_results["at_risk_component"],
        reasoning=forecast_results["reasoning"],
        recommended_action=forecast_results["recommended_action"],
        inspection_history_snapshot=snapshot,
    )

    db.add(new_forecast)
    await db.flush()
    await db.commit()

    return new_forecast.id, False
