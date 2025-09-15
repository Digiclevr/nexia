const axios = require('axios');

async function testDirectus() {
  try {
    console.log('🧪 Testing NEXIA Directus connection...');
    
    // Test main page
    const response = await axios.get('http://localhost:7012');
    console.log('✅ Main page accessible');
    
    // Test auth endpoint
    const authResponse = await axios.post('http://localhost:7012/auth/login', {
      email: 'admin@nexia.com',
      password: 'NexiaAdmin2025!'
    });
    
    console.log('✅ Authentication successful');
    console.log('📱 Access token received');
    
    // Test with token
    const token = authResponse.data.data.access_token;
    const collectionsResponse = await axios.get('http://localhost:7012/collections', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Collections endpoint accessible');
    console.log(`📊 Found ${collectionsResponse.data.data.length} collections`);
    
    console.log('🎉 NEXIA Directus is fully functional!');
    console.log('');
    console.log('🌐 Admin URL: http://localhost:7012/admin');
    console.log('🔐 Login: admin@nexia.com / NexiaAdmin2025!');
    
  } catch (error) {
    console.error('❌ Error testing Directus:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Install axios if needed
async function installAxios() {
  try {
    require('axios');
    console.log('✅ Axios already available');
  } catch (e) {
    console.log('📦 Installing axios...');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
  }
}

async function main() {
  await installAxios();
  await testDirectus();
}

main();