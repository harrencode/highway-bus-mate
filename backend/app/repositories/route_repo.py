from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.route import Route
from app.repositories.base import BaseRepository


class RouteRepository(BaseRepository[Route]):
    def __init__(self) -> None:
        super().__init__(Route)

    def list_routes(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[Route]]:
        query = db.query(Route).order_by(Route.origin.asc(), Route.destination.asc())
        return query.count(), query.offset(skip).limit(limit).all()

    def search(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Route]]:
        pattern = f"%{query}%"
        q = db.query(Route).filter(
            or_(Route.origin.ilike(pattern), Route.destination.ilike(pattern))
        )
        q = q.order_by(Route.origin.asc(), Route.destination.asc())
        return q.count(), q.offset(skip).limit(limit).all()
