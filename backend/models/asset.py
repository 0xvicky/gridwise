from uuid import uuid4

from sqlalchemy import Float, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from database import Base
from models.enums import AssetType


class Asset(Base):
    __tablename__ = "assets"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name:Mapped[str]=mapped_column(String, nullable=False)
    asset_type:Mapped[AssetType]
    latitude:Mapped[float] = mapped_column(Float)
    longitude:Mapped[float] = mapped_column(Float)
    zone:Mapped[str] = mapped_column(String)
    installed_year:Mapped[int] = mapped_column(Integer)


