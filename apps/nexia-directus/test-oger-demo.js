const axios = require('axios');

async function testOGERDemo() {
  try {
    console.log('🎯 NEXIA OGER - Démonstration Communication');
    console.log('===============================================');
    
    // 1. Test ping
    const ping = await axios.get('http://localhost:7012/server/ping');
    console.log('✅ Ping:', ping.data);
    
    // 2. Authenticate
    const authResponse = await axios.post('http://localhost:7012/auth/login', {
      email: 'admin@nexia.com',
      password: 'NexiaAdmin2025!'
    });
    
    const token = authResponse.data.data.access_token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log('✅ Authentication: SUCCESS');
    console.log('🔑 Token length:', token.length);
    
    // 3. List collections
    const collections = await axios.get('http://localhost:7012/collections', { headers });
    console.log('✅ Collections accessible:', collections.data.data.length);
    
    // Find our collection
    const nexiaCollection = collections.data.data.find(c => c.collection === 'claude_artifacts');
    if (nexiaCollection) {
      console.log('✅ NEXIA collection found: claude_artifacts');
    } else {
      console.log('⚠️ NEXIA collection not found in list');
    }
    
    // 4. Server info
    const serverInfo = await axios.get('http://localhost:7012/server/info');
    console.log('✅ Server info - Project:', serverInfo.data.data.project.project_name);
    
    console.log('');
    console.log('🎉 RÉSULTAT FINAL:');
    console.log('==================');
    console.log('✅ Directus: FONCTIONNEL (Node.js 22)');
    console.log('✅ Authentication: FONCTIONNEL'); 
    console.log('✅ Collections API: ACCESSIBLE');
    console.log('✅ Communication: ÉTABLIE');
    console.log('');
    console.log('🚀 PRÊT pour implémentation OGER Phase 1');
    console.log('📊 Interface admin: http://localhost:7012/admin');
    console.log('🔐 Credentials: admin@nexia.com / NexiaAdmin2025!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testOGERDemo();