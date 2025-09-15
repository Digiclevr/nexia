"""
Conversation endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel

from app.core.ai_engine import NexiaEngine
from app.models.conversation import ConversationRequest, ConversationResponse

router = APIRouter()
nexia_engine = NexiaEngine()


class MessageRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}
    session_id: str


@router.post("/chat", response_model=ConversationResponse)
async def chat_with_nexia(request: MessageRequest):
    """
    Main chat endpoint for Nexia
    """
    try:
        response = await nexia_engine.process_message(
            message=request.message,
            session_id=request.session_id,
            context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/start-session")
async def start_session():
    """
    Start a new conversation session
    """
    session = await nexia_engine.create_session()
    return {"session_id": session.id, "created_at": session.created_at}


@router.post("/end-session/{session_id}")
async def end_session(session_id: str):
    """
    End a conversation session
    """
    await nexia_engine.end_session(session_id)
    return {"message": "Session ended successfully"}
