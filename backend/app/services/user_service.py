"""
User Service

Business logic for user management.
"""

from __future__ import annotations

import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import (
    AppException,
    ConflictException,
    DatabaseException,
    NotFoundException,
)
from app.core.security import get_password_hash
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate, UserRegister, UserUpdate

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self) -> None:
        self.repo = UserRepository()

    def register(self, db: Session, data: UserRegister) -> User:
        """
        Register a new user (open endpoint — role defaults to USER).

        Raises ConflictException if email or username is already taken.
        Raises DatabaseException on unexpected database errors.
        """
        try:
            if self.repo.get_by_email(db, data.email):
                raise ConflictException(f"Email '{data.email}' is already registered")
            if self.repo.get_by_username(db, data.username):
                raise ConflictException(f"Username '{data.username}' is already taken")
            return self.repo.create(
                db,
                {
                    "username": data.username,
                    "full_name": data.full_name,
                    "email": data.email,
                    "phone": data.phone,
                    "hashed_password": get_password_hash(data.password),
                    "is_active": True,
                },
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "register_user_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "email": data.email},
            )
            raise DatabaseException("Failed to register user due to database error")

    def create(self, db: Session, data: UserCreate) -> User:
        """
        Admin-create a user with an explicit role.

        Raises ConflictException if email or username is already taken.
        Raises DatabaseException on unexpected database errors.
        """
        try:
            if self.repo.get_by_email(db, data.email):
                raise ConflictException(f"Email '{data.email}' is already registered")
            if self.repo.get_by_username(db, data.username):
                raise ConflictException(f"Username '{data.username}' is already taken")
            return self.repo.create(
                db,
                {
                    "username": data.username,
                    "full_name": data.full_name,
                    "email": data.email,
                    "phone": data.phone,
                    "hashed_password": get_password_hash(data.password),
                    "role": data.role,
                    "is_active": True,
                },
            )
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "create_user_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "email": data.email},
            )
            raise DatabaseException("Failed to create user due to database error")

    def get(self, db: Session, user_id: int) -> User:
        """Raises NotFoundException if user does not exist."""
        try:
            user = self.repo.get(db, user_id)
            if not user:
                raise NotFoundException(f"User {user_id} not found")
            return user
        except AppException:
            raise
        except SQLAlchemyError as e:
            logger.error(
                "get_user_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "user_id": user_id},
            )
            raise DatabaseException("Failed to retrieve user due to database error")

    def list_users(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[User]]:
        try:
            return self.repo.list_users(db, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "list_users_db_error",
                extra={"error": str(e), "error_type": type(e).__name__},
            )
            raise DatabaseException("Failed to list users due to database error")

    def update(self, db: Session, user_id: int, data: UserUpdate) -> User:
        try:
            user = self.get(db, user_id)
            updates = data.model_dump(exclude_unset=True)
            if "password" in updates:
                updates["hashed_password"] = get_password_hash(updates.pop("password"))
            return self.repo.update(db, user, updates)
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "update_user_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "user_id": user_id},
            )
            raise DatabaseException("Failed to update user due to database error")

    def delete(self, db: Session, user_id: int) -> None:
        try:
            user = self.get(db, user_id)
            self.repo.delete(db, user)
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "delete_user_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "user_id": user_id},
            )
            raise DatabaseException("Failed to delete user due to database error")

    def search(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[int, list[User]]:
        try:
            return self.repo.search_users(db, query=query, skip=skip, limit=limit)
        except SQLAlchemyError as e:
            logger.error(
                "search_users_db_error",
                extra={"error": str(e), "error_type": type(e).__name__, "query": query},
            )
            raise DatabaseException("Failed to search users due to database error")
