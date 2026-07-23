from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models import FieldObservation
from app.db.session import get_db
from app.schemas.field_observation import (
    FieldObservationCreate,
    FieldObservationResponse,
    YieldResultUpdate,
)

router = APIRouter()


@router.post(
    "",
    response_model=FieldObservationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_field_observation(
    payload: FieldObservationCreate,
    db: Session = Depends(get_db),
) -> FieldObservation:
    observation = FieldObservation(**payload.model_dump())
    db.add(observation)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Observation code already exists.",
        ) from exc
    db.refresh(observation)
    return observation


@router.get("", response_model=list[FieldObservationResponse])
def list_field_observations(
    db: Session = Depends(get_db),
    crop: str | None = Query(default=None),
    province: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> list[FieldObservation]:
    stmt = select(FieldObservation).order_by(FieldObservation.observation_date.desc())
    if crop:
        stmt = stmt.where(FieldObservation.crop == crop)
    if province:
        stmt = stmt.where(FieldObservation.province == province)
    stmt = stmt.offset(offset).limit(limit)
    return list(db.scalars(stmt))


@router.get("/{observation_id}", response_model=FieldObservationResponse)
def get_field_observation(
    observation_id: int,
    db: Session = Depends(get_db),
) -> FieldObservation:
    observation = db.get(FieldObservation, observation_id)
    if observation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Observation not found.")
    return observation


@router.patch("/{observation_id}/yield-result", response_model=FieldObservationResponse)
def update_yield_result(
    observation_id: int,
    payload: YieldResultUpdate,
    db: Session = Depends(get_db),
) -> FieldObservation:
    observation = db.get(FieldObservation, observation_id)
    if observation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Observation not found.")

    update_data = payload.model_dump(exclude_unset=True)
    if update_data.get("actual_total_tons") is None:
        update_data["actual_total_tons"] = round(payload.actual_yield_t_ha * observation.surface_ha, 3)

    for key, value in update_data.items():
        setattr(observation, key, value)

    db.commit()
    db.refresh(observation)
    return observation
