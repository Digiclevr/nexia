const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Données d'architecture
const architectureData = {
  layers: [
    {
      id: "layer-1",
      name: "Agents IA",
      level: 1,
      color: "#E3F2FD",
      components: [
        {
          id: "agent-veille",
          name: "Agent Veille IA",
          description: "Analyse SERP, tendances Google, détection opportunités",
          type: "ai-agent",
          position: { x: 100, y: 100 },
          metrics: { processedPerDay: 500, accuracy: "95%" },
          connections: ["agent-brief"]
        },
        {
          id: "agent-brief",
          name: "Agent Brief",
          description: "Génération briefs SEO : H1/H2/FAQ/sources primaires",
          type: "ai-agent",
          position: { x: 300, y: 100 },
          metrics: { briefsPerDay: 150, qualityScore: "0.92" },
          connections: ["agent-redaction"]
        },
        {
          id: "agent-redaction",
          name: "Agent Rédaction",
          description: "Production articles long-form 3k+ mots avec citations",
          type: "ai-agent",
          position: { x: 500, y: 100 },
          metrics: { articlesPerDay: 50, wordsAvg: 3200 },
          connections: ["agent-qa"]
        },
        {
          id: "agent-qa",
          name: "Agent QA",
          description: "Validation E-E-A-T, fact-checking, score qualité",
          type: "ai-agent",
          position: { x: 700, y: 100 },
          metrics: { validationRate: "0.84", rejectionRate: "16%" },
          connections: ["strapi"]
        }
      ]
    },
    {
      id: "layer-2",
      name: "Hub Central",
      level: 2,
      color: "#F3E5F5",
      components: [
        {
          id: "strapi",
          name: "Strapi Headless",
          description: "CMS multi-tenant, API-first, cloisonnement par domaine",
          type: "cms",
          position: { x: 200, y: 250 },
          metrics: { domains: 230, apiCalls: "50k/day" },
          connections: ["n8n", "directus"]
        },
        {
          id: "directus",
          name: "Directus",
          description: "Données structurées : comparatifs, KPI, jobs repurpose",
          type: "cms",
          position: { x: 500, y: 250 },
          metrics: { collections: 12, records: "100k+" },
          connections: ["n8n"]
        }
      ]
    },
    {
      id: "layer-3",
      name: "Orchestration",
      level: 3,
      color: "#E8F5E8",
      components: [
        {
          id: "n8n",
          name: "n8n Workflows",
          description: "Chef d'orchestre : builds, publication, repurposing, KPI",
          type: "orchestrator",
          position: { x: 350, y: 400 },
          metrics: { workflows: 8, executions: "1k/day" },
          connections: ["nextjs", "repurpose", "listmonk", "shlink"]
        },
        {
          id: "langgraph",
          name: "LangGraph",
          description: "State machine des agents IA, orchestration locale",
          type: "ai-orchestrator",
          position: { x: 600, y: 400 },
          metrics: { agents: 8, stateTransitions: "500/day" },
          connections: ["n8n"]
        }
      ]
    },
    {
      id: "layer-4",
      name: "Génération Sites",
      level: 4,
      color: "#E8F5E8",
      components: [
        {
          id: "nextjs",
          name: "Next.js SSG",
          description: "Génération statique des 230 domaines, build optimisé",
          type: "frontend",
          position: { x: 200, y: 550 },
          metrics: { sites: 230, buildTime: "5min", sizeAvg: "2MB" },
          connections: ["kinsta"]
        },
        {
          id: "kinsta",
          name: "Kinsta Static",
          description: "Hébergement statique, CDN global, déploiement auto",
          type: "hosting",
          position: { x: 450, y: 550 },
          metrics: { uptime: "99.9%", bandwidth: "5TB/month" },
          connections: ["cloudflare"]
        },
        {
          id: "cloudflare",
          name: "Cloudflare",
          description: "CDN, WAF, headers sécurité, gestion wildcard",
          type: "security",
          position: { x: 700, y: 550 },
          metrics: { requests: "10M/month", blocked: "15%" },
          connections: ["monetization"]
        }
      ]
    },
    {
      id: "layer-5",
      name: "Monétisation",
      level: 5,
      color: "#FFF3E0",
      components: [
        {
          id: "affiliation",
          name: "Affiliation",
          description: "Impact, Awin, programmes SaaS - 60% du CA",
          type: "monetization",
          position: { x: 100, y: 700 },
          metrics: { programs: 15, epc: "0.35€", conversion: "2.5%" },
          revenue: { percentage: 60, monthly: "15k€" }
        },
        {
          id: "location",
          name: "Location Sous-domaines",
          description: "Noindex par défaut, index après revue - 25% du CA",
          type: "monetization",
          position: { x: 300, y: 700 },
          metrics: { rented: "18%", avgPrice: "280€/month" },
          revenue: { percentage: 25, monthly: "4k€" }
        },
        {
          id: "newsletter",
          name: "Newsletter/Upsell",
          description: "Listmonk, giveaways, ARPU email - 10% du CA",
          type: "monetization",
          position: { x: 500, y: 700 },
          metrics: { subscribers: "50k", openRate: "25%", arpu: "0.25€" },
          revenue: { percentage: 10, monthly: "2k€" }
        },
        {
          id: "publicite",
          name: "Publicité",
          description: "AdSense, Ezoic - 5% du CA",
          type: "monetization",
          position: { x: 700, y: 700 },
          metrics: { cpm: "5€", impressions: "2M/month" },
          revenue: { percentage: 5, monthly: "1k€" }
        }
      ]
    },
    {
      id: "layer-6",
      name: "Social & Email",
      level: 6,
      color: "#F1F8E9",
      components: [
        {
          id: "repurpose",
          name: "Repurposing Social",
          description: "Carrousels LinkedIn, threads X, Shorts YouTube",
          type: "social",
          position: { x: 150, y: 850 },
          metrics: { postsPerDay: 50, engagement: "3.2%" },
          connections: ["shlink"]
        },
        {
          id: "listmonk",
          name: "Listmonk",
          description: "Newsletters par cluster, segments, giveaways",
          type: "email",
          position: { x: 350, y: 850 },
          metrics: { campaigns: "8/month", delivery: "98%" },
          connections: ["minio"]
        },
        {
          id: "shlink",
          name: "Shlink",
          description: "URLs courtes, tracking UTM, analytics",
          type: "tracking",
          position: { x: 550, y: 850 },
          metrics: { clicks: "100k/month", ctr: "2.1%" }
        },
        {
          id: "minio",
          name: "MinIO",
          description: "Assets, giveaways, URLs signées S3-compatible",
          type: "storage",
          position: { x: 750, y: 850 },
          metrics: { storage: "500GB", downloads: "10k/month" }
        }
      ]
    },
    {
      id: "layer-7",
      name: "Analytics & Infrastructure",
      level: 7,
      color: "#E0F2F1",
      components: [
        {
          id: "posthog",
          name: "PostHog",
          description: "Events, funnels, comportement utilisateur",
          type: "analytics",
          position: { x: 100, y: 1000 },
          metrics: { events: "1M/month", funnels: 25 }
        },
        {
          id: "plausible",
          name: "Plausible",
          description: "Web analytics privacy-first, KPI globaux",
          type: "analytics",
          position: { x: 300, y: 1000 },
          metrics: { pageviews: "5M/month", bounceRate: "45%" }
        },
        {
          id: "grafana",
          name: "Grafana",
          description: "Dashboards, alertes, monitoring système",
          type: "monitoring",
          position: { x: 500, y: 1000 },
          metrics: { dashboards: 12, alerts: 50 }
        },
        {
          id: "postgresql",
          name: "PostgreSQL",
          description: "Base centrale multi-tenant, cloisonnement strict",
          type: "database",
          position: { x: 200, y: 1150 },
          metrics: { size: "50GB", queries: "100k/day" }
        },
        {
          id: "redis",
          name: "Redis",
          description: "Cache, queues, sessions, accélération API",
          type: "cache",
          position: { x: 400, y: 1150 },
          metrics: { hitRate: "95%", memory: "4GB" }
        },
        {
          id: "kubernetes",
          name: "Kubernetes",
          description: "Orchestration containers, DigitalOcean cluster",
          type: "infrastructure",
          position: { x: 600, y: 1150 },
          metrics: { nodes: 6, pods: 45, uptime: "99.9%" }
        }
      ]
    }
  ],
  flows: [
    {
      id: "content-pipeline",
      name: "Pipeline Contenu",
      type: "primary",
      color: "#2196F3",
      path: ["agent-veille", "agent-brief", "agent-redaction", "agent-qa", "strapi", "n8n", "nextjs", "kinsta", "cloudflare"]
    },
    {
      id: "repurpose-flow",
      name: "Flux Repurposing",
      type: "secondary",
      color: "#FF9800",
      path: ["n8n", "repurpose", "shlink"]
    },
    {
      id: "email-flow",
      name: "Flux Email",
      type: "secondary",
      color: "#4CAF50",
      path: ["n8n", "listmonk", "minio"]
    },
    {
      id: "monetization-flow",
      name: "Flux Monétisation",
      type: "revenue",
      color: "#FFD700",
      path: ["cloudflare", "affiliation", "location", "newsletter", "publicite"]
    }
  ]
};

// Routes API
app.get('/api/architecture', (req, res) => {
  res.json(architectureData);
});

app.get('/api/layer/:id', (req, res) => {
  const layer = architectureData.layers.find(l => l.id === req.params.id);
  if (layer) {
    res.json(layer);
  } else {
    res.status(404).json({ error: 'Layer not found' });
  }
});

app.get('/api/component/:id', (req, res) => {
  let component = null;
  for (const layer of architectureData.layers) {
    component = layer.components.find(c => c.id === req.params.id);
    if (component) break;
  }
  
  if (component) {
    res.json(component);
  } else {
    res.status(404).json({ error: 'Component not found' });
  }
});

// Simulation de métriques temps réel
app.get('/api/metrics/realtime', (req, res) => {
  const simulatedMetrics = {
    timestamp: new Date().toISOString(),
    pipeline: {
      articlesInProgress: Math.floor(Math.random() * 10) + 5,
      queueSize: Math.floor(Math.random() * 50) + 20,
      processingTime: Math.floor(Math.random() * 300) + 120
    },
    revenue: {
      todayTotal: Math.floor(Math.random() * 1000) + 500,
      affiliation: Math.floor(Math.random() * 600) + 300,
      location: Math.floor(Math.random() * 200) + 100,
      newsletter: Math.floor(Math.random() * 100) + 50
    },
    traffic: {
      activeVisitors: Math.floor(Math.random() * 500) + 200,
      pageviews: Math.floor(Math.random() * 10000) + 5000,
      conversions: Math.floor(Math.random() * 50) + 20
    }
  };
  
  res.json(simulatedMetrics);
});

// Servir l'app React en production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📊 Architecture Visualizer disponible sur http://localhost:${PORT}`);
});