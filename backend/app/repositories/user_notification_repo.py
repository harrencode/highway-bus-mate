from sqlalchemy.orm import Session

from app.models.user_notification import UserNotification
from app.repositories.base import BaseRepository


class UserNotificationRepository(BaseRepository[UserNotification]):
    def __init__(self) -> None:
        super().__init__(UserNotification)

    def list_by_user(self, db: Session, user_id: int) -> list[UserNotification]:
        return db.query(UserNotification).filter(UserNotification.user_id == user_id).all()
