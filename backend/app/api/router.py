from fastapi import APIRouter

from app.api.v1.router import v1_router

api_router = APIRouter()

# Include v1 routes (prefix added by main.py via APIVersioning)
api_router.include_router(v1_router)
