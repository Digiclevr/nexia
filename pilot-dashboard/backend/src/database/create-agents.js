const db = require('./connection');

async function createRealAgents() {
  try {
    console.log('🤖 Creating real agents in database...');
    
    // Supprimer les anciens agents
    await db('agents').del();
    
    const agents = [
      {
        name: 'AuditBot',
        type: 'outreach',
        status: 'active',
        config: JSON.stringify({
          session_id: 1,
          session_name: 'API Audits',
          target_daily_revenue: 800,
          apis_required: ['linkedin', 'email', 'stripe'],
          engagement_rules: {
            linkedin_daily_limit: 20,
            email_daily_limit: 50,
            response_time_max: '2h',
            qualification_criteria: ['has_api', 'recent_funding', 'security_incidents']
          },
          workflows: [
            'prospect_research',
            'content_generation', 
            'outreach_campaigns',
            'payment_processing'
          ]
        }),
        stats: JSON.stringify({
          prospects_identified: 0,
          messages_sent: 0,
          responses_received: 0,
          audits_sold: 0,
          revenue_generated: 0
        }),
        last_run: new Date().toISOString()
      },
      {
        name: 'CrisisBot', 
        type: 'monitoring',
        status: 'active',
        config: JSON.stringify({
          session_id: 2,
          session_name: 'Emergency Consulting',
          target_daily_revenue: 500,
          apis_required: ['github', 'twitter', 'linkedin', 'stripe'],
          engagement_rules: {
            crisis_detection_interval: '15min',
            response_time_max: '30min',
            max_concurrent_cases: 3,
            pricing_emergency_multiplier: 2.5
          },
          monitoring_sources: ['github_issues', 'twitter_mentions', 'linkedin_posts', 'reddit_devops']
        }),
        stats: JSON.stringify({
          crises_detected: 0,
          interventions_proposed: 0,
          clients_acquired: 0,
          emergency_revenue: 0
        }),
        last_run: new Date().toISOString()
      },
      {
        name: 'ContentBot',
        type: 'content', 
        status: 'active',
        config: JSON.stringify({
          session_id: 3,
          session_name: 'Content & Founding Members',
          target_daily_revenue: 150,
          apis_required: ['openai', 'linkedin', 'twitter', 'stripe'],
          engagement_rules: {
            posts_per_day: 3,
            article_length_min: 1200,
            founding_member_price: 99,
            content_approval_required: false
          },
          content_types: ['technical_articles', 'social_posts', 'email_sequences', 'landing_pages']
        }),
        stats: JSON.stringify({
          articles_written: 0,
          posts_published: 0,
          founding_members: 0,
          content_revenue: 0
        }),
        last_run: new Date().toISOString()
      },
      {
        name: 'CommunityBot',
        type: 'community',
        status: 'active', 
        config: JSON.stringify({
          session_id: 3,
          session_name: 'Content & Founding Members',
          target_daily_revenue: 0, // Support ContentBot
          apis_required: ['discord', 'slack', 'telegram'],
          engagement_rules: {
            communities_to_join: 10,
            daily_engagement_posts: 5,
            dm_limit_per_community: 3,
            value_first_ratio: 0.8 // 80% value, 20% promotion
          }
        }),
        stats: JSON.stringify({
          communities_joined: 0,
          engagements_made: 0,
          leads_generated: 0
        }),
        last_run: new Date().toISOString()
      },
      {
        name: 'TechWriterBot',
        type: 'sales',
        status: 'active',
        config: JSON.stringify({
          session_id: 4,
          session_name: 'Technical Writing', 
          target_daily_revenue: 300,
          apis_required: ['upwork', 'linkedin', 'email'],
          engagement_rules: {
            proposals_per_day: 10,
            hourly_rate_min: 50,
            project_size_min: 500,
            specialties: ['api_documentation', 'technical_tutorials', 'developer_guides']
          }
        }),
        stats: JSON.stringify({
          proposals_sent: 0,
          interviews_scheduled: 0,
          projects_won: 0,
          writing_revenue: 0
        }),
        last_run: new Date().toISOString()
      },
      {
        name: 'ArchitectBot',
        type: 'delivery',
        status: 'active',
        config: JSON.stringify({
          session_id: 5,
          session_name: 'Done For You',
          target_daily_revenue: 400,
          apis_required: ['stripe', 'calendly', 'slack'],
          engagement_rules: {
            qualification_score_min: 7,
            project_size_min: 2000,
            delivery_time_max: '48h',
            premium_pricing: true
          }
        }),
        stats: JSON.stringify({
          prospects_qualified: 0,
          consultations_booked: 0,
          projects_sold: 0,
          architecture_revenue: 0
        }),
        last_run: new Date().toISOString()
      },
      {
        name: 'GiveawayBot',
        type: 'marketing',
        status: 'active',
        config: JSON.stringify({
          session_id: 6,
          session_name: 'Giveaway Campaign',
          target_daily_revenue: 50,
          apis_required: ['twitter', 'linkedin', 'email'],
          engagement_rules: {
            viral_coefficient_target: 2.5,
            participation_requirements: ['follow', 'retweet', 'tag_friends'],
            conversion_to_paid_target: 0.05 // 5%
          }
        }),
        stats: JSON.stringify({
          participants: 0,
          viral_reach: 0,
          conversions: 0,
          giveaway_revenue: 0
        }),
        last_run: new Date().toISOString()
      }
    ];

    // Insérer tous les agents
    for (const agent of agents) {
      await db('agents').insert(agent);
      console.log(`✅ ${agent.name} créé - Session ${JSON.parse(agent.config).session_id}`);
    }

    console.log(`🎯 ${agents.length} agents créés avec succès`);
    console.log('📊 Target total jour 1: €2,200');
    
    return agents;
  } catch (error) {
    console.error('❌ Erreur création agents:', error);
    throw error;
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  createRealAgents()
    .then((agents) => {
      console.log('🎉 Agents prêts pour le Business Challenge');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec création agents:', error);
      process.exit(1);
    });
}

module.exports = createRealAgents;