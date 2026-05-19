from app.api.v1.routes.crud import build_admin_crud_router
from app.schemas.pricing import PricingCreate, PricingResponse, PricingUpdate
from app.services.pricing_service import PricingService

router = build_admin_crud_router(
    service=PricingService(),
    create_schema=PricingCreate,
    update_schema=PricingUpdate,
    response_schema=PricingResponse,
    noun="Pricing",
)
