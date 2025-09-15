const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 7011;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the voice interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API proxy to OnlyOneAPI (to avoid CORS issues)
app.post('/api/chat', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.post('https://api.onlyoneapi.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: req.body.messages,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.ONLYONEAPI_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('OnlyOneAPI Error:', error.message);
    res.status(500).json({ 
      error: 'OnlyOneAPI request failed',
      message: error.message 
    });
  }
});

// NEXIA Supervisor integration
app.post('/api/nexia-command', async (req, res) => {
  try {
    const { command, ecosystem } = req.body;
    const axios = require('axios');
    
    // Route command to NEXIA Supervisor
    const nexiaUrl = 'http://localhost:7014/api';
    let response;
    
    switch (command) {
      case 'status':
        response = await axios.get(`${nexiaUrl}/status`);
        break;
      case 'health':
        response = await axios.get(`${nexiaUrl}/health`);
        break;
      case 'ecosystems':
        response = await axios.get(`${nexiaUrl}/monitoring/ecosystems`);
        break;
      case 'deploy':
        response = await axios.post(`${nexiaUrl}/control/deploy`, { ecosystem });
        break;
      default:
        return res.status(400).json({ error: 'Unknown command' });
    }
    
    res.json({
      success: true,
      command,
      data: response.data
    });
  } catch (error) {
    console.error('NEXIA Command Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'NEXIA command failed',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🎙️ NEXIA Voice Interface running on http://localhost:${port}`);
  console.log(`🧠 Connecting to NEXIA Supervisor: http://localhost:7014`);
  console.log(`🤖 Using OnlyOneAPI for LLM processing`);
});