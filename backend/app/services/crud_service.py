from __future__ import annotations

import logging
from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppException, DatabaseException, NotFoundException
from app.db.base import Base
from app.repositories.base import BaseRepository

logger = logging.getLogger(__name__)

ModelT = TypeVar("ModelT", bound=Base)


class CrudService(Generic[ModelT]):
    resource_name = "Resource"

    def __init__(self, repo: BaseRepository[ModelT]) -> None:
        self.repo = repo

    def create(self, db: Session, data: BaseModel | dict[str, Any]) -> ModelT:
        try:
            payload = data if isinstance(data, dict) else data.model_dump(exclude_unset=True)
            return self.repo.create(db, payload)
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "crud_create_db_error",
                extra={
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "resource": self.resource_name,
                },
            )
            raise DatabaseException(f"Failed to create {self.resource_name.lower()}")

    def get(self, db: Session, id: int) -> ModelT:
        try:
            obj = self.repo.get(db, id)
            if not obj:
                raise NotFoundException(f"{self.resource_name} {id} not found")
            return obj
        except AppException:
            raise
        except SQLAlchemyError as e:
            logger.error(
                "crud_get_db_error",
                extra={
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "resource": self.resource_name,
                    "id": id,
                },
            )
            raise DatabaseException(f"Failed to retrieve {self.resource_name.lower()}")

    def list_items(self, db: Session, skip: int = 0, limit: int = 100) -> tuple[int, list[ModelT]]:
        try:
            items = self.repo.list(db, skip=skip, limit=limit)
            return len(items), items
        except SQLAlchemyError as e:
            logger.error(
                "crud_list_db_error",
                extra={
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "resource": self.resource_name,
                },
            )
            raise DatabaseException(f"Failed to list {self.resource_name.lower()} records")

    def update(self, db: Session, id: int, data: BaseModel | dict[str, Any]) -> ModelT:
        try:
            obj = self.get(db, id)
            payload = data if isinstance(data, dict) else data.model_dump(exclude_unset=True)
            return self.repo.update(db, obj, payload)
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "crud_update_db_error",
                extra={
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "resource": self.resource_name,
                    "id": id,
                },
            )
            raise DatabaseException(f"Failed to update {self.resource_name.lower()}")

    def delete(self, db: Session, id: int) -> None:
        try:
            obj = self.get(db, id)
            self.repo.delete(db, obj)
        except AppException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(
                "crud_delete_db_error",
                extra={
                    "error": str(e),
                    "error_type": type(e).__name__,
                    "resource": self.resource_name,
                    "id": id,
                },
            )
            raise DatabaseException(f"Failed to delete {self.resource_name.lower()}")
