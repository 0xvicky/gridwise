from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from schemas.asset import AssetCreate, AssetResponse
from schemas.inspection import InspectionSummaryResponse
from sqlalchemy.ext.asyncio import AsyncSession
from models.asset import Asset
from models.inspection import Inspection
from services.forecast_asset import forecast
from sqlalchemy import select
from database import get_async_db

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("/", response_model=list[AssetResponse])
async def get_all(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Asset))
    assets = result.scalars().all()

    return assets


@router.get("/{asset_id}/inspections", response_model=list[InspectionSummaryResponse])
async def get_asset_inspections(
    asset_id: UUID, db: AsyncSession = Depends(get_async_db)
):
    asset = await db.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="asset not found")

    result = await db.execute(
        select(Inspection)
        .where(Inspection.asset_id == asset_id)
        .order_by(Inspection.capture_date.desc())
    )
    inspections = result.scalars().all()

    return [
        InspectionSummaryResponse(
            inspection_id=inspection.id,
            asset_id=inspection.asset_id,
            pilot_id=inspection.pilot_id,
            capture_date=inspection.capture_date,
            validation_status=inspection.validation_status,
            analysis_status=inspection.analysis_status,
            health_score=inspection.health_score,
        )
        for inspection in inspections
    ]


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: UUID, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="asset not found"
        )
    return asset


@router.post("/create", response_model=AssetResponse)
async def create_asset(payload: AssetCreate, db: AsyncSession = Depends(get_async_db)):
    asset = Asset(
        name=payload.name,
        asset_type=payload.asset_type,
        latitude=payload.latitude,
        longitude=payload.longitude,
        zone=payload.zone,
        installed_year=payload.installed_year,
    )

    db.add(asset)
    await db.commit()
    await db.refresh(asset)

    return asset



@router.post("/{asset_id/forecast")
async def forecast_asset(asset_id:UUID,db:AsyncSession=Depends(get_async_db)):
  fid= await forecast(asset_id, db)
  return {"forecast_id":fid}