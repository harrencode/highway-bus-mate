from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self) -> None:
        super().__init__(Notification)

    def list_notifications(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Notification]]:
        query = db.query(Notification).order_by(Notification.sent_at.desc())
        return query.count(), query.offset(skip).limit(limit).all()
