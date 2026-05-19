from sqlalchemy.orm import Session

from app.models.booking_seat import BookingSeat
from app.repositories.base import BaseRepository


class BookingSeatRepository(BaseRepository[BookingSeat]):
    def __init__(self) -> None:
        super().__init__(BookingSeat)

    def list_by_booking(self, db: Session, booking_id: int) -> list[BookingSeat]:
        return db.query(BookingSeat).filter(BookingSeat.booking_id == booking_id).all()
