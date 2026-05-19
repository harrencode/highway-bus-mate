from sqlalchemy.orm import Session

from app.models.pricing import Pricing
from app.repositories.base import BaseRepository


class PricingRepository(BaseRepository[Pricing]):
    def __init__(self) -> None:
        super().__init__(Pricing)

    def list_by_route(self, db: Session, route_id: int) -> list[Pricing]:
        return db.query(Pricing).filter(Pricing.route_id == route_id).all()
