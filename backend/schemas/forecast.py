from uuid import UUID

from pydantic import BaseModel


class ForecastResponse(BaseModel):
    id: UUID
    risk_30_days: float
    risk_60_days: float
    risk_90_days: float
    degradation_rate: float
    recommended_action: str
    at_risk_component: str
    reasoning: str

    model_config = {"from_attributes": True}


class PaginatedForecastResponse(BaseModel):
    items: list[ForecastResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
