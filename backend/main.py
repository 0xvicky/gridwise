from fastapi import FastAPI
from routers.asset import router as asset_router
from routers.inspection import router as inspection_router
from routers.ticket import router as ticket_router
from routers.health import router as health_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Grid Wise")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://gridwise.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(asset_router)
app.include_router(inspection_router)
app.include_router(ticket_router)
