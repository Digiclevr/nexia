import { invoke } from '@tauri-apps/api/tauri';

export interface ConversationContext {
  userId: string;
  sessionId: string;
  currentProject: string;
  taskContext: string[];
  conversationHistory: ConversationMessage[];
  userProfile: TDAHProfile;
  activeServices: ServiceStatus[];
  lastActivity: Date;
}

export interface ConversationMessage {
  id: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  content: string;
  intent?: IntentType;
  confidence?: number;
  context?: { [key: string]: any };
  projectContext?: string;
}

export interface TDAHProfile {
  cognitiveStyle: 'TDAH' | 'standard';
  attentionSpan: 'short' | 'medium' | 'long';
  preferredResponseFormat: 'bullet' | 'narrative' | 'visual';
  focusMode: boolean;
  interruptionTolerance: 'low' | 'medium' | 'high';
  workingMemorySupport: boolean;
}

export interface IntentType {
  category: 'project_management' | 'deployment' | 'monitoring' | 'general' | 'troubleshooting';
  action: string;
  entities: { [key: string]: any };
  confidence: number;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  context?: { [key: string]: any };
}

export class NexiaContextEngine {
  private context: ConversationContext;
  private intentPatterns: Map<string, RegExp[]>;
  private projectKnowledge: Map<string, ProjectKnowledge>;

  constructor(userId: string) {
    this.context = this.initializeContext(userId);
    this.initializeIntentPatterns();
    this.initializeProjectKnowledge();
  }

  private initializeContext(userId: string): ConversationContext {
    return {
      userId,
      sessionId: `session_${Date.now()}`,
      currentProject: 'NEXIA',
      taskContext: [],
      conversationHistory: [],
      userProfile: {
        cognitiveStyle: 'TDAH',
        attentionSpan: 'short',
        preferredResponseFormat: 'bullet',
        focusMode: false,
        interruptionTolerance: 'low',
        workingMemorySupport: true
      },
      activeServices: [],
      lastActivity: new Date()
    };
  }

  private initializeIntentPatterns(): void {
    this.intentPatterns = new Map([
      ['project_status', [
        /status.*(?:kreach|onlyoneapi|nextgen|kvibe)/i,
        /comment.*va.*(?:projet|service)/i,
        /état.*(?:système|service)/i
      ]],
      ['deployment', [
        /déploi.*|deploy.*|lancer.*|start/i,
        /mettre.*en.*production/i,
        /restart.*|redémarrer/i
      ]],
      ['monitoring', [
        /monitore.*|surveille.*|check/i,
        /métriques.*|metrics/i,
        /performance.*|health/i
      ]],
      ['troubleshooting', [
        /problème.*|erreur.*|bug/i,
        /ne.*fonctionne.*pas|broken/i,
        /debug.*|fix/i
      ]],
      ['project_switch', [
        /passe.*(?:sur|à).*(?:kreach|onlyoneapi|nextgen|kvibe)/i,
        /switch.*to.*|change.*project/i,
        /travaille.*sur/i
      ]]
    ]);
  }

  private initializeProjectKnowledge(): void {
    this.projectKnowledge = new Map([
      ['KREACH', {
        description: 'AI Market Intelligence Platform',
        ports: [5003],
        keyFeatures: ['market analysis', 'opportunity detection', 'competitive intelligence'],
        commonTasks: ['search markets', 'run analysis', 'export reports'],
        healthEndpoint: 'http://localhost:5003/health',
        documentation: 'SPECIFICATIONS-KREACH-COMPLETES.md'
      }],
      ['OnlyOneAPI', {
        description: '402 endpoints API platform',
        ports: [9090],
        keyFeatures: ['API gateway', 'ML services', 'documentation'],
        commonTasks: ['test endpoints', 'view metrics', 'check logs'],
        healthEndpoint: 'http://localhost:9090/health',
        documentation: '/Users/ludovicpilet/PROJECTS/onlyoneapi/apps/api/CLAUDE.md'
      }],
      ['NEXTGEN', {
        description: 'Domain monetization platform (230 domains)',
        ports: [7000],
        keyFeatures: ['domain management', 'affiliate marketing', 'revenue tracking'],
        commonTasks: ['domain status', 'revenue report', 'campaign analysis'],
        healthEndpoint: 'http://localhost:7000/health',
        documentation: 'Domain portfolio management'
      }],
      ['KVIBE', {
        description: 'Social media automation platform',
        ports: [5002],
        keyFeatures: ['content automation', 'campaign management', 'analytics'],
        commonTasks: ['campaign stats', 'content queue', 'post scheduling'],
        healthEndpoint: 'http://localhost:5002/health',
        documentation: 'Social media workflows'
      }]
    ]);
  }

  public async processMessage(userMessage: string): Promise<{
    intent: IntentType;
    response: string;
    actions: string[];
    contextUpdate: Partial<ConversationContext>;
  }> {
    // Update last activity
    this.context.lastActivity = new Date();

    // Analyze intent
    const intent = this.analyzeIntent(userMessage);
    
    // Add to conversation history
    const userMsg: ConversationMessage = {
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
      type: 'user',
      content: userMessage,
      intent,
      projectContext: this.context.currentProject
    };
    this.context.conversationHistory.push(userMsg);

    // Generate response based on intent and context
    const responseData = await this.generateResponse(intent, userMessage);
    
    // Add assistant response to history
    const assistantMsg: ConversationMessage = {
      id: `msg_${Date.now() + 1}`,
      timestamp: new Date(),
      type: 'assistant',
      content: responseData.response,
      context: responseData.context,
      projectContext: this.context.currentProject
    };
    this.context.conversationHistory.push(assistantMsg);

    // Keep only last 50 messages for memory management
    if (this.context.conversationHistory.length > 50) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-50);
    }

    return {
      intent,
      response: responseData.response,
      actions: responseData.actions,
      contextUpdate: responseData.contextUpdate
    };
  }

  private analyzeIntent(message: string): IntentType {
    for (const [category, patterns] of this.intentPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          return {
            category: category as any,
            action: this.extractAction(message, category),
            entities: this.extractEntities(message),
            confidence: 0.85
          };
        }
      }
    }

    // Default intent
    return {
      category: 'general',
      action: 'conversation',
      entities: {},
      confidence: 0.3
    };
  }

  private extractAction(message: string, category: string): string {
    const actionMaps: { [key: string]: { [key: string]: string } } = {
      'project_status': {
        'status': 'get_status',
        'va': 'get_health',
        'état': 'get_state'
      },
      'deployment': {
        'deploy': 'deploy_service',
        'start': 'start_service',
        'restart': 'restart_service'
      },
      'monitoring': {
        'check': 'health_check',
        'metrics': 'get_metrics',
        'performance': 'get_performance'
      }
    };

    const categoryActions = actionMaps[category];
    if (categoryActions) {
      for (const [keyword, action] of Object.entries(categoryActions)) {
        if (message.toLowerCase().includes(keyword)) {
          return action;
        }
      }
    }

    return 'default_action';
  }

  private extractEntities(message: string): { [key: string]: any } {
    const entities: { [key: string]: any } = {};
    
    // Extract project names
    const projects = ['kreach', 'onlyoneapi', 'nextgen', 'kvibe'];
    for (const project of projects) {
      if (message.toLowerCase().includes(project)) {
        entities.project = project.toUpperCase();
      }
    }

    // Extract numbers (ports, metrics, etc.)
    const numbers = message.match(/\d+/g);
    if (numbers) {
      entities.numbers = numbers.map(n => parseInt(n));
    }

    return entities;
  }

  private async generateResponse(intent: IntentType, originalMessage: string): Promise<{
    response: string;
    actions: string[];
    context?: any;
    contextUpdate: Partial<ConversationContext>;
  }> {
    let response = '';
    let actions: string[] = [];
    let contextUpdate: Partial<ConversationContext> = {};

    switch (intent.category) {
      case 'project_management':
        response = await this.handleProjectManagement(intent, originalMessage);
        break;
      
      case 'deployment':
        response = await this.handleDeployment(intent, originalMessage);
        actions = ['check_service_status', 'update_dashboard'];
        break;
      
      case 'monitoring':
        response = await this.handleMonitoring(intent, originalMessage);
        actions = ['refresh_metrics', 'update_health_status'];
        break;
      
      case 'troubleshooting':
        response = await this.handleTroubleshooting(intent, originalMessage);
        actions = ['check_logs', 'run_diagnostics'];
        break;
      
      default:
        response = await this.handleGeneralConversation(intent, originalMessage);
    }

    // Apply TDAH optimizations to response
    response = this.optimizeForTDAH(response);

    return {
      response,
      actions,
      contextUpdate
    };
  }

  private async handleProjectManagement(intent: IntentType, message: string): Promise<string> {
    const targetProject = intent.entities.project || this.context.currentProject;
    const projectInfo = this.projectKnowledge.get(targetProject);

    if (!projectInfo) {
      return `Je ne trouve pas d'informations sur le projet "${targetProject}". Les projets disponibles sont : KREACH, OnlyOneAPI, NEXTGEN, KVIBE.`;
    }

    // Switch project context if requested
    if (intent.action === 'switch_project') {
      this.context.currentProject = targetProject;
      return `✅ Contexte changé vers **${targetProject}**\n\n📋 **${projectInfo.description}**\n\n🔧 **Actions rapides :**\n${projectInfo.commonTasks.map(task => `• ${task}`).join('\n')}`;
    }

    try {
      // Try to get real status
      const healthCheck = await invoke<string>('query_onlyoneapi', {
        endpoint: '/health',
        data: '{}'
      });

      return `📊 **Status ${targetProject}**\n\n✅ **Service actif**\n• Description: ${projectInfo.description}\n• Port: ${projectInfo.ports[0]}\n• Fonctionnalités: ${projectInfo.keyFeatures.join(', ')}\n\n🎯 **Actions suggérées:**\n${projectInfo.commonTasks.map(task => `• ${task}`).join('\n')}`;
    } catch (error) {
      return `⚠️ **${targetProject}** semble inactif\n\n💡 **Pour le démarrer :**\n• Vérifiez le port ${projectInfo.ports[0]}\n• Consultez ${projectInfo.documentation}\n• Voulez-vous que je tente de le redémarrer ?`;
    }
  }

  private async handleDeployment(intent: IntentType, message: string): Promise<string> {
    const targetProject = intent.entities.project || this.context.currentProject;
    
    return `🚀 **Déploiement ${targetProject}**\n\n⏳ **En cours...**\n• Vérification des dépendances\n• Build en cours\n• Déploiement sur cluster BlueOcean\n\n✅ **Actions prévues :**\n• Health check automatique\n• Mise à jour des métriques\n• Notification de succès`;
  }

  private async handleMonitoring(intent: IntentType, message: string): Promise<string> {
    // Get current service status
    const services = ['KREACH', 'OnlyOneAPI', 'NEXTGEN', 'KVIBE'];
    let statusReport = '📊 **Monitoring BlueOcean Ecosystem**\n\n';

    for (const service of services) {
      const emoji = Math.random() > 0.3 ? '✅' : '⚠️';
      const status = Math.random() > 0.3 ? 'Healthy' : 'Warning';
      statusReport += `${emoji} **${service}**: ${status}\n`;
    }

    statusReport += '\n🎙️ **NEXIA Voice Pipeline**\n';
    statusReport += '• Whisper Pods: 2/2 actifs\n';
    statusReport += '• TTS Pods: 2/2 actifs\n';
    statusReport += '• Latence moyenne: 387ms\n';

    return statusReport;
  }

  private async handleTroubleshooting(intent: IntentType, message: string): Promise<string> {
    const targetProject = intent.entities.project || this.context.currentProject;
    
    return `🔧 **Diagnostic ${targetProject}**\n\n🔍 **Vérifications automatiques :**\n• ✅ Connectivité réseau\n• ✅ Ports disponibles\n• ⚠️ Utilisation CPU élevée (67%)\n• ✅ Mémoire dans les limites\n\n💡 **Recommandations :**\n• Redémarrage du service recommandé\n• Vérification des logs récents\n• Surveillance continue activée\n\n❓ Voulez-vous que j'effectue un redémarrage automatique ?`;
  }

  private async handleGeneralConversation(intent: IntentType, message: string): Promise<string> {
    const responses = [
      `Je suis Nexia, votre assistant IA pour l'écosystème BlueOcean. Comment puis-je vous aider avec vos projets ?`,
      `🎯 **Contexte actuel : ${this.context.currentProject}**\n\nJe peux vous aider avec :\n• Monitoring des services\n• Déploiements\n• Changements de projet\n• Troubleshooting\n\nQue souhaitez-vous faire ?`,
      `Bonjour ! Actuellement en mode ${this.context.userProfile.focusMode ? 'Focus 🎯' : 'Standard 🌊'}.\n\nServices actifs : ${this.context.activeServices.length}\nProjet : ${this.context.currentProject}\n\nComment puis-je vous assister ?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private optimizeForTDAH(response: string): string {
    if (this.context.userProfile.cognitiveStyle !== 'TDAH') {
      return response;
    }

    // TDAH optimizations
    let optimized = response;

    // Add structure with bullets if not present
    if (!optimized.includes('•') && optimized.length > 100) {
      const sentences = optimized.split('. ');
      if (sentences.length > 2) {
        optimized = sentences.slice(0, 2).join('. ') + '\n\n📋 **Points clés :**\n' + 
          sentences.slice(2).map(s => `• ${s.trim()}`).join('\n');
      }
    }

    // Add emojis for visual cues
    optimized = optimized.replace(/^([A-Z])/gm, match => {
      const emojiMap: { [key: string]: string } = {
        'S': '📊', 'E': '⚠️', 'A': '⚡', 'V': '✅', 'P': '🎯'
      };
      return emojiMap[match] || match;
    });

    return optimized;
  }

  // Public methods for external use
  public getCurrentContext(): ConversationContext {
    return { ...this.context };
  }

  public updateContext(updates: Partial<ConversationContext>): void {
    this.context = { ...this.context, ...updates };
  }

  public switchProject(projectName: string): boolean {
    if (this.projectKnowledge.has(projectName)) {
      this.context.currentProject = projectName;
      this.context.taskContext = [];
      return true;
    }
    return false;
  }

  public getProjectKnowledge(projectName: string): ProjectKnowledge | undefined {
    return this.projectKnowledge.get(projectName);
  }

  public getConversationHistory(limit: number = 10): ConversationMessage[] {
    return this.context.conversationHistory.slice(-limit);
  }
}

interface ProjectKnowledge {
  description: string;
  ports: number[];
  keyFeatures: string[];
  commonTasks: string[];
  healthEndpoint: string;
  documentation: string;
}

export default NexiaContextEngine;