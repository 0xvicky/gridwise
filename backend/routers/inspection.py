import os
from fastapi import APIRouter, UploadFile, Depends, File, Form, HTTPException
from datetime import date
from uuid import UUID
from schemas.inspection import (
    InspectionUploadResponse,
    ValidationResponse,
    ValidationFileResult,
)
from services.ai_detection import analyze_inspection
from services.localstore import validate_and_store
from models.inspection import Inspection
from models.enums import ValidationStatus, AnalysisStatus
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_async_db
from pathlib import Path
from dotenv import load_dotenv

router = APIRouter(prefix="/inspection", tags=["inspection"])

load_dotenv()


@router.get("/{inspection_id}/validation")
async def get_files_status(
    inspection_id: UUID, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Inspection).where(Inspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        return {"error": "inspection not found"}

    failed_files = inspection.validation_notes.get("failed_files", [])

    return ValidationResponse(
        inspection_id=inspection.id,
        files=[ValidationFileResult(**file) for file in failed_files],
    )


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
        analysis_status=AnalysisStatus.PENDING,
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
            failed_files.append(
                {
                    "file_name": file.filename,
                    "status": ValidationStatus.FAILED.value,
                    "reason": reason,
                }
            )

    if failed_files:
        inspection.validation_status = ValidationStatus.FAILED
        inspection.validation_notes = {"failed_files": failed_files}
    else:
        inspection.validation_status = ValidationStatus.PASSED

    inspection.analysis_status = AnalysisStatus.PROCESSING
    await db.commit()
    await db.refresh(inspection)
    await analyze_inspection(inspection, db)
    return InspectionUploadResponse(
        inspection_id=inspection.id, validation_status=inspection.validation_status
    )


@router.post("/{inspection_id}/report")
async def generate_report(
    inspection_id: UUID, db: AsyncSession = (Depends(get_async_db))
):
    result = await db.execute(select(Inspection).where(Inspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="inspection not found")
    if inspection.analysis_status != AnalysisStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="ai still processing")

        # generate report
        pass
