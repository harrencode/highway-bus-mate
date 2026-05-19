import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.review import Review
from app.repositories.review_repo import ReviewRepository
from app.schemas.review import ReviewCreate
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class ReviewService(CrudService[Review]):
    resource_name = "Review"

    def __init__(self) -> None:
        super().__init__(ReviewRepository())
        self.repo: ReviewRepository

    def create_for_user(self, db: Session, user_id: int, data: ReviewCreate) -> Review:
        try:
            payload = data.model_dump(exclude_unset=True)
            payload["user_id"] = user_id
            return self.repo.create(db, payload)
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_review_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to create review")

    def list_for_bus(self, db: Session, bus_id: int) -> list[Review]:
        try:
            return self.repo.list_by_bus(db, bus_id)
        except SQLAlchemyError as e:
            logger.error(
                "list_bus_reviews_db_error", extra={"error": str(e), "error_type": type(e).__name__}
            )
            raise DatabaseException("Failed to list bus reviews")
