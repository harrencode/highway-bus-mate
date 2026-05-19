from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.payment import PaymentCreate, PaymentResponse, PaymentUpdate
from app.services.payment_service import PaymentService

router = build_admin_crud_router(
    service=PaymentService(),
    create_schema=PaymentCreate,
    update_schema=PaymentUpdate,
    response_schema=PaymentResponse,
    noun="Payment",
)
