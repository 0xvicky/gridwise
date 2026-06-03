from uuid import uuid4

from sqlalchemy import Date, ForeignKey, Integer, JSON
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base
from models.enums import ValidationStatus


class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    asset_id: Mapped[UUID] = mapped_column(ForeignKey("assets.id"), nullable=False)
    pilot_id: Mapped[str]
    capture_date: Mapped[Date]
    capture_types: Mapped[list[str]] = mapped_column(ARRAY(str))
    validation_status: Mapped[ValidationStatus]
    validation_notes: Mapped[dict] = mapped_column(JSON, default=dict)
    health_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
