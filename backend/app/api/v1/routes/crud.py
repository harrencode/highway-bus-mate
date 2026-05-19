from typing import Any

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus


def build_admin_crud_router(
    *,
    service: Any,
    create_schema: type[BaseModel],
    update_schema: type[BaseModel],
    response_schema: type[BaseModel],
    noun: str,
) -> APIRouter:
    router = APIRouter()

    @router.post(
        "", response_model=APIResponse[response_schema], status_code=status.HTTP_201_CREATED
    )
    async def create_item(
        body: create_schema,
        db: Session = Depends(get_db),
        _: User = Depends(get_current_admin_user),
    ):
        item = service.create(db, body)
        return APIResponse(
            data=response_schema.model_validate(item),
            status=ResponseStatus.SUCCESS,
            message=f"{noun} created successfully",
            error_code=None,
        )

    @router.get("", response_model=APIResponse[PaginatedData[response_schema]])
    async def list_items(
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=100, ge=1, le=1000),
        db: Session = Depends(get_db),
        _: User = Depends(get_current_admin_user),
    ):
        total, items = service.list_items(db, skip=skip, limit=limit)
        return APIResponse(
            data=PaginatedData(
                items=[response_schema.model_validate(item) for item in items],
                total=total,
                skip=skip,
                limit=limit,
            ),
            status=ResponseStatus.SUCCESS,
            message=f"{noun} records retrieved successfully",
            error_code=None,
        )

    @router.get("/{item_id}", response_model=APIResponse[response_schema])
    async def get_item(
        item_id: int,
        db: Session = Depends(get_db),
        _: User = Depends(get_current_admin_user),
    ):
        item = service.get(db, item_id)
        return APIResponse(
            data=response_schema.model_validate(item),
            status=ResponseStatus.SUCCESS,
            message=f"{noun} retrieved successfully",
            error_code=None,
        )

    @router.patch("/{item_id}", response_model=APIResponse[response_schema])
    async def update_item(
        item_id: int,
        body: update_schema,
        db: Session = Depends(get_db),
        _: User = Depends(get_current_admin_user),
    ):
        item = service.update(db, item_id, body)
        return APIResponse(
            data=response_schema.model_validate(item),
            status=ResponseStatus.SUCCESS,
            message=f"{noun} updated successfully",
            error_code=None,
        )

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_item(
        item_id: int,
        db: Session = Depends(get_db),
        _: User = Depends(get_current_admin_user),
    ):
        service.delete(db, item_id)

    return router
