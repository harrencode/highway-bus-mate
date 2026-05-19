from datetime import date

from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.repositories.base import BaseRepository


class TripRepository(BaseRepository[Trip]):
    def __init__(self) -> None:
        super().__init__(Trip)

    def list_trips(
        self, db: Session, skip: int = 0, limit: int = 100, trip_date: date | None = None
    ) -> tuple[int, list[Trip]]:
        query = db.query(Trip)
        if trip_date:
            query = query.filter(Trip.trip_date == trip_date)
        query = query.order_by(Trip.trip_date.asc(), Trip.id.asc())
        return query.count(), query.offset(skip).limit(limit).all()
