from pydantic import BaseModel
from models.enums import DefectType, Severity
from uuid import UUID


class DefectDescription(BaseModel):
    defect_type: DefectType
    severity: Severity
    location_description: str
    confidence_score: float
    ai_reasoning: str
    ai_recommendation:str
    model_config = {"from_attributes": True}


class DefectResponse(BaseModel):
    inspection_id: UUID

    defects: list[DefectDescription]

    model_config = {"from_attributes": True}
