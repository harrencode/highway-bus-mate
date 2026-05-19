import logging
from datetime import UTC, datetime

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException, DatabaseException
from app.models.user_notification import UserNotification
from app.repositories.user_notification_repo import UserNotificationRepository
from app.services.crud_service import CrudService

logger = logging.getLogger(__name__)


class UserNotificationService(CrudService[UserNotification]):
    resource_name = "User notification"

    def __init__(self) -> None:
        super().__init__(UserNotificationRepository())
        self.repo: UserNotificationRepository

    def mark_read(self, db: Session, id: int) -> UserNotification:
        try:
            notification = self.get(db, id)
            return self.repo.update(
                db, notification, {"is_read": True, "read_at": datetime.now(UTC)}
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "mark_notification_read_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to mark notification as read")

    def list_for_user(self, db: Session, user_id: int) -> list[UserNotification]:
        try:
            return self.repo.list_by_user(db, user_id)
        except SQLAlchemyError as e:
            logger.error(
                "list_user_notifications_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to list user notifications")
