const axios = require('axios');
const fs = require('fs');

async function ingestCurrentArtifact() {
  try {
    console.log('📥 Ingesting current artifact into NEXIA OGER...');
    
    // 1. Authenticate
    const authResponse = await axios.post('http://localhost:7012/auth/login', {
      email: 'admin@nexia.com',
      password: 'NexiaAdmin2025!'
    });
    
    const token = authResponse.data.data.access_token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log('✅ Authenticated with Directus');
    
    // 2. Read the current artifact
    const artifactPath = '/Users/ludovicpilet/PROJECTS/NEXIA/NEXIA-DIRECTUS-ARCHITECTURE-ANALYSIS.md';
    const content = fs.readFileSync(artifactPath, 'utf8');
    
    console.log('✅ Read artifact content');
    
    // 3. Create artifact record
    const artifact = {
      title: 'NEXIA-DIRECTUS Architecture Analysis & OGER Implementation',
      type: 'analysis',
      content: content,
      status: 'completed',
      priority: 'high',
      estimated_duration: 195 // 4 phases total
    };
    
    const response = await axios.post('http://localhost:7012/items/claude_artifacts', artifact, { headers });
    
    console.log('✅ Artifact ingested successfully!');
    console.log(`📊 Artifact ID: ${response.data.data.id}`);
    console.log('');
    console.log('🎯 DÉMONSTRATION OGER EN DIRECT:');
    console.log('1. ✅ Communication Directus établie');
    console.log('2. ✅ Collection claude_artifacts créée');
    console.log('3. ✅ Premier artefact ingéré automatiquement');
    console.log('4. 🔄 Prochaine étape: Action items extraction');
    console.log('');
    console.log('🌐 Voir dans interface: http://localhost:7012/admin/content/claude_artifacts');
    
    return response.data.data.id;
    
  } catch (error) {
    console.error('❌ Error ingesting artifact:', error.response?.data || error.message);
  }
}

ingestCurrentArtifact();