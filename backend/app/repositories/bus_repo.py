from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.bus import Bus
from app.repositories.base import BaseRepository


class BusRepository(BaseRepository[Bus]):
    def __init__(self) -> None:
        super().__init__(Bus)

    def get_by_registration_no(self, db: Session, registration_no: str) -> Bus | None:
        return db.query(Bus).filter(Bus.registration_no == registration_no).first()

    def list_buses(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[Bus]]:
        query = db.query(Bus).order_by(Bus.registration_no.asc())
        return query.count(), query.offset(skip).limit(limit).all()

    def search(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[Bus]]:
        pattern = f"%{query}%"
        q = db.query(Bus).filter(
            or_(Bus.registration_no.ilike(pattern), Bus.operator_name.ilike(pattern))
        )
        q = q.order_by(Bus.registration_no.asc())
        return q.count(), q.offset(skip).limit(limit).all()
