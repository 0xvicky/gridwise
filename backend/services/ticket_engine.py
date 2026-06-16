import random
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.defects import Defects
from models.inspection import Inspection
from models.ticket import Ticket
from models.asset import Asset
from fastapi import HTTPException
from models.enums import TicketPriority, Severity, TicketStatus
from datetime import date, timedelta
from typing import Optional


def calculate_priority(defects: list[Defects]) -> dict:
    priorities = {}
    for defect in defects:
        if defect.severity == Severity.CRITICAL:
            priorities[defect.id] = TicketPriority.P1
        elif defect.severity == Severity.MAJOR:
            priorities[defect.id] = TicketPriority.P2
        else:
            priorities[defect.id] = TicketPriority.P3
    return priorities


def calculate_due_date(priority: TicketPriority) -> date:

    if priority == TicketPriority.P1:
        due_date = date.today() + timedelta(days=3)
    elif priority == TicketPriority.P2:
        due_date = date.today() + timedelta(days=14)
    else:
        due_date = date.today() + timedelta(days=30)

    return due_date


async def create(inspection_id: UUID, db: AsyncSession) -> list[UUID]:
    inspection = await db.get(Inspection, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="inspection not found")
    asset = await db.get(Asset, inspection.asset_id)
    result = await db.execute(
        select(Defects).where(Defects.inspection == inspection_id)
    )
    defects = result.scalars().all()

    existing_result = await db.execute(
        select(Ticket).where(Ticket.inspection_id == inspection_id)
    )
    existing_tickets = existing_result.scalars().all()
    if existing_tickets:
        return [ticket.id for ticket in existing_tickets]

    priorities = calculate_priority(defects)
    tickets = []

    for defect in defects:
        # create ticket object
        # calculate the priority
        ticket_title = (
            f"{defect.defect_type.value} "
            "detected at "
            f"{defect.location_description}"
        )
        assigned_team = f"Team:{random.randint(0,100)}"
        ticket_priority = priorities[defect.id]
        due_date = calculate_due_date(ticket_priority)
        new_ticket = Ticket(
            defect_id=defect.id,
            asset_id=asset.id,
            inspection_id=inspection.id,
            priority=ticket_priority,
            status=TicketStatus.OPEN,
            title=ticket_title,
            instructions=defect.ai_reasoning,
            assigned_team=assigned_team,
            due_date=due_date,
            before_photo_path="defect.png",
        )
        db.add(new_ticket)
        await db.flush()
        tickets.append(new_ticket.id)

    await db.commit()
    # store the ticket in db
    return tickets
    # return the ticket ids


async def get_inspection_tickets(inspection_id: UUID, db: AsyncSession) -> list[Ticket]:
    """
    Retrieve all tickets for a specific inspection.

    Args:
        inspection_id: UUID of the inspection
        db: AsyncSession database connection

    Returns:
        List of Ticket objects for the inspection

    Raises:
        HTTPException: 404 if inspection does not exist
    """
    # Verify inspection exists
    inspection = await db.get(Inspection, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="inspection not found")

    # Fetch all tickets for the inspection
    result = await db.execute(
        select(Ticket).where(Ticket.inspection_id == inspection_id)
    )
    tickets = result.scalars().all()

    return tickets


async def update_ticket_status(
    ticket_id: UUID, new_status: TicketStatus, db: AsyncSession
) -> tuple[TicketStatus, TicketStatus]:
    """
    Update a ticket's status with state transition validation.

    Valid transitions:
    - OPEN -> IN_PROGRESS
    - IN_PROGRESS -> CLOSED

    Args:
        ticket_id: UUID of the ticket to update
        new_status: New TicketStatus value
        db: AsyncSession database connection

    Returns:
        Tuple of (old_status, new_status)

    Raises:
        HTTPException: 404 if ticket does not exist
        HTTPException: 400 if transition is invalid
    """
    ticket = await db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="ticket not found")

    old_status = ticket.status

    # Validate state transitions
    valid_transitions = {
        TicketStatus.OPEN: [TicketStatus.IN_PROGRESS],
        TicketStatus.IN_PROGRESS: [TicketStatus.CLOSED],
        TicketStatus.CLOSED: [],
    }

    if new_status not in valid_transitions.get(old_status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transition from {old_status.value} to {new_status.value}",
        )

    # Update ticket status
    ticket.status = new_status
    await db.commit()
    await db.refresh(ticket)

    return old_status, new_status
