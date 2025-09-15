"""
Settings endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
import os
import json
import logging
from pathlib import Path

from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Stockage local des clés en développement
SETTINGS_FILE = Path.home() / ".nexia" / "settings.json"


class ApiKeysRequest(BaseModel):
    openai: Optional[str] = None
    anthropic: Optional[str] = None
    gemini: Optional[str] = None
    perplexity: Optional[str] = None


class SettingsResponse(BaseModel):
    api_keys: Dict[str, bool]  # Indique si une clé est configurée
    environment: str


def load_settings():
    """Load settings from file"""
    if SETTINGS_FILE.exists():
        with open(SETTINGS_FILE, 'r') as f:
            return json.load(f)
    return {}


def save_settings(data: dict):
    """Save settings to file"""
    SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(data, f, indent=2)


@router.get("/", response_model=SettingsResponse)
async def get_settings():
    """
    Get current settings (without exposing actual keys)
    """
    saved_settings = load_settings()
    
    return SettingsResponse(
        api_keys={
            "openai": bool(saved_settings.get("openai_api_key") or settings.openai_api_key),
            "anthropic": bool(saved_settings.get("anthropic_api_key") or settings.anthropic_api_key),
            "gemini": bool(saved_settings.get("gemini_api_key") or settings.gemini_api_key),
            "perplexity": bool(saved_settings.get("perplexity_api_key") or settings.perplexity_api_key),
        },
        environment=settings.environment
    )


@router.post("/api-keys")
async def update_api_keys(request: ApiKeysRequest):
    """
    Update API keys
    """
    try:
        saved_settings = load_settings()
        
        # Update settings
        if request.openai:
            saved_settings["openai_api_key"] = request.openai
            settings.openai_api_key = request.openai
        if request.anthropic:
            saved_settings["anthropic_api_key"] = request.anthropic
            settings.anthropic_api_key = request.anthropic
        if request.gemini:
            saved_settings["gemini_api_key"] = request.gemini
            settings.gemini_api_key = request.gemini
        if request.perplexity:
            saved_settings["perplexity_api_key"] = request.perplexity
            settings.perplexity_api_key = request.perplexity
        
        # Save to file
        save_settings(saved_settings)
        
        # Reinitialize AI engine with new keys
        try:
            from app.core.ai_engine import NexiaEngine
            engine = NexiaEngine()
            engine.reinit_llms()
        except Exception as e:
            logger.warning(f"Could not reinitialize AI engine: {e}")
        
        return {
            "message": "API keys updated successfully",
            "configured": {
                "openai": bool(saved_settings.get("openai_api_key")),
                "anthropic": bool(saved_settings.get("anthropic_api_key")),
                "gemini": bool(saved_settings.get("gemini_api_key")),
                "perplexity": bool(saved_settings.get("perplexity_api_key")),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
