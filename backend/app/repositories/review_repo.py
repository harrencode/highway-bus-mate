from sqlalchemy.orm import Session

from app.models.review import Review
from app.repositories.base import BaseRepository


class ReviewRepository(BaseRepository[Review]):
    def __init__(self) -> None:
        super().__init__(Review)

    def list_by_bus(self, db: Session, bus_id: int) -> list[Review]:
        return (
            db.query(Review)
            .filter(Review.bus_id == bus_id)
            .order_by(Review.created_at.desc())
            .all()
        )

    def list_by_user(self, db: Session, user_id: int) -> list[Review]:
        return (
            db.query(Review)
            .filter(Review.user_id == user_id)
            .order_by(Review.created_at.desc())
            .all()
        )
