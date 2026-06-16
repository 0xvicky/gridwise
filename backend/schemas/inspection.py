from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from models.enums import ValidationStatus, AnalysisStatus
from models.defects import DefectType,Severity

#    return {
#         "defect_type": DefectType.CORROSION,
#         "severity": Severity.CRITICAL,
#         "location_description": "Zone A",
#         "confidence_score": 0.92,
#         "reasoning": "The AI model detected significant corrosion in Zone A with a confidence score of 0.92, indicating a critical severity level that requires immediate attention to prevent further damage.",
#     }
class InspectionLLMResponse(BaseModel):
    defect_type:DefectType
    severity:Severity
    location_description:str
    confidence_score:float
    reasoning:str
    recommendation:str

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
    asset_name:str
    pilot_id: str
    capture_date: datetime
    validation_status: ValidationStatus
    analysis_status: AnalysisStatus
    health_score: int | None
    
    model_config = {"from_attributes": True}


class PaginatedInspectionResponse(BaseModel):
    items: list[InspectionSummaryResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

