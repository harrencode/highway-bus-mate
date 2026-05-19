from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, ResponseStatus
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate
from app.services.review_service import ReviewService

router = APIRouter()
service = ReviewService()


@router.post("", response_model=APIResponse[ReviewResponse])
async def create_review(
    body: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = service.create_for_user(db, current_user.id, body)
    return APIResponse(
        data=ReviewResponse.model_validate(review),
        status=ResponseStatus.SUCCESS,
        message="Review created successfully",
        error_code=None,
    )


@router.get("/bus/{bus_id}", response_model=APIResponse[list[ReviewResponse]])
async def list_bus_reviews(
    bus_id: int,
    db: Session = Depends(get_db),
):
    reviews = service.list_for_bus(db, bus_id)
    return APIResponse(
        data=[ReviewResponse.model_validate(item) for item in reviews],
        status=ResponseStatus.SUCCESS,
        message="Reviews retrieved successfully",
        error_code=None,
    )


@router.patch("/{review_id}", response_model=APIResponse[ReviewResponse])
async def update_review(
    review_id: int,
    body: ReviewUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    review = service.update(db, review_id, body)
    return APIResponse(
        data=ReviewResponse.model_validate(review),
        status=ResponseStatus.SUCCESS,
        message="Review updated successfully",
        error_code=None,
    )
