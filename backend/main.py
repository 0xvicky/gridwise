from fastapi import FastAPI
from routers.asset import router as asset_router


app = FastAPI(title="Grid Wise")

app.include_router(asset_router)


 