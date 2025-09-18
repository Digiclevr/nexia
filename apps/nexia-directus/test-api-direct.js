const axios = require('axios');

async function testDirectusAPI() {
  try {
    console.log('🧪 Testing direct Directus API access...');
    
    // Test 1: Server info
    try {
      const serverInfo = await axios.get('http://localhost:7012/server/info');
      console.log('✅ Server info accessible:', serverInfo.data);
    } catch (e) {
      console.log('❌ Server info requires auth');
    }
    
    // Test 2: Collections list (usually requires auth)
    try {
      const collections = await axios.get('http://localhost:7012/collections');
      console.log('✅ Collections accessible:', collections.data.data?.length || 'unknown');
    } catch (e) {
      console.log('❌ Collections require authentication');
    }
    
    // Test 3: Activity log
    try {
      const activity = await axios.get('http://localhost:7012/activity');
      console.log('✅ Activity log accessible');
    } catch (e) {
      console.log('❌ Activity requires authentication');
    }
    
    // Test 4: Schema
    try {
      const schema = await axios.get('http://localhost:7012/schema/snapshot');
      console.log('✅ Schema accessible');
    } catch (e) {
      console.log('❌ Schema requires authentication');
    }
    
    console.log('');
    console.log('📊 RÉSULTAT: Directus fonctionne mais requiert authentification pour API');
    console.log('🌐 Interface web: http://localhost:7012/admin');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testDirectusAPI();