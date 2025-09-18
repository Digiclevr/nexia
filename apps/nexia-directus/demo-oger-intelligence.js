const OGERIntelligenceService = require('./intelligence-service');

/**
 * DÉMONSTRATION OGER INTELLIGENCE COMPLÈTE
 * Processing de l'artifact existant avec extraction intelligence
 */
async function demoOGERIntelligence() {
  try {
    console.log('🎯 NEXIA OGER - Démonstration Intelligence Complète');
    console.log('==================================================');
    
    const intelligence = new OGERIntelligenceService();
    
    // 1. Authentication
    await intelligence.authenticate();
    console.log('✅ Authentication successful');
    
    // 2. Récupérer l'artifact existant
    console.log('\n📊 Retrieving existing artifacts...');
    const artifactsResponse = await intelligence.axios.get(`${intelligence.directusUrl}/items/claude_artifacts`, {
      headers: intelligence.headers
    });
    
    if (artifactsResponse.data.data.length === 0) {
      console.log('⚠️ No artifacts found. Creating demo artifact...');
      
      // Créer artifact de démo
      const demoArtifact = {
        title: 'NEXIA OGER - Phase 2 Intelligence Implementation',
        type: 'action_plan',
        content: `# NEXIA OGER - Intelligence Layer Implementation

## Architecture Intelligence Directus

### Phase 2: Collections Intelligence
- **Développer Intelligence Service** progressivement (60min)
- **Créer extraction automatique** action items depuis artifacts
- **Implémenter système de priorisation** automatique basé sur keywords
- TODO: Configurer categorization par domaine technique

### Action Items Critiques
- **URGENT**: Déployer API authentication middleware (15min)
- **Tester communication** Directus-Supervisor complète (45min)
- **Créer collection action_items** avec intelligence fields
- **Implémenter workflows** automatisés OGER (30min)

### Intelligence Layers
1. **Action Items Extraction**: Pattern matching avancé
2. **Priority Calculation**: Scoring automatique urgent/high/medium/low
3. **Categorization**: Classification backend/frontend/deployment/testing
4. **Orchestration**: Processing complet artifacts → actions

### Next Steps Phase 3
- Intégration API Supervisor-Directus
- Dashboard temps réel NEXIA
- Orchestration IA complète écosystème`,
        status: 'completed',
        priority: 'high',
        estimated_duration: 90
      };
      
      const createResponse = await intelligence.axios.post(`${intelligence.directusUrl}/items/claude_artifacts`, demoArtifact, {
        headers: intelligence.headers
      });
      
      const artifactId = createResponse.data.data.id;
      console.log(`✅ Demo artifact created: ${artifactId}`);
      
      // 3. Process intelligence sur cet artifact
      console.log('\n🧠 Processing artifact intelligence...');
      const result = await intelligence.processArtifactIntelligence(artifactId);
      
      console.log('\n🎉 DÉMONSTRATION OGER INTELLIGENCE RÉUSSIE !');
      console.log('============================================');
      console.log(`✅ Artifact traité: ${artifactId}`);
      console.log(`✅ Action items extraits: ${result.action_items_count}`);
      console.log(`✅ Intelligence active: OPÉRATIONNELLE`);
      
      console.log('\n📊 Action Items Extraits:');
      result.action_items.forEach((item, index) => {
        if (item) {
          console.log(`   ${index + 1}. [${item.priority?.toUpperCase() || 'N/A'}] ${item.text?.substring(0, 60)}...`);
        }
      });
      
    } else {
      // Process premier artifact existant
      const firstArtifact = artifactsResponse.data.data[0];
      console.log(`📄 Processing existing artifact: ${firstArtifact.title}`);
      
      const result = await intelligence.processArtifactIntelligence(firstArtifact.id);
      
      console.log('\n🎉 INTELLIGENCE PROCESSING COMPLETED !');
      console.log('=====================================');
      console.log(`✅ Artifact: ${firstArtifact.title}`);
      console.log(`✅ Action items: ${result.action_items_count}`);
    }
    
    console.log('\n🌐 INTERFACES DISPONIBLES:');
    console.log('==========================');
    console.log('📊 Artifacts: http://localhost:7012/admin/content/claude_artifacts');
    console.log('🎯 Action Items: http://localhost:7012/admin/content/action_items');
    console.log('⚙️ Admin Dashboard: http://localhost:7012/admin');
    
    console.log('\n🚀 PHASE 2 COMPLÈTE - Intelligence Layer ACTIVE !');
    console.log('Phase 3: Intégration API Supervisor-Directus PRÊTE');
    
  } catch (error) {
    console.error('❌ Error in OGER Intelligence demo:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

demoOGERIntelligence();