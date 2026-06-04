from fastapi import APIRouter

router = APIRouter(prefix="/analyze", tags=["ai_analyis"])


@router.get("/{inspection_id}")
async def analyze():
    pass
