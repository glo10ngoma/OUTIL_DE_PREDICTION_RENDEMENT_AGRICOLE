from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.prediction import PressureLevel


class DrainageLevel(StrEnum):
    good = "good"
    medium = "medium"
    poor = "poor"


class SoilTexture(StrEnum):
    clay = "clay"
    sandy = "sandy"
    loamy = "loamy"
    silty = "silty"
    mixed = "mixed"


class FieldObservationBase(BaseModel):
    observation_code: str = Field(..., min_length=3, max_length=50, examples=["OBS-2026-0001"])
    observation_date: date
    agent_name: str = Field(..., min_length=2, max_length=150)

    province: str = Field(..., min_length=2, max_length=120)
    territory: str | None = Field(default=None, max_length=120)
    village: str | None = Field(default=None, max_length=120)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    altitude_m: float | None = None

    farm_name: str | None = Field(default=None, max_length=180)
    plot_code: str = Field(..., min_length=2, max_length=80)
    surface_ha: float = Field(..., gt=0)
    slope_percent: float | None = Field(default=None, ge=0)
    drainage: DrainageLevel | None = None
    previous_crop: str | None = Field(default=None, max_length=80)

    crop: str = Field(..., min_length=2, max_length=80)
    seed_variety: str | None = Field(default=None, max_length=120)
    planting_date: date
    planting_density_ha: float | None = Field(default=None, ge=0)
    expected_harvest_date: date | None = None

    soil_texture: SoilTexture | None = None
    soil_ph: float | None = Field(default=None, ge=3.0, le=10.0)
    organic_matter_percent: float | None = Field(default=None, ge=0, le=20)
    nitrogen_mg_kg: float | None = Field(default=None, ge=0)
    phosphorus_mg_kg: float | None = Field(default=None, ge=0)
    potassium_mg_kg: float | None = Field(default=None, ge=0)
    soil_moisture_percent: float | None = Field(default=None, ge=0, le=100)

    rainfall_mm: float | None = Field(default=None, ge=0)
    temperature_avg_c: float | None = Field(default=None, ge=0, le=50)
    fertilizer_kg_ha: float | None = Field(default=None, ge=0)
    irrigation: bool = False
    pest_pressure: PressureLevel = PressureLevel.low
    disease_pressure: PressureLevel = PressureLevel.low

    notes: str | None = None


class FieldObservationCreate(FieldObservationBase):
    pass


class YieldResultUpdate(BaseModel):
    harvest_date: date
    actual_yield_t_ha: float = Field(..., ge=0)
    actual_total_tons: float | None = Field(default=None, ge=0)
    loss_percent: float | None = Field(default=None, ge=0, le=100)
    notes: str | None = None


class FieldObservationResponse(FieldObservationBase):
    id: int
    harvest_date: date | None = None
    actual_yield_t_ha: float | None = None
    actual_total_tons: float | None = None
    loss_percent: float | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
