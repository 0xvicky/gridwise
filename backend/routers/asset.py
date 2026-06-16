from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from schemas.asset import AssetCreate, AssetResponse
from schemas.inspection import InspectionSummaryResponse, PaginatedInspectionResponse
from schemas.forecast import ForecastResponse, PaginatedForecastResponse
from sqlalchemy.ext.asyncio import AsyncSession
from models.asset import Asset
from models.inspection import Inspection
from models.forecast import Forecast
from services.forecast_asset import forecast
from sqlalchemy import func, select
from database import get_async_db

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("/", response_model=list[AssetResponse])
async def get_all(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Asset))
    assets = result.scalars().all()

    return assets


@router.get("/{asset_id}/inspections", response_model=PaginatedInspectionResponse)
async def get_asset_inspections(
    asset_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    db: AsyncSession = Depends(get_async_db),
):
    asset = await db.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="asset not found")

    total_result = await db.execute(
        select(func.count(Inspection.id)).where(Inspection.asset_id == asset_id)
    )
    total = total_result.scalar_one()

    result = await db.execute(
        select(Inspection)
        .where(Inspection.asset_id == asset_id)
        .order_by(Inspection.capture_date.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    inspections = result.scalars().all()

    return PaginatedInspectionResponse(
        items=[
            InspectionSummaryResponse(
                inspection_id=inspection.id,
                asset_id=inspection.asset_id,
                asset_name=inspection.asset_name,
                pilot_id=inspection.pilot_id,
                capture_date=inspection.capture_date,
                validation_status=inspection.validation_status,
                analysis_status=inspection.analysis_status,
                health_score=inspection.health_score,
            )
            for inspection in inspections
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total else 0,
    )


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



@router.post("/{asset_id}/forecast")
async def forecast_asset(asset_id:UUID,db:AsyncSession=Depends(get_async_db)):
  fid= await forecast(asset_id, db)
  return {"forecast_id":fid}


@router.get("/{asset_id}/forecasts", response_model=PaginatedForecastResponse)
async def get_asset_forecasts(
    asset_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    db: AsyncSession = Depends(get_async_db),
):
    asset = await db.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="asset not found")

    total_result = await db.execute(
        select(func.count(Forecast.id)).where(Forecast.asset_id == asset_id)
    )
    total = total_result.scalar_one()

    result = await db.execute(
        select(Forecast)
        .where(Forecast.asset_id == asset_id)
        .order_by(Forecast.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    forecasts = result.scalars().all()

    return PaginatedForecastResponse(
        items=forecasts,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total else 0,
    )


@router.get("/{asset_id}/forecast/{forecast_id}", response_model=ForecastResponse)
async def get_asset_forecast(
    asset_id: UUID,
    forecast_id: UUID,
    db: AsyncSession = Depends(get_async_db),
):
    result = await db.execute(
        select(Forecast).where(
            Forecast.id == forecast_id,
            Forecast.asset_id == asset_id,
        )
    )
    asset_forecast = result.scalar_one_or_none()

    if not asset_forecast:
        raise HTTPException(status_code=404, detail="forecast not found")

    return asset_forecast
