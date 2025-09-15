"""
Conversation models
"""
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime


class Session(BaseModel):
    """Conversation session model"""
    id: str
    created_at: datetime
    mode: str = "focus_guardian"
    context: Dict[str, Any] = {}


class ConversationRequest(BaseModel):
    """Request model for conversations"""
    message: str
    session_id: str
    context: Optional[Dict[str, Any]] = {}


class ConversationResponse(BaseModel):
    """Response model for conversations"""
    response: str
    mode: str
    actions: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}
