import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, DatabaseException
from app.models.saved_route import SavedRoute
from app.repositories.saved_route_repo import SavedRouteRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class SavedRouteService(CrudService[SavedRoute]):
    resource_name = "Saved route"

    def __init__(self) -> None:
        super().__init__(SavedRouteRepository())
        self.repo: SavedRouteRepository

    def save_for_user(self, db: Session, user_id: int, route_id: int) -> SavedRoute:
        try:
            if self.repo.get_by_user_route(db, user_id, route_id):
                raise ConflictException("Route is already saved")
            return self.repo.create(db, {"user_id": user_id, "route_id": route_id})
        except ConflictException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "save_route_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to save route")

    def list_for_user(self, db: Session, user_id: int) -> list[SavedRoute]:
        try:
            return self.repo.list_by_user(db, user_id)
        except SQLAlchemyError as e:
            logger.error(
                "list_saved_routes_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to list saved routes")
