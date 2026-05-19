from sqlalchemy.orm import Session

from app.models.schedule import Schedule
from app.repositories.base import BaseRepository


class ScheduleRepository(BaseRepository[Schedule]):
    def __init__(self) -> None:
        super().__init__(Schedule)

    def list_schedules(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Schedule]]:
        query = db.query(Schedule).order_by(Schedule.departure_time.asc())
        return query.count(), query.offset(skip).limit(limit).all()

    def list_by_route(self, db: Session, route_id: int) -> list[Schedule]:
        return db.query(Schedule).filter(Schedule.route_id == route_id).all()
