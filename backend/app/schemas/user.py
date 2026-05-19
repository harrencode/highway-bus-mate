from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator

from app.models.enums import UserRole
from app.utils.validators import is_strong_password

_WEAK_PASSWORD_MSG = (
    "Password must be at least 8 characters and contain " "uppercase, lowercase, and a digit"
)


class UserRegister(BaseModel):
    """Public registration schema - open endpoint."""

    username: str
    full_name: str | None = None
    email: EmailStr
    phone: str | None = None
    password: str

    @field_validator("username")
    @classmethod
    def username_min_length(cls, v: str) -> str:
        if len(v.strip()) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not is_strong_password(v):
            raise ValueError(_WEAK_PASSWORD_MSG)
        return v


class UserCreate(BaseModel):
    """Admin-created user schema - allows role assignment."""

    username: str
    full_name: str | None = None
    email: EmailStr
    phone: str | None = None
    password: str
    role: UserRole = UserRole.USER

    @field_validator("username")
    @classmethod
    def username_min_length(cls, v: str) -> str:
        if len(v.strip()) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not is_strong_password(v):
            raise ValueError(_WEAK_PASSWORD_MSG)
        return v


class UserUpdate(BaseModel):
    """Partial update schema - all fields optional."""

    username: str | None = None
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    password: str | None = None
    is_active: bool | None = None
    role: UserRole | None = None

    @field_validator("username")
    @classmethod
    def username_min_length(cls, v: str | None) -> str | None:
        if v is not None and len(v.strip()) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v.strip() if v is not None else v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str | None) -> str | None:
        if v is not None and not is_strong_password(v):
            raise ValueError(_WEAK_PASSWORD_MSG)
        return v


class UserResponse(BaseModel):
    """User response schema."""

    id: int
    username: str
    full_name: str | None
    email: str
    phone: str | None
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    """Login credentials schema."""

    username: str
    password: str


class Token(BaseModel):
    """JWT token pair response schema."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Refresh token request schema."""

    refresh_token: str
