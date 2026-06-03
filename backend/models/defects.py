from uuid import uuid4
from database import Base
from sqlalchemy import ForeignKey,String,Float,Text,JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from models.enums import Severity, DefectType


class Defects(Base):
    __tablename__ = "defects"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    inspection: Mapped[UUID] = mapped_column(
        ForeignKey("inspections.id"), nullable=False
    )
    defect_type: Mapped[DefectType]
    severity: Mapped[Severity]
    location_description: Mapped[str] = mapped_column(String)
    confidence_score:Mapped[float] = mapped_column(Float)
    ai_reasoning:Mapped[str] = mapped_column(Text)
    raw_ai_response:Mapped[dict] = mapped_column(JSON)