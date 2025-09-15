"""
API v1 router
"""
from fastapi import APIRouter

from app.api.v1.endpoints import conversation, modes, ideas, settings, mcp

router = APIRouter()

# Include endpoint routers
router.include_router(conversation.router, prefix="/conversation", tags=["conversation"])
router.include_router(modes.router, prefix="/modes", tags=["modes"])
router.include_router(ideas.router, prefix="/ideas", tags=["ideas"])
router.include_router(settings.router, prefix="/settings", tags=["settings"])
router.include_router(mcp.router, prefix="/mcp", tags=["mcp"])
