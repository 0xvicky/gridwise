import os
import mimetypes
import base64
from uuid import UUID
from fastapi import Depends
from database import get_async_db
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv
from PIL import Image
import asyncio
from models.enums import DefectType, Severity, AnalysisStatus
from models.defects import Defects
from models.inspection import Inspection
from ai.visionllm import vision_llm
from ai.prompts import vision_prompts   
import json
load_dotenv()


def convert_image_to_base64(
    file_path: Path,
):

    mime_type, _ = mimetypes.guess_type(file_path)

    if mime_type is None:
        raise ValueError("Unsupported file type")

    with open(file_path, "rb") as f:

        encoded = base64.b64encode(f.read()).decode("utf-8")

    return {
        "mime_type": mime_type,
        "data": encoded,
    }


def _normalize_enum(value, enum_cls, default):
    if isinstance(value, enum_cls):
        return value

    normalized = str(value or default.value).strip().lower().replace(" ", "_")
    for item in enum_cls:
        if normalized in {item.value.lower(), item.name.lower()}:
            return item

    return default


def normalize_defect_response(response: str | dict) -> dict:
    if isinstance(response, str):
        response = json.loads(response)

    recommendation = response.get("recommendation") or response.get("recomendation") or ""
    try:
        confidence_score = float(response.get("confidence_score") or 0.0)
    except (TypeError, ValueError):
        confidence_score = 0.0

    return {
        "defect_type": _normalize_enum(
            response.get("defect_type"),
            DefectType,
            DefectType.OTHER,
        ),
        "severity": _normalize_enum(
            response.get("severity"),
            Severity,
            Severity.MINOR,
        ),
        "location_description": str(response.get("location_description") or "Unknown location"),
        "confidence_score": max(0.0, min(confidence_score, 1.0)),
        "reasoning": str(response.get("reasoning") or ""),
        "recommendation": str(recommendation),
    }


def mock_detect_defects(image_data: str) -> dict | None:
    return {
        "defect_type": DefectType.CORROSION,
        "severity": Severity.CRITICAL,
        "location_description": "Zone A",
        "confidence_score": 0.92,
        "reasoning": "The AI model detected significant corrosion in Zone A with a confidence score of 0.92, indicating a critical severity level that requires immediate attention to prevent further damage.",
        "recommendation": "It is recommended to schedule an urgent maintenance check for Zone A, including a detailed inspection by a qualified technician. Additionally, consider applying anti-corrosion treatments and monitoring the area closely for any signs of progression.",
    }


async def analyze_inspection(inspection: Inspection, db: AsyncSession, ai_switch: bool):
    # access all the files from the local storage
    dir = Path(os.getenv("SAVE_DIR")) / str(inspection.asset_id) / str(inspection.id)
    # iterate over the files and get the defect response from ai
    defects = []
    deduplicated = {}
    health_score = 100
    for file in Path(dir).rglob("*"):
        if file.is_file():
            base64img = await asyncio.to_thread(convert_image_to_base64, file)
            # ai_res = mock_detect_defects(base64img["data"])
            SYSTEM_PROMPT,USER_PROMPT=vision_prompts()
            if ai_switch:
                ai_res = vision_llm(base64img,SYSTEM_PROMPT,USER_PROMPT)
            else:
                ai_res = mock_detect_defects(base64img["data"])
            # ai_res = vision_llm(base64img,SYSTEM_PROMPT,USER_PROMPT)
            if ai_res:
                defects.append(normalize_defect_response(ai_res))

    for defect in defects:
        key = (defect["defect_type"], defect["location_description"].lower())
        if key not in deduplicated:
            deduplicated[key] = defect
        elif defect["confidence_score"] > deduplicated[key]["confidence_score"]:
            deduplicated[key] = defect
    # add the defects to the db
    for defect in deduplicated.values():
        if defect["severity"] == Severity.CRITICAL:
            health_score -= 25
        elif defect["severity"] == Severity.MAJOR:
            health_score -= 15
        else:
            health_score -= 5
        new_defect = Defects(
            inspection=inspection.id,
            defect_type=defect["defect_type"],
            severity=defect["severity"],
            location_description=defect["location_description"],
            confidence_score=defect["confidence_score"],
            ai_reasoning=defect["reasoning"],
            raw_ai_response={
                **defect,
                "defect_type": defect["defect_type"].value,
                "severity": defect["severity"].value,
            },
            ai_recommendation=defect["recommendation"],
        )
        db.add(new_defect)

    inspection.health_score = max(health_score, 0)
    inspection.analysis_status = AnalysisStatus.COMPLETED
    
    await db.commit()
