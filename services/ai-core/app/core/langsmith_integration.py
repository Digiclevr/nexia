"""
LangSmith Integration pour NEXIA AI Engine
Module séparé pour le tracing et monitoring des agents IA
"""

import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from functools import wraps

# Imports conditionels pour éviter erreurs si LangSmith pas installé
try:
    from langsmith import Client
    from langsmith.decorators import traceable
    from langsmith.run_helpers import trace
    import langsmith
    LANGSMITH_AVAILABLE = True
except ImportError:
    LANGSMITH_AVAILABLE = False
    logging.warning("LangSmith not available - install with: pip install langsmith")

logger = logging.getLogger(__name__)

class NexiaLangSmithTracker:
    """Gestionnaire centralise pour LangSmith tracing dans NEXIA"""
    
    def __init__(self):
        self.enabled = False
        self.client = None
        self._setup_langsmith()
    
    def _setup_langsmith(self):
        """Setup LangSmith avec configuration automatique"""
        if not LANGSMITH_AVAILABLE:
            logger.info("🔄 LangSmith SDK non disponible - tracing désactivé")
            return
            
        try:
            # Configuration environnement
            os.environ.setdefault("LANGSMITH_PROJECT", "nexia-agents")
            os.environ.setdefault("LANGSMITH_TRACING", "true")
            
            # Client pour métriques custom
            self.client = Client()
            self.enabled = True
            logger.info("✅ LangSmith configuré - Tracing agents IA activé")
            
        except Exception as e:
            logger.warning(f"⚠️ LangSmith configuration échouée: {e}")
            self.enabled = False
    
    def trace_conversation(self, func):
        """Decorator pour tracer les conversations NEXIA"""
        if not self.enabled:
            return func
            
        @traceable(name="nexia-conversation")
        @wraps(func)
        async def wrapper(self_engine, message: str, session_id: str, context: Dict[str, Any]):
            # Ajout métadonnées conversation
            with trace("nexia-context") as ctx_trace:
                ctx_trace.update(
                    inputs={
                        "message": message,
                        "session_id": session_id,
                        "context": context
                    },
                    metadata={
                        "timestamp": datetime.now().isoformat(),
                        "user_type": "entrepreneur_tdah",
                        "session_type": context.get("session_type", "standard")
                    }
                )
                
            # Exécution fonction originale
            result = await func(self_engine, message, session_id, context)
            
            # Log métriques post-processing
            await self._log_conversation_metrics(message, result, session_id)
            
            return result
        return wrapper
    
    def trace_llm_call(self, func):
        """Decorator pour tracer les appels LLM"""
        if not self.enabled:
            return func
            
        @traceable(name="nexia-llm-call")  
        @wraps(func)
        async def wrapper(self_engine, system_prompt: str, message: str, session_context: Dict[str, Any]):
            start_time = datetime.now()
            
            with trace("llm-processing") as llm_trace:
                llm_trace.update(
                    inputs={
                        "system_prompt": system_prompt,
                        "user_message": message
                    },
                    metadata={
                        "prompt_tokens_est": len(system_prompt.split()) + len(message.split()),
                        "model_used": "claude-bridge-or-api",
                        "timestamp": start_time.isoformat()
                    }
                )
                
                # Exécution appel LLM
                response = await func(self_engine, system_prompt, message, session_context)
                
                # Métriques performance
                end_time = datetime.now()
                latency_ms = (end_time - start_time).total_seconds() * 1000
                
                llm_trace.update(
                    outputs={"response": response},
                    metadata={
                        "latency_ms": latency_ms,
                        "response_tokens_est": len(response.split()),
                        "success": True,
                        "response_length": len(response)
                    }
                )
                
            return response
        return wrapper
    
    def trace_mode_processing(self, func):
        """Decorator pour tracer le processing par mode IA"""
        if not self.enabled:
            return func
            
        @traceable(name="nexia-mode-processing")
        @wraps(func)
        async def wrapper(self_engine, mode, message: str, response: str):
            with trace("mode-actions") as mode_trace:
                mode_trace.update(
                    inputs={
                        "mode": mode.name if hasattr(mode, 'name') else str(mode),
                        "message": message,
                        "response": response
                    },
                    metadata={
                        "mode_id": getattr(mode, 'id', 'unknown'),
                        "mode_capabilities": getattr(mode, 'capabilities', []),
                        "timestamp": datetime.now().isoformat()
                    }
                )
                
                actions = await func(self_engine, mode, message, response)
                
                mode_trace.update(
                    outputs={"actions": actions},
                    metadata={
                        "actions_count": len(actions),
                        "actions_types": list(actions.keys()) if isinstance(actions, dict) else []
                    }
                )
                
            return actions
        return wrapper
    
    async def _log_conversation_metrics(self, message: str, result, session_id: str):
        """Log métriques business pour analyse"""
        if not self.enabled or not self.client:
            return
            
        try:
            # Analyse satisfaction estimée
            satisfaction = self._estimate_satisfaction(message, result.response if hasattr(result, 'response') else str(result))
            
            # Métriques business
            business_data = {
                "session_id": session_id,
                "user_satisfaction_est": satisfaction,
                "response_relevance": self._estimate_relevance(message, result.response if hasattr(result, 'response') else str(result)),
                "mode_used": getattr(result, 'mode', 'unknown'),
                "actions_triggered": len(getattr(result, 'actions', {})),
                "timestamp": datetime.now().isoformat(),
                "conversation_type": "nexia_ai_assistant"
            }
            
            # Create custom run pour business metrics
            self.client.create_run(
                name="nexia-business-metrics",
                inputs=business_data,
                run_type="chain",
                project_name="nexia-agents"
            )
            
        except Exception as e:
            logger.warning(f"Business metrics logging failed: {e}")
    
    def _estimate_satisfaction(self, message: str, response: str) -> float:
        """Estimation satisfaction utilisateur basée sur heuristiques"""
        satisfaction = 0.7  # baseline
        
        # Facteurs positifs
        if len(response) > len(message) * 1.5:
            satisfaction += 0.1  # Réponse détaillée
            
        if any(word in response.lower() for word in ["recommande", "suggère", "aide", "solution"]):
            satisfaction += 0.1  # Réponse actionnable
            
        if any(word in response.lower() for word in ["focus", "tdah", "productivité", "entrepreneur"]):
            satisfaction += 0.05  # Contexte personnalisé
            
        # Facteurs négatifs
        if "erreur" in response.lower() or "désolé" in response.lower():
            satisfaction -= 0.2
            
        if len(response) < 50:
            satisfaction -= 0.1  # Réponse trop courte
            
        return max(0.0, min(1.0, satisfaction))
    
    def _estimate_relevance(self, message: str, response: str) -> float:
        """Estimation pertinence de la réponse"""
        relevance = 0.6  # baseline
        
        # Mots clés communs (simple overlap)
        message_words = set(message.lower().split())
        response_words = set(response.lower().split())
        
        overlap = len(message_words.intersection(response_words))
        relevance += min(0.3, overlap / len(message_words) * 0.3)
        
        return max(0.0, min(1.0, relevance))

# Instance globale
nexia_tracker = NexiaLangSmithTracker()

# Exports pour utilisation facile
trace_conversation = nexia_tracker.trace_conversation
trace_llm_call = nexia_tracker.trace_llm_call  
trace_mode_processing = nexia_tracker.trace_mode_processing