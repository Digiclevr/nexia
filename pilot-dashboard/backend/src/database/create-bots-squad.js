const db = require('./connection');

async function createBotsSquadTables() {
  try {
    console.log('🤖 Creating BOTS SQUAD CLAUDE tables...');

    // Drop all existing bots tables to recreate with proper BOTS structure + Guardrails
    await db.schema.dropTableIfExists('bot_validation_queue');
    await db.schema.dropTableIfExists('bot_metrics_history');
    await db.schema.dropTableIfExists('bot_coordination');
    await db.schema.dropTableIfExists('bot_tasks');
    await db.schema.dropTableIfExists('bots_squad');

    // Bots Squad table based on BOTS-SQUAD-CLAUDE.md specifications
    await db.schema.createTable('bots_squad', (table) => {
      table.increments('id').primary();
      table.string('bot_id').notNullable().unique(); // coordinator-bot, api-bot, etc.
      table.string('name').notNullable(); // CoordinatorBot, ApiBot, etc.
      table.string('role').notNullable(); // Chef d'Orchestration, etc.
      table.string('domain').notNullable(); // Cross-project + Business Intelligence
      table.string('status').defaultTo('active'); // active, maintenance, error, paused
      table.integer('health').defaultTo(95); // 0-100 health score
      table.integer('tasks_completed').defaultTo(0);
      table.integer('tasks_active').defaultTo(0);
      table.timestamp('last_activity').defaultTo(db.fn.now());
      table.json('specialization'); // Array of specializations
      table.json('current_tasks'); // Array of current tasks
      table.json('metrics'); // Bot-specific KPIs
      table.json('workflows'); // Automated workflows configuration
      table.timestamps(true, true);
    });

    // Bot Tasks table for detailed task management
    await db.schema.createTable('bot_tasks', (table) => {
      table.increments('id').primary();
      table.string('bot_id').notNullable();
      table.string('task_name').notNullable();
      table.text('description');
      table.string('priority').notNullable(); // critical, high, medium, low
      table.string('status').notNullable(); // pending, in_progress, active, completed, failed
      table.json('metadata'); // Task-specific data
      table.timestamp('scheduled_for');
      table.timestamp('started_at');
      table.timestamp('completed_at');
      table.timestamps(true, true);
    });

    // Bot Coordination table for inter-bot communication
    await db.schema.createTable('bot_coordination', (table) => {
      table.increments('id').primary();
      table.string('workflow_type').notNullable(); // api_change_impact, feature_launch, incident_response
      table.string('initiator_bot').notNullable(); // Bot who initiated the workflow
      table.json('involved_bots'); // Array of bot IDs involved
      table.string('status').notNullable(); // pending, in_progress, completed, failed
      table.json('workflow_data'); // Workflow-specific data
      table.json('dependencies'); // Cross-bot dependencies
      table.json('communication_log'); // Bot-to-bot messages
      table.timestamps(true, true);
    });

    // Bot Metrics History for performance tracking
    await db.schema.createTable('bot_metrics_history', (table) => {
      table.increments('id').primary();
      table.string('bot_id').notNullable();
      table.date('date').notNullable();
      table.json('metrics_snapshot'); // Daily metrics snapshot
      table.json('kpi_achievements'); // KPI targets vs actual
      table.json('performance_notes'); // Performance analysis
      table.timestamps(true, true);
      table.unique(['bot_id', 'date']);
    });

    // Create bot_validation_queue table for Guardrails A+C System
    await db.schema.createTable('bot_validation_queue', (table) => {
      table.increments('id').primary();
      table.string('initiator_bot').notNullable(); // Bot requesting validation
      table.string('action_type').notNullable(); // Type of action needing validation
      table.text('action_data'); // JSON: Action details and parameters
      table.string('validation_type').notNullable(); // high_value_deal, strategic_decision, etc.
      table.integer('priority').notNullable().defaultTo(50); // 0-100 priority score
      table.decimal('estimated_impact', 10, 2).defaultTo(0); // Expected financial impact in EUR
      table.string('status').notNullable().defaultTo('pending'); // pending, approved, rejected, modified
      table.text('guardrails_context'); // JSON: Business context and guardrails data
      table.text('human_feedback'); // Human supervisor feedback
      table.timestamp('decision_time'); // When human decision was made
      table.text('adjustments'); // JSON: Human modifications to the action
      table.text('claude_analysis'); // JSON: Claude MAX 20x analysis results
      table.timestamp('claude_analyzed_at'); // When Claude analysis was performed
      table.timestamps(true, true);
      
      // Indexes for performance
      table.index(['status', 'priority']);
      table.index(['initiator_bot', 'created_at']);
      table.index(['validation_type', 'status']);
      table.index('estimated_impact');
    });

    console.log('✅ BOTS SQUAD CLAUDE tables created successfully');
    return true;
  } catch (error) {
    console.error('❌ BOTS SQUAD tables creation failed:', error);
    throw error;
  }
}

// Function to seed initial BOTS SQUAD data
async function seedBotsSquad() {
  try {
    console.log('🌱 Seeding BOTS SQUAD CLAUDE data...');

    const botsData = [
      {
        bot_id: 'coordinator-bot',
        name: 'CoordinatorBot',
        role: 'Chef d\'Orchestration',
        domain: 'Cross-project + Business intelligence + Strategic decisions',
        status: 'active',
        health: 98,
        tasks_completed: 156,
        tasks_active: 8,
        last_activity: new Date(),
        specialization: [
          'Synchronisation daily des 5 bots spécialisés',
          'Détection conflits ressources/priorités cross-projets',
          'Escalation décisions critiques (budget >€500, technical debt)',
          'Reporting consolidé business metrics + KPIs techniques'
        ],
        current_tasks: [
          { id: 1, text: 'Daily standup coordination', priority: 'high', status: 'in_progress' },
          { id: 2, text: 'API-Portal dependency analysis', priority: 'medium', status: 'pending' },
          { id: 3, text: 'Infrastructure cost optimization', priority: 'high', status: 'in_progress' }
        ],
        metrics: {
          syncAccuracy: 96,
          escalationPrecision: 92,
          conflictResolutionTime: 1.8,
          businessImpactAccuracy: 87
        },
        workflows: {
          dailyStandup: { enabled: true, time: '09:00', participants: ['all'] },
          conflictResolution: { enabled: true, escalationThreshold: 2 },
          performanceMonitoring: { enabled: true, interval: '1h' }
        }
      },
      {
        bot_id: 'api-bot',
        name: 'ApiBot',
        role: 'Gestionnaire API Infrastructure',
        domain: '/onlyoneapi/api + FastAPI + Kubernetes + DigitalOcean',
        status: 'active',
        health: 99,
        tasks_completed: 423,
        tasks_active: 12,
        last_activity: new Date(),
        specialization: [
          'Monitoring 423 endpoints : health checks + performance + errors',
          'Infrastructure management : K8s scaling + cost optimization',
          'API documentation : Auto-generation + developer experience',
          'Security audits : Endpoints vulnerability scans + compliance'
        ],
        current_tasks: [
          { id: 1, text: 'Health checks monitoring 423 endpoints', priority: 'critical', status: 'active' },
          { id: 2, text: 'Auto-scaling K8s optimization', priority: 'medium', status: 'in_progress' },
          { id: 3, text: 'Security vulnerability scan daily', priority: 'high', status: 'pending' }
        ],
        metrics: {
          apiUptime: 99.9,
          responseTimeP95: 185,
          securityScore: 96,
          costEfficiency: 91,
          documentationCoverage: 100
        },
        workflows: {
          healthMonitoring: { enabled: true, interval: '5m', endpoints: 423 },
          autoScaling: { enabled: true, thresholds: { cpu: 70, memory: 80 } },
          securityScans: { enabled: true, schedule: 'daily' }
        }
      },
      {
        bot_id: 'marketing-bot',
        name: 'MarketingBot',
        role: 'Content & Campaign Manager',
        domain: '/onlyoneapi/marketing + Next.js site + content strategy',
        status: 'active',
        health: 94,
        tasks_completed: 89,
        tasks_active: 6,
        last_activity: new Date(),
        specialization: [
          'Content generation : Blog posts + case studies + technical articles',
          'Campaign automation : Email sequences + social media + LinkedIn',
          'Brand consistency : Messaging alignment cross-platforms',
          'SEO optimization : Content + technical SEO + performance'
        ],
        current_tasks: [
          { id: 1, text: 'Founding members campaign automation', priority: 'critical', status: 'in_progress' },
          { id: 2, text: 'LinkedIn content calendar weekly', priority: 'medium', status: 'active' },
          { id: 3, text: 'Blog post auto-generation pipeline', priority: 'low', status: 'pending' }
        ],
        metrics: {
          contentEngagement: 78,
          leadGeneration: 134,
          brandConsistency: 97,
          campaignROI: 245,
          seoPerformance: 82
        },
        workflows: {
          contentCalendar: { enabled: true, schedule: 'weekly', platforms: ['linkedin', 'blog'] },
          emailCampaigns: { enabled: true, sequences: 5, automation: true },
          seoMonitoring: { enabled: true, interval: 'daily' }
        }
      },
      {
        bot_id: 'community-bot',
        name: 'CommunityBot',
        role: 'Engagement & Support',
        domain: '/onlyoneapi/community + Discord + user support',
        status: 'active',
        health: 97,
        tasks_completed: 267,
        tasks_active: 9,
        last_activity: new Date(),
        specialization: [
          'Community moderation : Discord + forum + social channels',
          'Support automation : FAQ + ticket routing + knowledge base',
          'User onboarding : Welcome sequences + tutorial guidance',
          'Feedback collection : User insights + feature requests + satisfaction'
        ],
        current_tasks: [
          { id: 1, text: 'Discord moderation 24/7 active', priority: 'medium', status: 'active' },
          { id: 2, text: 'Support ticket triage automation', priority: 'high', status: 'in_progress' },
          { id: 3, text: 'User onboarding sequences optimization', priority: 'medium', status: 'pending' }
        ],
        metrics: {
          communityGrowth: 12,
          supportEfficiency: 94,
          userRetention: 89,
          feedbackQuality: 91,
          eventParticipation: 76
        },
        workflows: {
          supportTriage: { enabled: true, autoRoute: true, responseTime: '<2h' },
          communityEngagement: { enabled: true, platforms: ['discord'], moderation: true },
          userOnboarding: { enabled: true, sequences: 3, automation: true }
        }
      },
      {
        bot_id: 'developer-bot',
        name: 'DeveloperBot',
        role: 'DevEx & Documentation',
        domain: '/onlyoneapi/developer + docs + SDKs + integration tools',
        status: 'active',
        health: 96,
        tasks_completed: 198,
        tasks_active: 7,
        last_activity: new Date(),
        specialization: [
          'Documentation maintenance : API docs + guides + examples',
          'SDK development : Client libraries + code samples + tools',
          'Developer onboarding : Getting started + tutorials + best practices',
          'Integration support : Troubleshooting + debugging + optimization'
        ],
        current_tasks: [
          { id: 1, text: 'API docs auto-generation pipeline', priority: 'high', status: 'in_progress' },
          { id: 2, text: 'SDK updates for API v8.1 compatibility', priority: 'medium', status: 'pending' },
          { id: 3, text: 'Integration examples maintenance', priority: 'low', status: 'pending' }
        ],
        metrics: {
          documentationQuality: 95,
          sdkAdoption: 76,
          developerOnboarding: 88,
          integrationSuccess: 92,
          contentEngagement: 82
        },
        workflows: {
          docGeneration: { enabled: true, trigger: 'api_changes', automation: true },
          sdkUpdates: { enabled: true, versioning: 'auto', testing: true },
          developerFeedback: { enabled: true, collection: 'surveys', tracking: true }
        }
      },
      {
        bot_id: 'portal-bot',
        name: 'PortalBot',
        role: 'User Management & Experience',
        domain: '/onlyoneapi/portal + Next.js dashboard + user lifecycle',
        status: 'active',
        health: 93,
        tasks_completed: 145,
        tasks_active: 11,
        last_activity: new Date(),
        specialization: [
          'User account management : Registration + profile + preferences',
          'Billing automation : Invoicing + payment processing + renewals',
          'Usage monitoring : API consumption + limits + optimization alerts',
          'Customer success : Health scoring + retention + upsell opportunities'
        ],
        current_tasks: [
          { id: 1, text: 'Billing cycle automation monthly', priority: 'high', status: 'active' },
          { id: 2, text: 'User health scoring algorithm', priority: 'medium', status: 'in_progress' },
          { id: 3, text: 'Dashboard UX optimization analysis', priority: 'low', status: 'pending' }
        ],
        metrics: {
          userActivation: 84,
          billingAccuracy: 99,
          userSatisfaction: 87,
          churnPrevention: 76,
          revenueOptimization: 91
        },
        workflows: {
          accountProvisioning: { enabled: true, automation: true, apiKeys: true },
          billingCycles: { enabled: true, schedule: 'monthly', automation: true },
          healthScoring: { enabled: true, churnPrediction: true, intervention: true }
        }
      }
    ];

    // Insert bots data
    for (const bot of botsData) {
      await db('bots_squad').insert({
        ...bot,
        specialization: JSON.stringify(bot.specialization),
        current_tasks: JSON.stringify(bot.current_tasks),
        metrics: JSON.stringify(bot.metrics),
        workflows: JSON.stringify(bot.workflows)
      });
    }

    console.log('✅ BOTS SQUAD CLAUDE data seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ BOTS SQUAD seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  Promise.resolve()
    .then(() => createBotsSquadTables())
    .then(() => seedBotsSquad())
    .then(() => {
      console.log('🎉 BOTS SQUAD CLAUDE ready for action!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 BOTS SQUAD setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createBotsSquadTables, seedBotsSquad };