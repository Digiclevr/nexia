const express = require('express');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const router = express.Router();

// Storage for running processes
const runningProcesses = new Map();

// GET /api/system/status - Get system status
router.get('/status', async (req, res) => {
  try {
    const systemStatus = {
      health: await getSystemHealth(),
      services: await getCoreServices(),
      scripts: await getSessionScripts(),
      processes: await getRunningProcesses()
    };

    res.json(systemStatus);
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

// POST /api/system/service/:id/:action - Control services
router.post('/service/:id/:action', async (req, res) => {
  try {
    const { id, action } = req.params;
    const result = await controlService(id, action);
    
    res.json(result);
  } catch (error) {
    console.error('Service control error:', error);
    res.status(500).json({ error: 'Failed to control service' });
  }
});

// POST /api/system/script - Run/control scripts
router.post('/script', async (req, res) => {
  try {
    const { script, action } = req.body;
    const result = await controlScript(script, action);
    
    res.json(result);
  } catch (error) {
    console.error('Script control error:', error);
    res.status(500).json({ error: 'Failed to control script' });
  }
});

// Helper functions
async function getSystemHealth() {
  return new Promise((resolve) => {
    const health = {
      uptime: formatUptime(os.uptime()),
      cpu: 'N/A',
      memory: Math.round((1 - (os.freemem() / os.totalmem())) * 100)
    };

    // Get CPU usage (better approach)
    exec('top -l 1 | head -n 10 | grep "CPU usage"', (error, stdout) => {
      if (!error && stdout) {
        // Parse: "CPU usage: 3.12% user, 1.56% sys, 95.31% idle"
        const match = stdout.match(/(\d+\.?\d*)% user/);
        if (match) {
          health.cpu = Math.round(parseFloat(match[1]) || 0);
        } else {
          health.cpu = 0;
        }
      } else {
        health.cpu = 0;
      }
      resolve(health);
    });
  });
}

async function getCoreServices() {
  const services = [
    {
      id: 'dashboard-backend',
      name: 'Dashboard Backend',
      description: 'Node.js backend server with API and Socket.IO',
      port: 5011,
      status: 'running', // Always running if we can respond
      pid: process.pid,
      last_check: new Date().toISOString()
    },
    {
      id: 'dashboard-frontend',
      name: 'Dashboard Frontend',
      description: 'React frontend application',
      port: 5010,
      status: await checkPort(5010),
      last_check: new Date().toISOString()
    }
  ];

  // Check for additional services
  const additionalServices = await checkAdditionalServices();
  return [...services, ...additionalServices];
}

async function getSessionScripts() {
  const basePath = path.resolve(__dirname, '../../../../');
  const scripts = [];

  // Main coordination scripts
  const mainScripts = [
    'START-ALL-SESSIONS.sh',
    'SYNC-ALL-PROGRESS.sh', 
    'POPULATE-VALIDATION-QUEUE.sh'
  ];

  for (const scriptName of mainScripts) {
    const scriptPath = path.join(basePath, scriptName);
    if (fs.existsSync(scriptPath)) {
      const processInfo = runningProcesses.get(scriptPath);
      scripts.push({
        name: scriptName,
        path: scriptPath,
        description: getScriptDescription(scriptName),
        type: getScriptType(scriptName),
        running: processInfo?.running === true,
        last_run: processInfo?.endTime || getLastRunTime(scriptPath),
        exit_code: processInfo?.exitCode || getLastExitCode(scriptPath),
        has_logs: processInfo?.logs?.length > 0
      });
    }
  }

  // Session-specific scripts
  const sessionDirs = [
    'API-AUDITS',
    'EMERGENCY-CONSULTING', 
    'CONTENT-FOUNDING-MEMBERS',
    'TECHNICAL-WRITING',
    'DONE-FOR-YOU',
    'GIVEAWAY-CAMPAIGN'
  ];

  for (const sessionDir of sessionDirs) {
    const sessionPath = path.join(basePath, sessionDir);
    if (fs.existsSync(sessionPath)) {
      const sessionScripts = ['REPORT-PROGRESS.sh', 'ADD-TO-VALIDATION.sh', 'start-agents.sh'];
      
      for (const scriptName of sessionScripts) {
        const scriptPath = path.join(sessionPath, scriptName);
        if (fs.existsSync(scriptPath)) {
          const processInfo = runningProcesses.get(scriptPath);
          scripts.push({
            name: `${sessionDir}/${scriptName}`,
            path: scriptPath,
            description: `${sessionDir} - ${getScriptDescription(scriptName)}`,
            type: getScriptType(scriptName),
            running: isScriptActuallyRunning(scriptPath, processInfo),
            last_run: processInfo?.endTime || getLastRunTime(scriptPath),
            exit_code: processInfo?.exitCode || getLastExitCode(scriptPath),
            has_logs: processInfo?.logs?.length > 0
          });
        }
      }
    }
  }

  return scripts;
}

async function getRunningProcesses() {
  return new Promise((resolve) => {
    exec('ps aux | grep -E "(node|npm|bash)" | grep -v grep', (error, stdout) => {
      if (error) {
        resolve([]);
        return;
      }

      const lines = stdout.trim().split('\n');
      const processes = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        return {
          pid: parts[1],
          cpu: parts[2],
          memory: Math.round(parseFloat(parts[5]) / 1024), // Convert KB to MB
          command: parts.slice(10).join(' ')
        };
      }).filter(p => p.pid && p.command);

      resolve(processes);
    });
  });
}

async function controlService(serviceId, action) {
  switch (serviceId) {
    case 'dashboard-backend':
      return { success: false, error: 'Cannot stop the service from itself' };
    
    case 'dashboard-frontend':
      return await controlFrontendService(action);
    
    default:
      return { success: false, error: 'Unknown service' };
  }
}

async function controlFrontendService(action) {
  return new Promise((resolve) => {
    switch (action) {
      case 'start':
        // Start frontend in background
        const frontendPath = path.resolve(__dirname, '../../frontend');
        const startProcess = spawn('npm', ['start'], {
          cwd: frontendPath,
          detached: true,
          stdio: 'ignore',
          env: { ...process.env, PORT: '5010' }
        });
        
        startProcess.unref();
        
        // Give it a moment to start
        setTimeout(() => {
          resolve({ success: true, message: 'Frontend service starting...' });
        }, 1000);
        break;
        
      case 'stop':
        exec('pkill -f "react-scripts start" || pkill -f "PORT=5010"', (error) => {
          resolve({ success: true, message: 'Frontend service stopped' });
        });
        break;
        
      case 'restart':
        exec('pkill -f "react-scripts start" || pkill -f "PORT=5010"', () => {
          // Wait a bit then restart
          setTimeout(() => {
            const frontendPath = path.resolve(__dirname, '../../frontend');
            const restartProcess = spawn('npm', ['start'], {
              cwd: frontendPath,
              detached: true,
              stdio: 'ignore',
              env: { ...process.env, PORT: '5010' }
            });
            
            restartProcess.unref();
            resolve({ success: true, message: 'Frontend service restarted' });
          }, 2000);
        });
        break;
        
      default:
        resolve({ success: false, error: 'Unknown action' });
    }
  });
}

async function controlScript(scriptPath, action) {
  return new Promise((resolve) => {
    switch (action) {
      case 'run':
        if (runningProcesses.has(scriptPath) && runningProcesses.get(scriptPath)?.running === true) {
          resolve({ success: false, error: 'Script is already running' });
          return;
        }

        console.log(`Starting script: ${scriptPath}`);
        
        const child = spawn('bash', [scriptPath], {
          detached: false,
          stdio: ['ignore', 'pipe', 'pipe'],
          cwd: path.dirname(scriptPath),
          env: { ...process.env, PATH: process.env.PATH }
        });

        const processInfo = {
          pid: child.pid,
          process: child,
          startTime: new Date(),
          logs: [],
          running: true
        };
        
        runningProcesses.set(scriptPath, processInfo);
        
        console.log(`Script ${scriptPath} started with PID ${child.pid}`);

        child.stdout.on('data', (data) => {
          const logEntry = { type: 'stdout', data: data.toString().trim(), timestamp: new Date() };
          console.log(`[${path.basename(scriptPath)}] STDOUT:`, logEntry.data);
          if (processInfo) {
            processInfo.logs.push(logEntry);
            // Keep only last 100 log entries
            if (processInfo.logs.length > 100) {
              processInfo.logs = processInfo.logs.slice(-100);
            }
          }
        });

        child.stderr.on('data', (data) => {
          const logEntry = { type: 'stderr', data: data.toString().trim(), timestamp: new Date() };
          console.log(`[${path.basename(scriptPath)}] STDERR:`, logEntry.data);
          if (processInfo) {
            processInfo.logs.push(logEntry);
            // Keep only last 100 log entries
            if (processInfo.logs.length > 100) {
              processInfo.logs = processInfo.logs.slice(-100);
            }
          }
        });

        child.on('exit', (code, signal) => {
          console.log(`Script ${scriptPath} exited with code ${code}, signal ${signal}`);
          if (processInfo) {
            processInfo.exitCode = code;
            processInfo.endTime = new Date();
            processInfo.running = false;
            processInfo.logs.push({ 
              type: 'system', 
              data: `Process exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`, 
              timestamp: new Date() 
            });
            
            // Keep process info for 5 minutes for log viewing
            setTimeout(() => {
              runningProcesses.delete(scriptPath);
              console.log(`Removed process info for ${scriptPath}`);
            }, 300000);
          }
        });

        child.on('error', (error) => {
          console.error(`Script ${scriptPath} error:`, error);
          if (processInfo) {
            processInfo.logs.push({ 
              type: 'error', 
              data: `Process error: ${error.message}`, 
              timestamp: new Date() 
            });
            processInfo.running = false;
          }
        });

        resolve({ success: true, message: 'Script started', pid: child.pid });
        break;

      case 'stop':
        const stopProcessInfo = runningProcesses.get(scriptPath);
        if (stopProcessInfo && stopProcessInfo.process) {
          stopProcessInfo.process.kill('SIGTERM');
          runningProcesses.delete(scriptPath);
          resolve({ success: true, message: 'Script stopped' });
        } else {
          resolve({ success: false, error: 'Script is not running' });
        }
        break;

      case 'logs':
        const logInfo = runningProcesses.get(scriptPath);
        if (logInfo && logInfo.logs.length > 0) {
          const logs = logInfo.logs.map(log => 
            `[${log.timestamp.toISOString()}] ${log.type.toUpperCase()}: ${log.data}`
          ).join('\n');
          const summary = {
            running: logInfo.running || false,
            startTime: logInfo.startTime,
            endTime: logInfo.endTime,
            exitCode: logInfo.exitCode,
            logCount: logInfo.logs.length
          };
          resolve({ success: true, logs: logs, summary: summary });
        } else {
          resolve({ success: false, error: 'No logs available for this script' });
        }
        break;

      default:
        resolve({ success: false, error: 'Unknown action' });
    }
  });
}

// Utility functions
async function checkPort(port) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`lsof -i :${port}`, (error, stdout) => {
      if (error) {
        resolve('stopped');
      } else {
        // Check if the process is actually listening
        if (stdout.includes('LISTEN')) {
          resolve('running');
        } else {
          resolve('stopped');
        }
      }
    });
  });
}

async function checkAdditionalServices() {
  // Check for any additional services that might be running
  return [];
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getScriptDescription(scriptName) {
  const descriptions = {
    'START-ALL-SESSIONS.sh': 'Start all 6 business challenge sessions',
    'SYNC-ALL-PROGRESS.sh': 'Sync progress from all sessions to dashboard',
    'POPULATE-VALIDATION-QUEUE.sh': 'Add created content to validation queue',
    'REPORT-PROGRESS.sh': 'Report session progress to dashboard',
    'ADD-TO-VALIDATION.sh': 'Add session content to validation',
    'start-agents.sh': 'Start session agents'
  };
  
  return descriptions[scriptName] || 'Session script';
}

function getScriptType(scriptName) {
  // One-shot scripts that execute once and exit
  const oneShot = [
    'REPORT-PROGRESS.sh',
    'ADD-TO-VALIDATION.sh', 
    'SYNC-ALL-PROGRESS.sh',
    'POPULATE-VALIDATION-QUEUE.sh'
  ];
  
  // Service scripts that should stay running
  const services = [
    'START-ALL-SESSIONS.sh',
    'start-agents.sh'
  ];
  
  if (oneShot.includes(scriptName)) return 'one-shot';
  if (services.includes(scriptName)) return 'service';
  return 'unknown';
}

function getLastRunTime(scriptPath) {
  try {
    const stats = fs.statSync(scriptPath);
    return stats.mtime.toISOString();
  } catch {
    return null;
  }
}

function getLastExitCode(scriptPath) {
  // This would typically be stored in a log file or database
  // For now, return undefined (no exit code available)
  return undefined;
}

function isScriptActuallyRunning(scriptPath, processInfo) {
  // Pour les scripts start-agents.sh, vérifier si le .session-started existe ET est récent
  if (scriptPath.includes('start-agents.sh')) {
    const sessionFile = path.join(path.dirname(scriptPath), '.session-started');
    if (fs.existsSync(sessionFile)) {
      const stats = fs.statSync(sessionFile);
      const ageMinutes = (Date.now() - stats.mtime.getTime()) / 1000 / 60;
      // Session considérée active si le fichier a été touché dans les 10 dernières minutes
      return ageMinutes < 10;
    }
    return false;
  }
  
  // Pour les autres scripts, utiliser la logique standard
  return processInfo?.running === true;
}

module.exports = router;