from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.repositories.base import BaseRepository


class BookingRepository(BaseRepository[Booking]):
    def __init__(self) -> None:
        super().__init__(Booking)

    def get_by_ref(self, db: Session, booking_ref: str) -> Booking | None:
        return db.query(Booking).filter(Booking.booking_ref == booking_ref).first()

    def list_bookings(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Booking]]:
        query = db.query(Booking).order_by(Booking.booked_at.desc())
        return query.count(), query.offset(skip).limit(limit).all()

    def list_by_user(self, db: Session, user_id: int) -> list[Booking]:
        return (
            db.query(Booking)
            .filter(Booking.user_id == user_id)
            .order_by(Booking.booked_at.desc())
            .all()
        )
