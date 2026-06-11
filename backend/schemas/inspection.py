from pydantic import BaseModel
from uuid import UUID
from datetime import date
from models.enums import ValidationStatus, AnalysisStatus


class InspectionUploadResponse(BaseModel):
    inspection_id: UUID
    validation_status: ValidationStatus


class ValidationFileResult(BaseModel):
    file_name: str
    status: ValidationStatus
    reason: str | None = None


class ValidationResponse(BaseModel):
    inspection_id: UUID
    files: list[ValidationFileResult]


class InspectionSummaryResponse(BaseModel):
    inspection_id: UUID
    asset_id: UUID
    pilot_id: str
    capture_date: date
    validation_status: ValidationStatus
    analysis_status: AnalysisStatus
    health_score: int | None

    model_config = {"from_attributes": True}
