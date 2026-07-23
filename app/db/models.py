from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FieldObservation(Base):
    __tablename__ = "field_observations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    observation_code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    observation_date: Mapped[date] = mapped_column(Date)
    agent_name: Mapped[str] = mapped_column(String(150))

    province: Mapped[str] = mapped_column(String(120), index=True)
    territory: Mapped[str | None] = mapped_column(String(120), nullable=True)
    village: Mapped[str | None] = mapped_column(String(120), nullable=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    altitude_m: Mapped[float | None] = mapped_column(Float, nullable=True)

    farm_name: Mapped[str | None] = mapped_column(String(180), nullable=True)
    plot_code: Mapped[str] = mapped_column(String(80), index=True)
    surface_ha: Mapped[float] = mapped_column(Float)
    slope_percent: Mapped[float | None] = mapped_column(Float, nullable=True)
    drainage: Mapped[str | None] = mapped_column(String(30), nullable=True)
    previous_crop: Mapped[str | None] = mapped_column(String(80), nullable=True)

    crop: Mapped[str] = mapped_column(String(80), index=True)
    seed_variety: Mapped[str | None] = mapped_column(String(120), nullable=True)
    planting_date: Mapped[date] = mapped_column(Date)
    planting_density_ha: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_harvest_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    soil_texture: Mapped[str | None] = mapped_column(String(50), nullable=True)
    soil_ph: Mapped[float | None] = mapped_column(Float, nullable=True)
    organic_matter_percent: Mapped[float | None] = mapped_column(Float, nullable=True)
    nitrogen_mg_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    phosphorus_mg_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    potassium_mg_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    soil_moisture_percent: Mapped[float | None] = mapped_column(Float, nullable=True)

    rainfall_mm: Mapped[float | None] = mapped_column(Float, nullable=True)
    temperature_avg_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    fertilizer_kg_ha: Mapped[float | None] = mapped_column(Float, nullable=True)
    irrigation: Mapped[bool] = mapped_column(Boolean, default=False)
    pest_pressure: Mapped[str] = mapped_column(String(20), default="low")
    disease_pressure: Mapped[str] = mapped_column(String(20), default="low")

    harvest_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    actual_yield_t_ha: Mapped[float | None] = mapped_column(Float, nullable=True)
    actual_total_tons: Mapped[float | None] = mapped_column(Float, nullable=True)
    loss_percent: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
