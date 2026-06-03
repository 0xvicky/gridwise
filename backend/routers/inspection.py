from fastapi import APIRouter, UploadFile, File, Form
from datetime import date
from uuid import UUID
from schemas.inspection import InspectionUploadResponse

router = APIRouter(prefix="/inspection", tags=["inspection"])


@router.post("/upload", response_model=InspectionUploadResponse)
async def inspection_upload(
    asset_id: UUID = Form(...),
    pilot_id: str = Form(...),
    capture_date: date = Form(...),
    files: list[UploadFile] = File(...),
):
    pass
