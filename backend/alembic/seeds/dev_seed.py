"""Development seed data."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.enums import UserRole
from app.models.user import User


def seed() -> None:
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == "admin").first():
            print("Seed data already present, skipping.")
            return

        admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("Admin1234"),
            role=UserRole.SUPER_ADMIN,
            is_active=True,
        )
        db.add(admin)

        regular = User(
            username="testuser",
            email="user@example.com",
            hashed_password=get_password_hash("User1234"),
            role=UserRole.USER,
            is_active=True,
        )
        db.add(regular)

        db.commit()
        print("Dev seed completed: admin + testuser created.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
