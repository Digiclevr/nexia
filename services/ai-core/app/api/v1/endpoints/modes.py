"""
Modes management endpoints
"""
from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

from app.core.modes import NexiaMode, AVAILABLE_MODES

router = APIRouter()


class ModeInfo(BaseModel):
    id: str
    name: str
    description: str
    capabilities: List[str]


class SwitchModeRequest(BaseModel):
    session_id: str
    mode: str


@router.get("/", response_model=List[ModeInfo])
async def get_available_modes():
    """
    Get all available Nexia modes
    """
    return [
        ModeInfo(
            id=mode_id,
            name=mode.name,
            description=mode.description,
            capabilities=mode.capabilities
        )
        for mode_id, mode in AVAILABLE_MODES.items()
    ]


@router.get("/current/{session_id}")
async def get_current_mode(session_id: str):
    """
    Get current mode for a session
    """
    # TODO: Implement session mode tracking
    return {"mode": "focus_guardian", "session_id": session_id}


@router.post("/switch")
async def switch_mode(request: SwitchModeRequest):
    """
    Switch mode for a session
    """
    # TODO: Implement mode switching logic
    return {
        "session_id": request.session_id,
        "new_mode": request.mode,
        "status": "switched"
    }
