from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from schemas.asset import AssetCreate, AssetResponse
from sqlalchemy.ext.asyncio import AsyncSession
from models.asset import Asset
from sqlalchemy import select
from database import get_async_db

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("/", response_model=list[AssetResponse])
async def get_all(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Asset))
    assets = result.scalars().all()

    return assets


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: UUID, db: AsyncSession = Depends(get_async_db)):
    result =await db.execute(select(Asset).where(Asset.id == asset_id))
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
