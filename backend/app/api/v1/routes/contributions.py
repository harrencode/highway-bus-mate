from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_current_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, PaginatedData, ResponseStatus
from app.schemas.contribution import ContributionCreate, ContributionResponse, ContributionReview
from app.services.contribution_service import ContributionService

router = APIRouter()
service = ContributionService()


@router.post(
    "/me", response_model=APIResponse[ContributionResponse], status_code=status.HTTP_201_CREATED
)
async def submit_contribution(
    body: ContributionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contribution = service.create_for_user(db, current_user.id, body)
    return APIResponse(
        data=ContributionResponse.model_validate(contribution),
        status=ResponseStatus.SUCCESS,
        message="Contribution submitted successfully",
        error_code=None,
    )


@router.get("", response_model=APIResponse[PaginatedData[ContributionResponse]])
async def list_contributions(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    total, contributions = service.list_items(db, skip=skip, limit=limit)
    return APIResponse(
        data=PaginatedData(
            items=[ContributionResponse.model_validate(item) for item in contributions],
            total=total,
            skip=skip,
            limit=limit,
        ),
        status=ResponseStatus.SUCCESS,
        message="Contributions retrieved successfully",
        error_code=None,
    )


@router.post("/{contribution_id}/review", response_model=APIResponse[ContributionResponse])
async def review_contribution(
    contribution_id: int,
    body: ContributionReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    contribution = service.review(db, contribution_id, current_user.id, body)
    return APIResponse(
        data=ContributionResponse.model_validate(contribution),
        status=ResponseStatus.SUCCESS,
        message="Contribution reviewed successfully",
        error_code=None,
    )
