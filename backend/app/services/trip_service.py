import logging
from datetime import date

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.trip import Trip
from app.repositories.trip_repo import TripRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class TripService(CrudService[Trip]):
    resource_name = "Trip"

    def __init__(self) -> None:
        super().__init__(TripRepository())
        self.repo: TripRepository

    def list_items(
        self, db: Session, skip: int = 0, limit: int = 100, trip_date: date | None = None
    ) -> tuple[int, list[Trip]]:
        try:
            return self.repo.list_trips(db, skip=skip, limit=limit, trip_date=trip_date)
        except SQLAlchemyError as e:
            logger.error(
                "list_trips_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list trips")
