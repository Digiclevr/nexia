"""
Nexia AI Engine Core avec LangSmith tracing
"""
from typing import Dict, Any, Optional
from datetime import datetime
import logging
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, SystemMessage

# Intégration LangSmith pour monitoring IA
from app.core.langsmith_integration import trace_conversation, trace_llm_call, trace_mode_processing

from app.core.modes import AVAILABLE_MODES, NexiaMode
from app.core.claude_bridge import ClaudeBridge
from app.core.mcp_shell import MCPShellServer
from app.core.mcp_git import MCPGitServer
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
            self.claude_bridge = ClaudeBridge()
            self.mcp_shell = MCPShellServer()
            self.mcp_git = MCPGitServer(self.mcp_shell)
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
        
        # Disable API LLMs by default - prefer Claude Bridge
        # Uncomment only if you want to use API tokens instead of Claude Max
        
        # if settings.openai_api_key:
        #     self.llms['openai'] = ChatOpenAI(
        #         api_key=settings.openai_api_key,
        #         model="gpt-4-turbo-preview"
        #     )
            
        # if settings.anthropic_api_key:
        #     self.llms['anthropic'] = ChatAnthropic(
        #         api_key=settings.anthropic_api_key,
        #         model="claude-3-opus-20240229"
        #     )
    
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
    
    @trace_conversation
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
    
    @trace_llm_call
    async def _get_llm_response(
        self, 
        system_prompt: str, 
        message: str,
        session_context: Dict[str, Any]
    ) -> str:
        """Get response from LLM or Claude Bridge"""
        
        # Try Claude Bridge first (uses Claude Max subscription)
        if self.claude_bridge.is_connected():
            try:
                bridge_response = await self.claude_bridge.ask_claude(message)
                logger.info("Response from Claude Bridge (Max subscription)")
                return bridge_response
            except Exception as e:
                logger.error(f"Claude Bridge Error: {e}")
        
        # Fallback to API LLMs
        llm = next(iter(self.llms.values())) if self.llms else None
        
        if llm:
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
        
        # Final fallback to pattern matching
        return self._get_fallback_response(message, AVAILABLE_MODES.get('project_assistant'))
    
    @trace_mode_processing
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
    
    def _get_fallback_response(self, message: str, mode) -> str:
        """Provide intelligent fallback when no LLM is configured"""
        
        # Analyze message for keywords and provide contextual responses
        msg_lower = message.lower()
        
        if any(word in msg_lower for word in ["projet", "task", "todo", "deadline"]):
            return f"""🎯 **Mode {mode.name}** - Je vois que tu parles de projets/tâches.
            
**Actions suggérées :**
• Consulte tes projets en cours dans l'onglet Dashboard
• Vérifie les deadlines approchantes
• Priorise tes tâches par impact/urgence

*Note: Configure une clé API (OpenAI/Anthropic) dans Settings pour des réponses IA complètes.*"""

        elif any(word in msg_lower for word in ["focus", "concentration", "distraction"]):
            return f"""🎯 **Focus Guardian activé** - Je détecte un besoin de concentration.
            
**Stratégies recommandées :**
• Time-boxing : 25min focus → 5min pause
• Bloquer notifications non-critiques
• Une seule tâche à la fois
• Parking des idées parasites

*Configure une clé API pour un coaching personnalisé.*"""

        elif any(word in msg_lower for word in ["opportunité", "business", "marché", "client"]):
            return f"""🚀 **Opportunity Hunter** - Excellent radar business !
            
**Angles d'analyse :**
• Qui a ce problème exactement ?
• Taille du marché addressable ?
• Concurrence indirecte ?
• Validation rapide possible ?

*Avec une clé API, j'analyserais plus finement tes opportunités.*"""

        else:
            return f"""👋 **{mode.name}** - Message reçu !

**Capacités disponibles :**
{chr(10).join(f"• {cap}" for cap in mode.capabilities)}

**Pour débloquer l'IA :** Configure ta clé API dans Settings → Tu auras des réponses personnalisées et contextuelles.

**Modes disponibles :** Focus Guardian, Opportunity Hunter, Socratic Challenger, Project Assistant"""
    
    async def end_session(self, session_id: str):
        """End a conversation session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
