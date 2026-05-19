from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, username: str) -> User | None:
        return db.query(User).filter(User.username == username).first()

    def authenticate(self, db: Session, username: str, password: str) -> User | None:
        user = (
            db.query(User)
            .filter(or_(User.username == username, User.email == username))
            .first()
        )
        if not user:
            return None
        if verify_password(password, user.hashed_password):
            return user
        return None

    def list_users(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[User]]:
        query = db.query(User).order_by(User.id.asc())
        total = query.count()
        users = query.offset(skip).limit(limit).all()
        return total, users

    def search_users(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[User]]:
        pattern = f"%{query}%"
        q = (
            db.query(User)
            .filter(or_(User.username.ilike(pattern), User.email.ilike(pattern)))
            .order_by(User.id.asc())
        )
        total = q.count()
        users = q.offset(skip).limit(limit).all()
        return total, users

    def count(self, db: Session) -> int:
        return db.query(User).count()
