from fastapi import APIRouter


router = APIRouter(prefix="/health", tags=["health"])

@router.head("/")
def health():
    return {"status": "ok","backend":"gridwise_backend"}