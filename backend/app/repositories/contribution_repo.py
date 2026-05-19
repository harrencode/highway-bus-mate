from sqlalchemy.orm import Session

from app.models.contribution import Contribution
from app.repositories.base import BaseRepository


class ContributionRepository(BaseRepository[Contribution]):
    def __init__(self) -> None:
        super().__init__(Contribution)

    def list_contributions(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Contribution]]:
        query = db.query(Contribution).order_by(Contribution.submitted_at.desc())
        return query.count(), query.offset(skip).limit(limit).all()

    def list_by_user(self, db: Session, user_id: int) -> list[Contribution]:
        return db.query(Contribution).filter(Contribution.submitted_by == user_id).all()
