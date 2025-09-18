const axios = require('axios');

async function createAdminUser() {
  try {
    console.log('🔧 Creating NEXIA admin user...');
    
    // First, check if any users exist
    const usersResponse = await axios.get('http://localhost:7012/users').catch(e => {
      console.log('No users endpoint accessible yet (expected)');
    });
    
    // Create admin via signup/bootstrap endpoint (if available)
    try {
      const signupResponse = await axios.post('http://localhost:7012/auth/request', {
        email: 'admin@nexia.com'
      });
      console.log('✅ Password reset requested for admin');
    } catch (e) {
      console.log('ℹ️ Signup endpoint not available, trying direct creation...');
    }
    
    // Alternative: Direct database insertion (via Directus SQL)
    const createUserSQL = {
      email: 'admin@nexia.com',
      password: '$argon2id$v=19$m=65536,t=3,p=4$5VIQ7AqzKvdxVnEzHhLv1Q$GHz9l/k5/Fuj7K+VfH8W2C/q3dLF8v2CvJqP8R9/dGM', // NexiaAdmin2025!
      status: 'active',
      role: null, // We'll create role first
      first_name: 'NEXIA',
      last_name: 'Administrator'
    };
    
    console.log('📊 Admin user ready to create');
    console.log('🌐 Access interface: http://localhost:7012/admin');
    console.log('📧 Email: admin@nexia.com');
    console.log('🔐 Password: NexiaAdmin2025!');
    console.log('');
    console.log('ℹ️ Please create admin manually via web interface for now');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

createAdminUser();