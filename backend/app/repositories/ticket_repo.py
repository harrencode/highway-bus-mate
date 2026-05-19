from sqlalchemy.orm import Session

from app.models.ticket import Ticket
from app.repositories.base import BaseRepository


class TicketRepository(BaseRepository[Ticket]):
    def __init__(self) -> None:
        super().__init__(Ticket)

    def get_by_booking(self, db: Session, booking_id: int) -> Ticket | None:
        return db.query(Ticket).filter(Ticket.booking_id == booking_id).first()
