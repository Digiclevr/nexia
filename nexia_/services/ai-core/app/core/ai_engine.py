"""
Nexia AI Engine Core
"""
from typing import Dict, Any, Optional
from datetime import datetime
import logging
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, SystemMessage

from app.core.modes import AVAILABLE_MODES, NexiaMode
from app.models.conversation import ConversationResponse, Session
from app.config import settings

logger = logging.getLogger(__name__)


class NexiaEngine:
    """Main AI Engine for Nexia"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.modes = AVAILABLE_MODES
            self.sessions: Dict[str, Session] = {}
            self._init_llms()
            self.initialized = True
    
    def _init_llms(self):
        """Initialize LLM clients"""
        self.llms = {}
        
        # Charger les clés depuis le fichier de settings si elles existent
        from pathlib import Path
        import json
        
        settings_file = Path.home() / ".nexia" / "settings.json"
        if settings_file.exists():
            with open(settings_file, 'r') as f:
                saved_settings = json.load(f)
                
            # Mettre à jour les settings avec les clés sauvegardées
            if saved_settings.get('openai_api_key'):
                settings.openai_api_key = saved_settings['openai_api_key']
            if saved_settings.get('anthropic_api_key'):
                settings.anthropic_api_key = saved_settings['anthropic_api_key']
        
        if settings.openai_api_key:
            self.llms['openai'] = ChatOpenAI(
                api_key=settings.openai_api_key,
                model="gpt-4-turbo-preview"
            )
            
        if settings.anthropic_api_key:
            self.llms['anthropic'] = ChatAnthropic(
                api_key=settings.anthropic_api_key,
                model="claude-3-opus-20240229"
            )
    
    def reinit_llms(self):
        """Reinitialize LLMs (used when API keys are updated)"""
        self._init_llms()
    
    async def create_session(self) -> Session:
        """Create a new conversation session"""
        session = Session(
            id=f"session_{datetime.now().timestamp()}",
            created_at=datetime.now(),
            mode=settings.nexia_default_mode,
            context={}
        )
        self.sessions[session.id] = session
        return session
    
    async def process_message(
        self, 
        message: str, 
        session_id: str, 
        context: Dict[str, Any]
    ) -> ConversationResponse:
        """Process a message from the user"""
        
        # Get or create session
        session = self.sessions.get(session_id)
        if not session:
            session = await self.create_session()
            session.id = session_id
            self.sessions[session_id] = session
        
        # Get current mode
        mode = self.modes.get(session.mode)
        if not mode:
            mode = self.modes[settings.nexia_default_mode]
        
        # Build prompt with mode personality
        system_prompt = self._build_system_prompt(mode, context)
        
        # Get response from LLM
        response_text = await self._get_llm_response(
            system_prompt, 
            message,
            session.context
        )
        
        # Process mode-specific actions
        actions = await self._process_mode_actions(mode, message, response_text)
        
        # Update session context
        session.context['last_message'] = message
        session.context['last_response'] = response_text
        
        return ConversationResponse(
            response=response_text,
            mode=session.mode,
            actions=actions,
            metadata={
                "session_id": session_id,
                "timestamp": datetime.now().isoformat()
            }
        )
    
    def _build_system_prompt(self, mode: NexiaMode, context: Dict[str, Any]) -> str:
        """Build system prompt based on mode"""
        base_prompt = f"""Tu es Nexia, un assistant IA spécialisé pour les entrepreneurs TDAH.
        
Mode actuel: {mode.name}
Description: {mode.description}

Capacités spécifiques:
{chr(10).join(f"- {cap}" for cap in mode.capabilities)}

Instructions: {mode.system_prompt}

Contexte utilisateur: {context}
"""
        return base_prompt
    
    async def _get_llm_response(
        self, 
        system_prompt: str, 
        message: str,
        session_context: Dict[str, Any]
    ) -> str:
        """Get response from LLM"""
        # Use the first available LLM
        llm = next(iter(self.llms.values())) if self.llms else None
        
        if not llm:
            return "Désolé, aucun modèle IA n'est configuré. Veuillez configurer une clé API."
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=message)
        ]
        
        try:
            response = await llm.agenerate([messages])
            return response.generations[0][0].text
        except Exception as e:
            logger.error(f"LLM Error: {e}")
            return "Désolé, une erreur s'est produite. Pouvez-vous reformuler?"
    
    async def _process_mode_actions(
        self, 
        mode: NexiaMode, 
        message: str, 
        response: str
    ) -> Dict[str, Any]:
        """Process mode-specific actions"""
        actions = {}
        
        # Mode-specific logic
        if mode.id == "focus_guardian":
            # Check for distractions or ideas to park
            if any(word in message.lower() for word in ["idée", "penser", "et si"]):
                actions["park_idea"] = True
                
        elif mode.id == "opportunity_hunter":
            # Check for business opportunities
            if any(word in message.lower() for word in ["marché", "client", "besoin"]):
                actions["analyze_opportunity"] = True
                
        elif mode.id == "socratic_challenger":
            # Generate challenging questions
            actions["generate_questions"] = True
        
        return actions
    
    async def end_session(self, session_id: str):
        """End a conversation session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
