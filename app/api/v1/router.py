from fastapi import APIRouter

from app.api.v1.routes import field_observations, health, predictions

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(
    field_observations.router,
    prefix="/field-observations",
    tags=["field observations"],
)
