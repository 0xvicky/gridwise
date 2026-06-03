from fastapi import FastAPI
from routers.asset import router as asset_router
from routers.inspection import router as inspection_router

app = FastAPI(title="Grid Wise")

app.include_router(asset_router)
app.include_router(inspection_router)
