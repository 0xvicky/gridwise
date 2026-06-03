from pydantic import BaseModel
from uuid import UUID
from models.enums import ValidationStatus

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
