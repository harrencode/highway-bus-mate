from sqlalchemy.orm import Session

from app.models.route_stop import RouteStop
from app.repositories.base import BaseRepository


class RouteStopRepository(BaseRepository[RouteStop]):
    def __init__(self) -> None:
        super().__init__(RouteStop)

    def list_by_route(self, db: Session, route_id: int) -> list[RouteStop]:
        return (
            db.query(RouteStop)
            .filter(RouteStop.route_id == route_id)
            .order_by(RouteStop.stop_order.asc())
            .all()
        )
