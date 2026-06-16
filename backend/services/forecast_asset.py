from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy import select, desc
from models.inspection import Inspection
from models.defects import Defects
from models.forecast import Forecast


def ai_forecast(input:dict):
    
    return {
        "risk_30_days":75,
        "risk_60_days":83,
        "risk_90_days":95,
        "degradation_rate":0.15,
        "recommended_action":"Fix the corrosion",
        "at_risk_component":"the elbow",
        "reasoning":"The issue at elbow"
    }

async def forecast(asset_id:UUID,db:AsyncSession):
    result = await db.execute(select(Inspection).where(Inspection.asset_id==asset_id).order_by(desc(Inspection.capture_date)).limit(3))
    inspecs = result.scalars().all()
    forecast_input = []
    for ins in inspecs:
        result = await db.execute(select(Defects).where(Defects.inspection==ins.id))
        defects = result.scalars().all()
        for defect in defects:
            info = {
                "defect_type":defect.defect_type,
                "ai_reasoning":defect.ai_reasoning,
            }
            forecast_input.append(info)
    forecast_results = ai_forecast(forecast_input)
    
    new_forecast = Forecast(
        
        asset_id=asset_id,
        risk_30_days=forecast_results["risk_30_days"],
        risk_60_days=forecast_results["risk_60_days"],
        risk_90_days=forecast_results["risk_90_days"],
        degradation_rate=forecast_results["degradation_rate"],
        at_risk_component=forecast_results["at_risk_component"],
        reasoning=forecast_results["reasoning"],
        recommended_action=forecast_results["recommended_action"],
        inspection_history_snapshot={}
    )
    
    db.add(new_forecast)
    await db.flush()
    await db.commit()
    
    return new_forecast.id
