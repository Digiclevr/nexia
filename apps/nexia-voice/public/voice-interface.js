class NexiaVoiceInterface {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isProcessing = false;
        
        this.voiceButton = document.getElementById('voiceButton');
        this.statusText = document.querySelector('.status-text');
        this.responseText = document.getElementById('responseText');
        this.errorMessage = document.getElementById('errorMessage');
        this.nexiaStatus = document.getElementById('nexiaStatus');
        this.onlyoneStatus = document.getElementById('onlyoneStatus');
        
        this.init();
    }
    
    init() {
        this.setupSpeechRecognition();
        this.setupEventListeners();
        this.checkConnections();
        
        // Check connections every 30 seconds
        setInterval(() => this.checkConnections(), 30000);
    }
    
    setupSpeechRecognition() {
        // Check if Web Speech API is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError('Web Speech API non supportée. Utilisez Chrome ou Safari récent.');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'fr-FR';
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
            this.updateStatus('🎧 Écoute en cours... Parlez maintenant');
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.updateStatus(`🎯 Compris: "${transcript}"`);
            this.processVoiceCommand(transcript);
        };
        
        this.recognition.onerror = (event) => {
            this.showError(`Erreur reconnaissance vocale: ${event.error}`);
            this.resetUI();
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            if (!this.isProcessing) {
                this.resetUI();
            }
        };
    }
    
    setupEventListeners() {
        this.voiceButton.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !this.isListening && !this.isProcessing) {
                event.preventDefault();
                this.startListening();
            }
        });
    }
    
    startListening() {
        if (!this.recognition) {
            this.showError('Reconnaissance vocale non disponible');
            return;
        }
        
        this.hideError();
        this.recognition.start();
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    async processVoiceCommand(transcript) {
        this.isProcessing = true;
        this.updateUI('processing');
        this.updateStatus('🤖 Traitement avec OnlyOneAPI...');
        
        try {
            // Analyze command with OnlyOneAPI LLM
            const llmResponse = await this.queryOnlyOneAPI(transcript);
            
            // Execute NEXIA command if identified
            const commandResult = await this.executeNexiaCommand(llmResponse);
            
            // Synthesize response
            this.speakResponse(commandResult.message);
            this.updateResponseText(commandResult.message);
            
        } catch (error) {
            console.error('Voice processing error:', error);
            this.showError(`Erreur traitement: ${error.message}`);
        } finally {
            this.isProcessing = false;
            this.resetUI();
        }
    }
    
    async queryOnlyOneAPI(userInput) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: `Tu es NEXIA, l'assistant vocal pour contrôler l'écosystème technique. 
                        
                        Commandes disponibles:
                        - "status" ou "état" → Status global
                        - "health" ou "santé" → Health check
                        - "ecosystems" ou "écosystèmes" → État des écosystèmes
                        - "deploy [ecosystem]" → Déploiement
                        
                        Réponds TOUJOURS par un JSON: {"command":"status|health|ecosystems|deploy", "ecosystem":"nom_si_deploy", "message":"réponse_utilisateur"}
                        
                        Exemples:
                        - "Comment ça va ?" → {"command":"status", "message":"Je vérifie le status global"}
                        - "État de BlueOcean" → {"command":"ecosystems", "message":"Je vérifie l'état des écosystèmes"}
                        - "Déploie KREACH" → {"command":"deploy", "ecosystem":"kreach", "message":"Je déploie KREACH"}`
                    },
                    {
                        role: 'user',
                        content: userInput
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error('OnlyOneAPI non disponible');
        }
        
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }
    
    async executeNexiaCommand(commandData) {
        try {
            const response = await fetch('/api/nexia-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    command: commandData.command,
                    ecosystem: commandData.ecosystem
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    message: this.formatNexiaResponse(commandData.command, result.data)
                };
            } else {
                return {
                    success: false,
                    message: `Erreur NEXIA: ${result.message}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `NEXIA non disponible: ${error.message}`
            };
        }
    }
    
    formatNexiaResponse(command, data) {
        switch (command) {
            case 'status':
                return `NEXIA est ${data.status === 'active' ? 'actif' : 'inactif'}. Uptime: ${Math.round(data.uptime / 1000)} secondes.`;
            
            case 'health':
                return `Health check: ${data.status}. Tous les services sont ${data.status === 'healthy' ? 'opérationnels' : 'en problème'}.`;
            
            case 'ecosystems':
                const summary = data.summary;
                return `État écosystèmes: ${summary.healthy} sains, ${summary.warning} en alerte, ${summary.unhealthy} défaillants sur ${summary.total} total.`;
            
            case 'deploy':
                return data.message || 'Déploiement lancé avec succès.';
            
            default:
                return 'Commande exécutée.';
        }
    }
    
    speakResponse(text) {
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            this.synthesis.speak(utterance);
        }
    }
    
    async checkConnections() {
        // Check NEXIA Supervisor
        try {
            const nexiaResponse = await fetch('/api/nexia-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: 'health' })
            });
            
            if (nexiaResponse.ok) {
                this.nexiaStatus.classList.add('connected');
            } else {
                this.nexiaStatus.classList.remove('connected');
            }
        } catch {
            this.nexiaStatus.classList.remove('connected');
        }
        
        // Check OnlyOneAPI (simple test)
        try {
            const testResponse = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'test' }]
                })
            });
            
            if (testResponse.ok) {
                this.onlyoneStatus.classList.add('connected');
            } else {
                this.onlyoneStatus.classList.remove('connected');
            }
        } catch {
            this.onlyoneStatus.classList.remove('connected');
        }
    }
    
    async quickCommand(command) {
        this.hideError();
        this.isProcessing = true;
        this.updateUI('processing');
        
        try {
            const response = await fetch('/api/nexia-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });
            
            const result = await response.json();
            const message = this.formatNexiaResponse(command, result.data);
            
            this.speakResponse(message);
            this.updateResponseText(message);
            
        } catch (error) {
            this.showError(`Erreur commande rapide: ${error.message}`);
        } finally {
            this.isProcessing = false;
            this.resetUI();
        }
    }
    
    updateUI(state) {
        this.voiceButton.className = 'voice-button';
        
        switch (state) {
            case 'listening':
                this.voiceButton.classList.add('listening');
                this.voiceButton.innerHTML = '🎧';
                break;
            case 'processing':
                this.voiceButton.classList.add('processing');
                this.voiceButton.innerHTML = '🤖';
                break;
            default:
                this.voiceButton.innerHTML = '🎤';
        }
    }
    
    resetUI() {
        this.updateUI('idle');
        this.updateStatus('Cliquez sur le micro ou appuyez sur Espace');
    }
    
    updateStatus(text) {
        this.statusText.textContent = text;
    }
    
    updateResponseText(text) {
        this.responseText.textContent = text;
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Global function for quick commands
function quickCommand(command) {
    if (window.nexiaVoice) {
        window.nexiaVoice.quickCommand(command);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.nexiaVoice = new NexiaVoiceInterface();
});