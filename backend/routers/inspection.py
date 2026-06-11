import os
from fastapi import (
    APIRouter,
    UploadFile,
    Depends,
    File,
    Form,
    HTTPException,
)
from fastapi.responses import FileResponse
from datetime import date
from uuid import UUID
from schemas.inspection import (
    InspectionUploadResponse,
    ValidationResponse,
    ValidationFileResult,
    InspectionSummaryResponse,
)
from schemas.ticket import (
    InspectionTicketsResponse,
    TicketResponse,
    TicketStatusUpdateRequest,
    TicketStatusUpdateResponse,
)
from services.ai_detection import analyze_inspection
from services.localstore import validate_and_store
from services.generate_report import generate
from services.ticket_engine import (
    create,
    get_inspection_tickets,
    update_ticket_status,
)
from models.inspection import Inspection
from models.ticket import Ticket
from models.enums import ValidationStatus, AnalysisStatus
from models.defects import Defects
from schemas.defect import DefectResponse, DefectDescription
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


@router.get("/{inspection_id}/report")
async def download_report(
    inspection_id: UUID, db: AsyncSession = (Depends(get_async_db))
):
    inspection = await db.get(Inspection, inspection_id)
    if not inspection:
        raise HTTPException(
            status_code=404,
            detail="inspection not found",
        )

    result = await db.execute(
        select(Inspection.asset_id).where(Inspection.id == inspection_id)
    )
    asset_id = result.scalar_one_or_none()
    report_path = (
        Path(os.getenv("SAVE_DIR"))
        / str(asset_id)
        / str(inspection_id)
        / "reports"
        / "ai_report.pdf"
    )
    if not report_path.exists():
        raise HTTPException(
            status_code=404,
            detail="report not generated",
        )
    return FileResponse(
        path=str(report_path),
        media_type="application/pdf",
        filename=f"inspection_report_{inspection_id}.pdf",
    )


@router.post("/{inspection_id}/report")
async def generate_report(
    inspection_id: UUID, db: AsyncSession = (Depends(get_async_db))
):
    # generate report
    res = await generate(inspection_id, db)
    return {"status": True, "message": res["message"], "path": res["path"]}


@router.get("/{inspection_id}/defects", response_model=DefectResponse)
async def analyze(inspection_id: UUID, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(
        select(Defects).where(Defects.inspection == inspection_id)
    )
    defects = result.scalars().all()

    return DefectResponse(
        inspection_id=inspection_id,
        defects=[DefectDescription.model_validate(defect) for defect in defects],
    )


@router.get("/{inspection_id}", response_model=InspectionSummaryResponse)
async def get_inspection_summary(
    inspection_id: UUID, db: AsyncSession = Depends(get_async_db)
):
    """
    Get inspection summary with metadata for dashboard views.

    Returns:
        InspectionSummaryResponse containing inspection metadata

    Raises:
        HTTPException: 404 if inspection does not exist
    """
    inspection = await db.get(Inspection, inspection_id)
    if not inspection:
        raise HTTPException(
            status_code=404,
            detail="inspection not found",
        )

    return InspectionSummaryResponse(
        inspection_id=inspection.id,
        asset_id=inspection.asset_id,
        pilot_id=inspection.pilot_id,
        capture_date=inspection.capture_date,
        validation_status=inspection.validation_status,
        analysis_status=inspection.analysis_status,
        health_score=inspection.health_score,
    )


@router.get("/{inspection_id}/tickets", response_model=InspectionTicketsResponse)
async def get_tickets_for_inspection(
    inspection_id: UUID, db: AsyncSession = Depends(get_async_db)
):
    """
    Get all tickets generated for an inspection.

    Returns:
        InspectionTicketsResponse containing all tickets for the inspection

    Raises:
        HTTPException: 404 if inspection does not exist
    """
    tickets = await get_inspection_tickets(inspection_id, db)

    return InspectionTicketsResponse(
        inspection_id=inspection_id,
        tickets=[TicketResponse.model_validate(ticket) for ticket in tickets],
    )


# ticket routers
@router.post("/{inspection_id}/ticket")
async def create_ticket(
    inspection_id: UUID, db: AsyncSession = (Depends(get_async_db))
):
    # call the ticket generation service
    tickets = await create(inspection_id, db)
    return {"tickets_generated": len(tickets), "ticket_ids": tickets}
