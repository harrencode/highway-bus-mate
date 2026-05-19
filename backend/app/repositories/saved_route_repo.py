from sqlalchemy.orm import Session

from app.models.saved_route import SavedRoute
from app.repositories.base import BaseRepository


class SavedRouteRepository(BaseRepository[SavedRoute]):
    def __init__(self) -> None:
        super().__init__(SavedRoute)

    def get_by_user_route(self, db: Session, user_id: int, route_id: int) -> SavedRoute | None:
        return (
            db.query(SavedRoute)
            .filter(SavedRoute.user_id == user_id, SavedRoute.route_id == route_id)
            .first()
        )

    def list_by_user(self, db: Session, user_id: int) -> list[SavedRoute]:
        return db.query(SavedRoute).filter(SavedRoute.user_id == user_id).all()
