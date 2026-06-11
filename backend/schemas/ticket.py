from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date
from models.enums import TicketPriority, TicketStatus


class TicketResponse(BaseModel):
    ticket_id: UUID = Field(alias="id")
    priority: TicketPriority
    status: TicketStatus
    title: str
    assigned_team: str | None
    due_date: date

    model_config = {"from_attributes": True}


class TicketDetailsResponse(TicketResponse):
    instructions: str
    defect_id: UUID
    asset_id: UUID
    inspection_id: UUID
    before_photo_path: str | None = None
    after_photo_path: str | None = None


class InspectionTicketsResponse(BaseModel):
    inspection_id: UUID
    tickets: list[TicketResponse]


class TicketStatusUpdateRequest(BaseModel):
    status: TicketStatus


class TicketStatusUpdateResponse(BaseModel):
    ticket_id: UUID
    old_status: TicketStatus
    new_status: TicketStatus

    model_config = {"from_attributes": True}
