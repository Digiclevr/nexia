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
    Update API keys - Note: Claude Bridge is preferred over API keys
    """
    try:
        # Check if Claude Bridge is available first
        try:
            from app.core.claude_bridge import ClaudeBridge
            claude_bridge = ClaudeBridge()
            if claude_bridge.is_connected():
                return {
                    "message": "🚀 Nexia utilise déjà Claude Bridge avec votre abonnement Max !",
                    "claude_bridge_active": True,
                    "note": "Pas besoin de clés API - vous utilisez Claude.ai directement",
                    "configured": {
                        "claude_bridge": True,
                        "openai": False,
                        "anthropic": False,
                        "gemini": False,
                        "perplexity": False,
                    }
                }
        except Exception as e:
            logger.info(f"Claude Bridge not available, falling back to API keys: {e}")
        
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
            "claude_bridge_active": False,
            "configured": {
                "claude_bridge": False,
                "openai": bool(saved_settings.get("openai_api_key")),
                "anthropic": bool(saved_settings.get("anthropic_api_key")),
                "gemini": bool(saved_settings.get("gemini_api_key")),
                "perplexity": bool(saved_settings.get("perplexity_api_key")),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/claude-bridge/status")
async def check_claude_bridge():
    """
    Check Claude Bridge status
    """
    try:
        from app.core.claude_bridge import ClaudeBridge
        claude_bridge = ClaudeBridge()
        is_connected = claude_bridge.is_connected()
        
        return {
            "claude_bridge_available": True,
            "is_connected": is_connected,
            "status": "✅ Claude Bridge actif - utilise votre abonnement Max" if is_connected else "⏳ Claude Bridge disponible mais non connecté",
            "method": "Browser automation vers Claude.ai"
        }
    except Exception as e:
        return {
            "claude_bridge_available": False,
            "is_connected": False,
            "status": f"❌ Claude Bridge non disponible: {str(e)}",
            "method": "Fallback API keys requis"
        }


@router.post("/claude-bridge/authenticate")
async def authenticate_claude_bridge():
    """
    Authenticate Claude Bridge - tries to establish session
    """
    try:
        from app.core.claude_bridge import ClaudeBridge
        claude_bridge = ClaudeBridge()
        
        # Try to setup browser and check authentication
        success = await claude_bridge._setup_browser()
        
        if success and claude_bridge.session_active:
            return {
                "success": True,
                "message": "🎉 Authentification réussie !",
                "status": "authenticated"
            }
        else:
            return {
                "success": False,
                "message": "⚠️ Authentification requise",
                "instructions": "Veuillez vous connecter à https://claude.ai dans votre navigateur, puis réessayer.",
                "status": "auth_required"
            }
            
    except Exception as e:
        return {
            "success": False,
            "message": f"❌ Erreur: {str(e)}",
            "status": "error"
        }

@router.post("/claude-bridge/test")
async def test_claude_bridge():
    """
    Test Claude Bridge connection
    """
    try:
        from app.core.claude_bridge import ClaudeBridge
        claude_bridge = ClaudeBridge()
        
        test_response = await claude_bridge.ask_claude("Bonjour ! Peux-tu me confirmer que NEXIA fonctionne bien ?")
        
        # Check if response indicates auth needed
        if "authentification requise" in test_response.lower() or "authentication" in test_response.lower():
            return {
                "success": False,
                "response": test_response,
                "message": "⚠️ Authentification requise - utilisez d'abord 'Setup Claude Bridge'",
                "status": "auth_required"
            }
        
        return {
            "success": True,
            "response": test_response,
            "message": "🎉 Claude Bridge fonctionne parfaitement !",
            "status": "connected"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"❌ Erreur test: {str(e)}",
            "status": "error"
        }
