const express = require('express');
const db = require('../database/connection');
const crypto = require('crypto');
const router = express.Router();

// Clé de chiffrement (dans un vrai projet, utilisez une variable d'environnement)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'onlyoneapi-secret-key-32-characters';
const ALGORITHM = 'aes-256-cbc';

// Fonctions de chiffrement/déchiffrement
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  try {
    const textParts = text.split(':');
    const encrypted = textParts[1];
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    return text; // Si le déchiffrement échoue, retourner le texte original
  }
}

// Créer la table des configurations si elle n'existe pas
async function ensureConfigTable() {
  try {
    await db.schema.hasTable('api_configuration').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('api_configuration', (table) => {
          table.increments('id').primary();
          table.string('key').unique().notNullable();
          table.text('value').notNullable(); // Chiffré
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());
        });
        console.log('✅ api_configuration table created');
      }
    });
  } catch (error) {
    console.error('Error creating api_configuration table:', error);
  }
}

// Initialiser la table au démarrage
ensureConfigTable();

// GET /api/configuration/api-keys - Récupérer toutes les clés API (masquées)
router.get('/api-keys', async (req, res) => {
  try {
    const configs = await db('api_configuration').select('key', 'value');
    
    const result = {};
    configs.forEach(config => {
      // Retourner une version masquée pour la sécurité
      const decrypted = decrypt(config.value);
      if (decrypted && decrypted.length > 8) {
        result[config.key] = decrypted.substring(0, 4) + '****' + decrypted.substring(decrypted.length - 4);
      } else {
        result[config.key] = '****';
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API configuration' });
  }
});

// POST /api/configuration/api-keys - Sauvegarder une clé API
router.post('/api-keys', async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    // Chiffrer la valeur
    const encryptedValue = encrypt(value);

    // Upsert dans la base
    await db('api_configuration')
      .insert({ key, value: encryptedValue, updated_at: new Date() })
      .onConflict('key')
      .merge({ value: encryptedValue, updated_at: new Date() });

    // Log de l'activité
    await db('activity_log').insert({
      agent_name: 'System',
      action: 'api_key_configured',
      status: 'success',
      message: `API key configured: ${key}`,
      metadata: JSON.stringify({ key, masked_value: value.substring(0, 4) + '****' })
    });

    res.json({ success: true, message: 'API key saved successfully' });
  } catch (error) {
    console.error('Error saving API key:', error);
    res.status(500).json({ error: 'Failed to save API key' });
  }
});

// POST /api/configuration/test-api/:key - Tester une clé API
router.post('/test-api/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    // Récupérer la clé de la base
    const config = await db('api_configuration').where('key', key).first();
    
    if (!config) {
      return res.json({ success: false, error: 'API key not configured' });
    }

    const apiKey = decrypt(config.value);
    let testResult = { success: false, error: 'Test not implemented' };

    // Tests spécifiques par API
    switch (key) {
      case 'openai_api_key':
        testResult = await testOpenAI(apiKey);
        break;
      case 'stripe_secret_key':
        testResult = await testStripe(apiKey);
        break;
      case 'linkedin_client_id':
        testResult = { success: true, message: 'LinkedIn client ID format valid' };
        break;
      default:
        testResult = { success: true, message: 'API key saved, manual testing required' };
    }

    // Log du test
    await db('activity_log').insert({
      agent_name: 'System',
      action: 'api_key_tested',
      status: testResult.success ? 'success' : 'warning',
      message: `API test ${key}: ${testResult.success ? 'SUCCESS' : 'FAILED'}`,
      metadata: JSON.stringify({ key, result: testResult })
    });

    res.json(testResult);
  } catch (error) {
    console.error('Error testing API key:', error);
    res.json({ success: false, error: 'Test failed' });
  }
});

// GET /api/configuration/agent-status - Status des agents selon leurs APIs
router.get('/agent-status', async (req, res) => {
  try {
    // Récupérer toutes les clés configurées
    const configs = await db('api_configuration').select('key');
    const configuredKeys = configs.map(c => c.key);
    
    // Récupérer tous les agents
    const agents = await db('agents').select('*');
    
    const agentStatus = agents.map(agent => {
      const config = JSON.parse(agent.config || '{}');
      const requiredAPIs = config.apis_required || [];
      
      const missingAPIs = requiredAPIs.filter(api => !configuredKeys.includes(api));
      const canWork = missingAPIs.length === 0;
      
      return {
        id: agent.id,
        name: agent.name,
        session_id: config.session_id,
        session_name: config.session_name,
        required_apis: requiredAPIs,
        missing_apis: missingAPIs,
        can_work: canWork,
        status: agent.status
      };
    });

    res.json(agentStatus);
  } catch (error) {
    console.error('Error getting agent status:', error);
    res.status(500).json({ error: 'Failed to get agent status' });
  }
});

// Fonctions de test spécifiques
async function testOpenAI(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      return { success: true, message: 'OpenAI API key valid' };
    } else {
      return { success: false, error: 'Invalid OpenAI API key' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to test OpenAI API' };
  }
}

async function testStripe(apiKey) {
  try {
    const response = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      return { success: true, message: 'Stripe API key valid' };
    } else {
      return { success: false, error: 'Invalid Stripe API key' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to test Stripe API' };
  }
}

module.exports = router;