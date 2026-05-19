import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.schedule import Schedule
from app.repositories.schedule_repo import ScheduleRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class ScheduleService(CrudService[Schedule]):
    resource_name = "Schedule"

    def __init__(self) -> None:
        super().__init__(ScheduleRepository())
        self.repo: ScheduleRepository

    def list_items(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Schedule]]:
        try:
            return self.repo.list_schedules(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_schedules_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list schedules")
