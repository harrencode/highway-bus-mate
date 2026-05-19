import logging
from datetime import UTC, datetime

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException, DatabaseException
from app.models.contribution import Contribution
from app.repositories.contribution_repo import ContributionRepository
from app.schemas.contribution import ContributionCreate, ContributionReview
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class ContributionService(CrudService[Contribution]):
    resource_name = "Contribution"

    def __init__(self) -> None:
        super().__init__(ContributionRepository())
        self.repo: ContributionRepository

    def create_for_user(self, db: Session, user_id: int, data: ContributionCreate) -> Contribution:
        try:
            payload = data.model_dump(exclude_unset=True)
            payload["submitted_by"] = user_id
            return self.repo.create(db, payload)
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_contribution_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to submit contribution")

    def list_items(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Contribution]]:
        try:
            return self.repo.list_contributions(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_contributions_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to list contributions")

    def review(
        self, db: Session, id: int, reviewer_id: int, data: ContributionReview
    ) -> Contribution:
        try:
            contribution = self.get(db, id)
            return self.repo.update(
                db,
                contribution,
                {
                    "reviewed_by": reviewer_id,
                    "status": data.status,
                    "notes": data.notes,
                    "reviewed_at": datetime.now(UTC),
                },
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "review_contribution_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to review contribution")
