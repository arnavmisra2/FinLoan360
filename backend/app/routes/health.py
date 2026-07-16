import os
from fastapi import APIRouter

from ..schemas import HealthResponse
from ..services.ml_service import get_model_info

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    models = get_model_info()
    db_status = "unknown"

    try:
        from ..database import engine
        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)[:100]}"

    all_ok = db_status == "connected" and all(models.values())

    return HealthResponse(
        status="healthy" if all_ok else "degraded",
        database=db_status,
        models=models,
    )
