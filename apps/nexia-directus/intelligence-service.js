const axios = require('axios');

/**
 * NEXIA OGER - Intelligence Service
 * Couche d'intelligence pour transformation Directus en orchestrateur IA
 */

class OGERIntelligenceService {
  constructor() {
    this.directusUrl = 'http://localhost:7012';
    this.adminCredentials = {
      email: 'admin@nexia.com',
      password: 'NexiaAdmin2025!'
    };
    this.token = null;
    this.axios = axios; // Expose axios pour les scripts externes
  }

  async authenticate() {
    const response = await axios.post(`${this.directusUrl}/auth/login`, this.adminCredentials);
    this.token = response.data.data.access_token;
    return this.token;
  }

  get headers() {
    return { 'Authorization': `Bearer ${this.token}` };
  }

  /**
   * INTELLIGENCE LAYER 1: Action Items Extraction
   * Analyse contenu markdown et extrait action items automatiquement
   */
  extractActionItems(content) {
    const actionPatterns = [
      /^[\s]*[-*+]\s*\*\*(.*?)\*\*/gm,           // **Action items**
      /^[\s]*\d+\.\s*\*\*(.*?)\*\*/gm,          // 1. **Action**
      /^[\s]*[-*+]\s*(.+?)(?:\((\d+)min\))?$/gm, // - Action (30min)
      /TODO:\s*(.+?)$/gm,                        // TODO: Action
      /ACTION:\s*(.+?)$/gm,                      // ACTION: Action
      /PHASE\s*\d+[:\-]\s*(.+?)$/gm             // PHASE 1: Action
    ];

    const actions = [];
    
    actionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const actionText = match[1]?.trim();
        const duration = match[2] ? parseInt(match[2]) : null;
        
        if (actionText && actionText.length > 5) {
          actions.push({
            text: actionText,
            estimated_duration: duration,
            priority: this.calculatePriority(actionText),
            category: this.categorizeAction(actionText),
            extracted_at: new Date().toISOString()
          });
        }
      }
    });

    return this.deduplicateActions(actions);
  }

  /**
   * INTELLIGENCE LAYER 2: Priority Calculation
   * Système de scoring automatique basé sur keywords et contexte
   */
  calculatePriority(actionText) {
    const text = actionText.toLowerCase();
    
    // Urgence keywords
    if (text.includes('urgent') || text.includes('critique') || text.includes('bloquant')) {
      return 'urgent';
    }
    
    // High priority keywords
    if (text.includes('deploie') || text.includes('prod') || text.includes('api') || 
        text.includes('fix') || text.includes('security') || text.includes('auth')) {
      return 'high';
    }
    
    // Medium priority keywords
    if (text.includes('test') || text.includes('update') || text.includes('config') ||
        text.includes('interface') || text.includes('doc')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * INTELLIGENCE LAYER 3: Action Categorization
   * Classification automatique par domaine technique
   */
  categorizeAction(actionText) {
    const text = actionText.toLowerCase();
    
    if (text.includes('api') || text.includes('endpoint') || text.includes('auth')) {
      return 'backend';
    }
    if (text.includes('interface') || text.includes('ui') || text.includes('design')) {
      return 'frontend';
    }
    if (text.includes('deploy') || text.includes('k8s') || text.includes('docker')) {
      return 'deployment';
    }
    if (text.includes('test') || text.includes('validate') || text.includes('check')) {
      return 'testing';
    }
    if (text.includes('doc') || text.includes('readme') || text.includes('guide')) {
      return 'documentation';
    }
    
    return 'general';
  }

  /**
   * Dédoublonnage intelligent des actions similaires
   */
  deduplicateActions(actions) {
    const unique = [];
    const seen = new Set();
    
    actions.forEach(action => {
      const normalized = action.text.toLowerCase().replace(/[^\w\s]/g, '').trim();
      const key = normalized.substring(0, 20); // Premier 20 chars pour similarité
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(action);
      }
    });
    
    return unique;
  }

  /**
   * ORCHESTRATION LAYER: Process Artifact Intelligence
   * Traitement complet d'un artifact avec extraction intelligence
   */
  async processArtifactIntelligence(artifactId) {
    try {
      console.log(`🧠 Processing intelligence for artifact ${artifactId}...`);
      
      // 1. Récupérer l'artifact
      const artifact = await this.getArtifact(artifactId);
      
      // 2. Extraire action items avec intelligence
      const actionItems = this.extractActionItems(artifact.content);
      
      // 3. Créer collection action_items si nécessaire
      await this.ensureActionItemsCollection();
      
      // 4. Sauvegarder action items
      const savedActions = [];
      for (const action of actionItems) {
        const actionItem = {
          ...action,
          source_artifact: artifactId,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        
        const saved = await this.createActionItem(actionItem);
        savedActions.push(saved);
      }
      
      // 5. Mettre à jour artifact avec intelligence data
      await this.updateArtifactIntelligence(artifactId, {
        action_items_extracted: actionItems.length,
        intelligence_processed: true,
        processed_at: new Date().toISOString()
      });
      
      console.log(`✅ Intelligence processed: ${actionItems.length} action items extracted`);
      return {
        artifact_id: artifactId,
        action_items_count: actionItems.length,
        action_items: savedActions
      };
      
    } catch (error) {
      console.error('❌ Error processing intelligence:', error.message);
      throw error;
    }
  }

  async getArtifact(id) {
    const response = await axios.get(`${this.directusUrl}/items/claude_artifacts/${id}`, {
      headers: this.headers
    });
    return response.data.data;
  }

  async createActionItem(item) {
    const response = await axios.post(`${this.directusUrl}/items/action_items`, item, {
      headers: this.headers
    });
    return response.data.data;
  }

  async updateArtifactIntelligence(id, data) {
    const response = await axios.patch(`${this.directusUrl}/items/claude_artifacts/${id}`, data, {
      headers: this.headers
    });
    return response.data.data;
  }

  /**
   * COLLECTION MANAGEMENT: Ensure action_items collection exists
   */
  async ensureActionItemsCollection() {
    try {
      // Vérifier si collection existe
      await axios.get(`${this.directusUrl}/collections/action_items`, {
        headers: this.headers
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('📦 Creating action_items collection...');
        await this.createActionItemsCollection();
      }
    }
  }

  async createActionItemsCollection() {
    // Créer collection action_items
    const collection = {
      collection: 'action_items',
      meta: {
        collection: 'action_items',
        icon: 'task_alt',
        note: 'Action items extracted from Claude artifacts via OGER Intelligence',
        display_template: '{{text}}',
        color: '#00C896',
        sort: 2
      },
      schema: {
        name: 'action_items'
      }
    };
    
    await axios.post(`${this.directusUrl}/collections`, collection, {
      headers: this.headers
    });

    // Créer champs
    const fields = [
      {
        collection: 'action_items',
        field: 'id',
        type: 'uuid',
        meta: { field: 'id', special: ['uuid'], interface: 'input', readonly: true, hidden: true, sort: 1 }
      },
      {
        collection: 'action_items',
        field: 'text',
        type: 'string',
        meta: { field: 'text', interface: 'input', required: true, sort: 2, note: 'Action item text' }
      },
      {
        collection: 'action_items',
        field: 'priority',
        type: 'string',
        meta: {
          field: 'priority',
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Urgent', value: 'urgent' },
              { text: 'High', value: 'high' },
              { text: 'Medium', value: 'medium' },
              { text: 'Low', value: 'low' }
            ]
          },
          display: 'labels',
          sort: 3
        }
      },
      {
        collection: 'action_items',
        field: 'category',
        type: 'string',
        meta: {
          field: 'category',
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Backend', value: 'backend' },
              { text: 'Frontend', value: 'frontend' },
              { text: 'Deployment', value: 'deployment' },
              { text: 'Testing', value: 'testing' },
              { text: 'Documentation', value: 'documentation' },
              { text: 'General', value: 'general' }
            ]
          },
          sort: 4
        }
      },
      {
        collection: 'action_items',
        field: 'status',
        type: 'string',
        meta: {
          field: 'status',
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Pending', value: 'pending' },
              { text: 'In Progress', value: 'in_progress' },
              { text: 'Completed', value: 'completed' },
              { text: 'Blocked', value: 'blocked' }
            ]
          },
          display: 'labels',
          sort: 5
        }
      },
      {
        collection: 'action_items',
        field: 'estimated_duration',
        type: 'integer',
        meta: { field: 'estimated_duration', interface: 'input', options: { suffix: ' minutes' }, sort: 6 }
      },
      {
        collection: 'action_items',
        field: 'source_artifact',
        type: 'uuid',
        meta: { field: 'source_artifact', interface: 'select-dropdown-m2o', sort: 7, note: 'Source Claude artifact' }
      },
      {
        collection: 'action_items',
        field: 'created_at',
        type: 'timestamp',
        meta: { field: 'created_at', special: ['date-created'], interface: 'datetime', readonly: true, sort: 8 }
      }
    ];

    for (const field of fields) {
      await axios.post(`${this.directusUrl}/fields`, field, { headers: this.headers });
    }

    console.log('✅ action_items collection created successfully');
  }
}

module.exports = OGERIntelligenceService;