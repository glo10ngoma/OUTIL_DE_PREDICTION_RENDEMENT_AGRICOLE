from fastapi import APIRouter

from app.schemas.prediction import YieldPredictionRequest, YieldPredictionResponse
from app.services.yield_predictor import YieldPredictor

router = APIRouter()
predictor = YieldPredictor()


@router.post("/yield", response_model=YieldPredictionResponse)
def predict_yield(payload: YieldPredictionRequest) -> YieldPredictionResponse:
    return predictor.predict(payload)

