from uuid import uuid4
from datetime import date
from database import Base
from sqlalchemy import ForeignKey, String, Text, Date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from models.enums import TicketPriority, TicketStatus


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    defect_id: Mapped[UUID] = mapped_column(ForeignKey("defects.id"))
    asset_id: Mapped[UUID] = mapped_column(ForeignKey("assets.id"))
    inspection_id: Mapped[UUID] = mapped_column(ForeignKey("inspections.id"))
    priority: Mapped[TicketPriority]
    status: Mapped[TicketStatus]
    title: Mapped[str] = mapped_column(String)
    instructions: Mapped[str] = mapped_column(Text)
    assigned_team: Mapped[str | None] = mapped_column(String, nullable=True)
    due_date: Mapped[date] = mapped_column(Date)
    before_photo_path: Mapped[str | None] = mapped_column(String, nullable=True)
    after_photo_path: Mapped[str | None] = mapped_column(String, nullable=True)
