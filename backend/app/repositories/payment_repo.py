from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.repositories.base import BaseRepository


class PaymentRepository(BaseRepository[Payment]):
    def __init__(self) -> None:
        super().__init__(Payment)

    def list_by_booking(self, db: Session, booking_id: int) -> list[Payment]:
        return db.query(Payment).filter(Payment.booking_id == booking_id).all()
