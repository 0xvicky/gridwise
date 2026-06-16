from uuid import uuid4
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from database import Base
from models.enums import ValidationStatus, AnalysisStatus


class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    asset_id: Mapped[UUID] = mapped_column(ForeignKey("assets.id"), nullable=False)
    asset_name:Mapped[str]
    pilot_id: Mapped[str]
    capture_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    capture_types: Mapped[list[str]] = mapped_column(ARRAY(String))
    validation_status: Mapped[ValidationStatus]
    validation_notes: Mapped[dict] = mapped_column(JSON, default=dict)
    analysis_status: Mapped[AnalysisStatus]
    health_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
