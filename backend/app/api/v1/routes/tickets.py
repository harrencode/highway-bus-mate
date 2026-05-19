from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse, ResponseStatus
from app.schemas.ticket import TicketCreate, TicketResponse, TicketUpdate
from app.services.ticket_service import TicketService

router = APIRouter()
service = TicketService()


@router.post("", response_model=APIResponse[TicketResponse], status_code=status.HTTP_201_CREATED)
async def create_ticket(
    body: TicketCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    ticket = service.create(db, body)
    return APIResponse(
        data=TicketResponse.model_validate(ticket),
        status=ResponseStatus.SUCCESS,
        message="Ticket created successfully",
        error_code=None,
    )


@router.get("/{ticket_id}", response_model=APIResponse[TicketResponse])
async def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    ticket = service.get(db, ticket_id)
    return APIResponse(
        data=TicketResponse.model_validate(ticket),
        status=ResponseStatus.SUCCESS,
        message="Ticket retrieved successfully",
        error_code=None,
    )


@router.patch("/{ticket_id}", response_model=APIResponse[TicketResponse])
async def update_ticket(
    ticket_id: int,
    body: TicketUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    ticket = service.update(db, ticket_id, body)
    return APIResponse(
        data=TicketResponse.model_validate(ticket),
        status=ResponseStatus.SUCCESS,
        message="Ticket updated successfully",
        error_code=None,
    )


@router.post("/{ticket_id}/verify", response_model=APIResponse[TicketResponse])
async def verify_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
):
    ticket = service.verify(db, ticket_id)
    return APIResponse(
        data=TicketResponse.model_validate(ticket),
        status=ResponseStatus.SUCCESS,
        message="Ticket verified successfully",
        error_code=None,
    )
