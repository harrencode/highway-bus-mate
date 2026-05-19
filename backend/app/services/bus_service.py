import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, DatabaseException
from app.models.bus import Bus
from app.repositories.bus_repo import BusRepository
from app.schemas.bus import BusCreate
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class BusService(CrudService[Bus]):
    resource_name = "Bus"

    def __init__(self) -> None:
        super().__init__(BusRepository())
        self.repo: BusRepository

    def create(self, db: Session, data: BusCreate) -> Bus:
        try:
            if self.repo.get_by_registration_no(db, data.registration_no):
                raise ConflictException(f"Bus '{data.registration_no}' already exists")
            return self.repo.create(db, data.model_dump(exclude_unset=True))
        except ConflictException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_bus_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to create bus")

    def list_items(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[Bus]]:
        try:
            return self.repo.list_buses(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_buses_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list buses")

    def search(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Bus]]:
        try:
            return self.repo.search(db, query=query, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "search_buses_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to search buses")
