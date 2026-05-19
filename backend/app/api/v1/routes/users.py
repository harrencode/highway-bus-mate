"""
User Endpoints

Handles user registration, admin user creation, and user management.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_current_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.user import UserCreate, UserRegister, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()
service = UserService()


@router.post(
    "/register",
    response_model=APIResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
)
async def register_user(
    body: UserRegister,
    db: Session = Depends(get_db),
):
    """
    Register a new user account (open — no authentication required).

    Role defaults to USER.
    """
    user = service.register(db, body)
    return APIResponse(
        data=UserResponse.model_validate(user),
        status=ResponseStatus.SUCCESS,
        message="User registered successfully",
        error_code=None,
    )


@router.post(
    "",
    response_model=APIResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_user(
    body: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    """
    Create a user with an explicit role (admin only).
    """
    user = service.create(db, body)
    return APIResponse(
        data=UserResponse.model_validate(user),
        status=ResponseStatus.SUCCESS,
        message="User created successfully",
        error_code=None,
    )


@router.get("", response_model=APIResponse[PaginatedData[UserResponse]])
async def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    """
    List all users with pagination (admin only).
    """
    total, users = service.list_users(db, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[UserResponse.model_validate(u) for u in users],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Users retrieved successfully",
        error_code=None,
    )


@router.get("/me", response_model=APIResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Return the currently authenticated user's profile.
    """
    return APIResponse(
        data=UserResponse.model_validate(current_user),
        status=ResponseStatus.SUCCESS,
        message="OK",
        error_code=None,
    )


@router.get("/search", response_model=APIResponse[PaginatedData[UserResponse]])
async def search_users(
    query: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    """
    Search users by username or email (admin only).

    Case-insensitive partial match on username and email fields.
    """
    total, users = service.search(db, query=query, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[UserResponse.model_validate(u) for u in users],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Search completed successfully",
        error_code=None,
    )


@router.get("/{user_id}", response_model=APIResponse[UserResponse])
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    """
    Get a specific user by ID (admin only).
    """
    user = service.get(db, user_id)
    return APIResponse(
        data=UserResponse.model_validate(user),
        status=ResponseStatus.SUCCESS,
        message="User retrieved successfully",
        error_code=None,
    )


@router.patch("/{user_id}", response_model=APIResponse[UserResponse])
async def update_user(
    user_id: int,
    body: UserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    """
    Update a user's information (admin only, partial update).
    """
    user = service.update(db, user_id, body)
    return APIResponse(
        data=UserResponse.model_validate(user),
        status=ResponseStatus.SUCCESS,
        message="User updated successfully",
        error_code=None,
    )


@router.put("/change-password", response_model=APIResponse[UserResponse])
async def change_password(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Change the current user's password (partial update).

    Only updates the password field, other fields are ignored.
    """
    user = service.update(db, current_user.id, body)
    return APIResponse(
        data=UserResponse.model_validate(user),
        status=ResponseStatus.SUCCESS,
        message="Password changed successfully",
        error_code=None,
    )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    """
    Delete a user (admin only).
    """
    service.delete(db, user_id)
