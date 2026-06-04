from fastapi import APIRouter, Depends
from uuid import UUID
from database import get_async_db
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.defects import Defects
from schemas.defect import DefectResponse, DefectDescription

router = APIRouter(prefix="/analyze", tags=["ai_analyis"])


@router.get("/{inspection_id}", response_model=DefectResponse)
async def analyze(inspection_id: UUID, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(
        select(Defects).where(Defects.inspection == inspection_id) )
    defects = result.scalars().all()

    return DefectResponse(
        inspection_id=inspection_id,
        defects=[DefectDescription.model_validate(defect) for defect in defects],
    )
