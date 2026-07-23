from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import psycopg


ROOT_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT_DIR / ".env"
DEFAULT_MIGRATION = ROOT_DIR / "database" / "001_field_observations.sql"


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def normalize_database_url(database_url: str) -> str:
    normalized_url = database_url.replace("postgresql+psycopg://", "postgresql://", 1)
    parts = urlsplit(normalized_url)
    query = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if key != "pgbouncer"
    ]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def apply_migration(migration_path: Path) -> None:
    load_env_file(ENV_FILE)
    database_url = os.environ.get("DATABASE_URL")

    if not database_url:
        raise RuntimeError("DATABASE_URL is missing. Add it to .env before running this script.")

    sql = migration_path.read_text(encoding="utf-8")
    connection_url = normalize_database_url(database_url)

    with psycopg.connect(connection_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql)
        connection.commit()


if __name__ == "__main__":
    apply_migration(DEFAULT_MIGRATION)
    print(f"Applied migration: {DEFAULT_MIGRATION.relative_to(ROOT_DIR)}")
