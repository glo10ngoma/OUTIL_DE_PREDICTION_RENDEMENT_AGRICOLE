from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.db.session import engine

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/db")
def database_health_check() -> dict[str, object]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            dialect_name = connection.dialect.name
            table_exists = _field_observations_table_exists(connection, dialect_name)
    except SQLAlchemyError as exc:
        return {
            "status": "error",
            "database": "unavailable",
            "field_observations_table": False,
            "detail": exc.__class__.__name__,
        }

    return {
        "status": "ok",
        "database": "available",
        "dialect": dialect_name,
        "field_observations_table": table_exists,
    }


def _field_observations_table_exists(connection, dialect_name: str) -> bool:
    if dialect_name == "sqlite":
        result = connection.execute(
            text(
                """
                SELECT 1
                FROM sqlite_master
                WHERE type = 'table'
                  AND name = 'field_observations'
                LIMIT 1
                """
            )
        )
    else:
        result = connection.execute(
            text(
                """
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_name = 'field_observations'
                LIMIT 1
                """
            )
        )
    return result.scalar() is not None
