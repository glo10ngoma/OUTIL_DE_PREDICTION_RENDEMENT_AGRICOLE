from app.db.base import Base
from app.db.models import FieldObservation
from app.db.session import engine


def init_db() -> None:
    # Import FieldObservation above so SQLAlchemy registers the table metadata.
    _ = FieldObservation
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
