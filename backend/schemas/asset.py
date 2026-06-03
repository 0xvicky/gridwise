from uuid import UUID
from pydantic import BaseModel
from models.enums import AssetType


class AssetCreate(BaseModel):
    name: str
    asset_type: AssetType
    latitude: float
    longitude: float
    zone: str
    installed_year: int


class AssetResponse(BaseModel):
    id: UUID
    name: str
    asset_type: AssetType
    latitude: float
    longitude: float
    zone: str
    installed_year: int

    model_config = {"from_attributes": True}
