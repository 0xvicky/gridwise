import os
from fastapi import APIRouter, UploadFile, Depends, File, Form
from datetime import date
from uuid import UUID
from schemas.inspection import InspectionUploadResponse
from services.localstore import validate_and_store
from models.inspection import Inspection
from models.enums import ValidationStatus
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_db
from pathlib import Path
from dotenv import load_dotenv

router = APIRouter(prefix="/inspection", tags=["inspection"])

load_dotenv()


@router.post("/upload", response_model=InspectionUploadResponse)
async def inspection_upload(
    asset_id: UUID = Form(...),
    pilot_id: str = Form(...),
    files: list[UploadFile] = File(...),
    db: AsyncSession = Depends(get_async_db),
):
    # store the metadata in db
    today = date.today()
    inspection = Inspection(
        asset_id=asset_id,
        pilot_id=pilot_id,
        capture_date=today,
        capture_types=["visual"],
        validation_status=ValidationStatus.PENDING,
        validation_notes={},
        health_score=None,
    )

    db.add(inspection)
    await db.commit()
    await db.refresh(inspection)
    SAVE_DIR = Path(f"{os.getenv('SAVE_DIR')}/{asset_id}/{inspection.id}/")
    # get the inspection id, and assetid
    failed_files = []
    for file in files:
        status, reason = validate_and_store(file, SAVE_DIR)
        if not status:
            failed_files.append({"filename": file.filename, "reason": reason})

    if failed_files:
        inspection.validation_status = ValidationStatus.FAILED
        inspection.validation_notes["failed_files"] = failed_files

    inspection.validation_status = ValidationStatus.PASSED
    await db.commit()
    await db.refresh(inspection)
    return 
