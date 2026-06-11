from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from schemas.ticket import (
    TicketDetailsResponse,
    TicketResponse,
    TicketStatusUpdateRequest,
    TicketStatusUpdateResponse,
)
from services.ticket_engine import update_ticket_status
from models.ticket import Ticket
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_async_db

router = APIRouter(tags=["ticket"])


@router.get("/tickets", response_model=list[TicketResponse])
async def get_tickets(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Ticket).order_by(Ticket.due_date.asc()))
    return result.scalars().all()


@router.get("/ticket/{ticket_id}", response_model=TicketDetailsResponse)
async def get_ticket(ticket_id: UUID, db: AsyncSession = Depends(get_async_db)):
    ticket = await db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="ticket not found")

    return ticket


@router.patch("/ticket/{ticket_id}", response_model=TicketStatusUpdateResponse)
async def patch_ticket_status(
    ticket_id: UUID,
    payload: TicketStatusUpdateRequest,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Update a ticket's status with state transition validation.

    Valid transitions:
    - OPEN -> IN_PROGRESS
    - IN_PROGRESS -> CLOSED

    Args:
        ticket_id: UUID of the ticket to update
        payload: Request containing the new status
        db: AsyncSession database connection

    Returns:
        TicketStatusUpdateResponse with old and new status

    Raises:
        HTTPException: 404 if ticket does not exist
        HTTPException: 400 if transition is invalid
    """
    old_status, new_status = await update_ticket_status(ticket_id, payload.status, db)

    return TicketStatusUpdateResponse(
        ticket_id=ticket_id,
        old_status=old_status,
        new_status=new_status,
    )
