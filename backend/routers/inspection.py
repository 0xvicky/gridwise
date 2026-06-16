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
from datetime import datetime, timezone
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
from models.asset import Asset
from schemas.defect import DefectResponse, DefectDescription
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_async_db
from pathlib import Path
from dotenv import load_dotenv
from services.generate_report import is_report

router = APIRouter(prefix="/inspection", tags=["inspection"])

load_dotenv()


@router.get("/",response_model=list[InspectionSummaryResponse])
async def get_all(db:AsyncSession=Depends(get_async_db)):
    
    result= await db.execute(select(Inspection).order_by(Inspection.capture_date.desc()))
    inspections=result.scalars().all()
    res=[]
    for inspection in inspections:
        asset=await db.get(Asset,inspection.asset_id)
        
        res.append(InspectionSummaryResponse(
            inspection_id=inspection.id,
            asset_id=inspection.asset_id,
            asset_name=asset.name if asset else "Unknown Asset",
            analysis_status=inspection.analysis_status, 
            capture_date=inspection.capture_date,
            pilot_id=inspection.pilot_id,
            validation_status=inspection.validation_status,
            health_score=inspection.health_score,
        ))
    return res
@router.get("/{inspection_id}/validation")
async def get_files_status(
    inspection_id: UUID, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Inspection).where(Inspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="inspection not found")

    failed_files = inspection.validation_notes.get("failed_files", [])

    return ValidationResponse(
        inspection_id=inspection.id,
        files=[ValidationFileResult(**file) for file in failed_files],
    )


@router.post("/upload", response_model=InspectionUploadResponse)
async def inspection_upload(
    asset_id: UUID = Form(...),
    asset_name:str=Form(...),
    pilot_id: str = Form(...),
    ai_switch:bool=Form(...),
    files: list[UploadFile] = File(...),
    db: AsyncSession = Depends(get_async_db),
):
    # store the metadata in db
    today = datetime.now(timezone.utc)
    inspection = Inspection(
        asset_id=asset_id,
        asset_name=asset_name,
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
        if len(failed_files) == len(files):
            inspection.analysis_status = AnalysisStatus.FAILED
            await db.commit()
            raise HTTPException(
                status_code=400,
                detail="All files failed validation. Please check the validation notes.",
            )
    else:
        inspection.validation_status = ValidationStatus.PASSED

    inspection.analysis_status = AnalysisStatus.PROCESSING
    await db.commit()
    await db.refresh(inspection)
    try:
        await analyze_inspection(inspection, db, ai_switch)
    except Exception as exc:
        inspection.analysis_status = AnalysisStatus.FAILED
        await db.commit()
        raise HTTPException(status_code=500, detail="Inspection analysis failed") from exc

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
        asset_name=inspection.asset_name,
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


#check report downloaded
@router.get("/{inspection_id}/is_report")
async def is_report_downloaded(inspection_id:UUID, db:AsyncSession=Depends(get_async_db)):
    inspection = await db.get(Inspection, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="inspection not found")

    asset_id = inspection.asset_id
    is_rep = is_report(inspection_id,asset_id)
    return {"report_status":is_rep}


# /mnt/data/Code/ai-projects/gridwise/backend/storage/3baf915e-53a1-4832-a13b-01a47fb97029/60a6ca07-a839-43b8-b4b1-589cafea1bf1
