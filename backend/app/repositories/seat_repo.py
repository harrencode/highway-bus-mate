from sqlalchemy.orm import Session

from app.models.seat import Seat
from app.repositories.base import BaseRepository


class SeatRepository(BaseRepository[Seat]):
    def __init__(self) -> None:
        super().__init__(Seat)

    def list_by_bus(self, db: Session, bus_id: int) -> list[Seat]:
        return db.query(Seat).filter(Seat.bus_id == bus_id).order_by(Seat.id.asc()).all()
