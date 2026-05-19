import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.route import Route
from app.repositories.route_repo import RouteRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class RouteService(CrudService[Route]):
    resource_name = "Route"

    def __init__(self) -> None:
        super().__init__(RouteRepository())
        self.repo: RouteRepository

    def list_items(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[Route]]:
        try:
            return self.repo.list_routes(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_routes_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list routes")

    def search(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Route]]:
        try:
            return self.repo.search(db, query=query, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "search_routes_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to search routes")
