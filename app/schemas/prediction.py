from enum import StrEnum

from pydantic import BaseModel, Field


class PressureLevel(StrEnum):
    low = "low"
    medium = "medium"
    high = "high"


class YieldPredictionRequest(BaseModel):
    crop: str = Field(..., examples=["maize", "cassava", "rice", "watermelon"])
    province: str = Field(..., examples=["Kongo Central", "Kinshasa", "Kwilu"])
    surface_ha: float = Field(..., gt=0)
    soil_ph: float | None = Field(default=None, ge=3.0, le=10.0)
    organic_matter_percent: float | None = Field(default=None, ge=0, le=20)
    rainfall_mm: float | None = Field(default=None, ge=0)
    temperature_avg_c: float | None = Field(default=None, ge=0, le=50)
    fertilizer_kg_ha: float | None = Field(default=None, ge=0)
    irrigation: bool = False
    pest_pressure: PressureLevel = PressureLevel.low
    disease_pressure: PressureLevel = PressureLevel.low
    planting_density_ha: float | None = Field(default=None, ge=0)
    seed_variety: str | None = None
    previous_yield_t_ha: float | None = Field(default=None, ge=0)


class YieldPredictionResponse(BaseModel):
    crop: str
    province: str
    estimated_yield_t_ha: float
    estimated_total_tons: float
    confidence_score: float = Field(..., ge=0, le=1)
    risk_level: str
    main_factors: list[str]
    recommendation: str
    model_version: str

