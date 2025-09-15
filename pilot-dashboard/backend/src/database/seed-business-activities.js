const db = require('./connection');

async function seedBusinessActivities() {
  try {
    console.log('🌱 Seeding business activities...');

    // Check if activities already exist
    const existing = await db('business_activities').count('* as count').first();
    if (existing.count > 0) {
      console.log('ℹ️ Business activities already seeded');
      return true;
    }

    // Business plan activities avec données complètes du ranking
    const activities = [
      {
        name: 'API Audits',
        description: '30-min emergency audit for CTOs (€297-€500)',
        probability_score: 9.0,
        target_revenue_min: 1000,
        target_revenue_max: 1500,
        current_revenue: 0,
        target_volume: 3,
        current_volume: 0,
        unit_type: 'audits',
        unit_price_min: 297,
        unit_price_max: 500,
        status: 'active',
        priority: 1,
        kpis: JSON.stringify({
          booking_rate: 0,
          delivery_rate: 0,
          satisfaction_score: 0,
          upsell_rate: 0
        })
      },
      {
        name: 'Emergency Consulting',
        description: 'API crisis fixed in 24-48h (€200/h)',
        probability_score: 7.5,
        target_revenue_min: 1000,
        target_revenue_max: 2000,
        current_revenue: 0,
        target_volume: 10,
        current_volume: 0,
        unit_type: 'hours',
        unit_price_min: 200,
        unit_price_max: 200,
        status: 'active',
        priority: 2,
        kpis: JSON.stringify({
          response_time: 0,
          resolution_rate: 0,
          client_satisfaction: 0,
          repeat_rate: 0
        })
      },
      {
        name: 'AFFILIATION ECOSYSTEM',
        description: '87 domaines content automation + cross-selling affiliation',
        probability_score: 8.5,
        target_revenue_min: 20000,
        target_revenue_max: 20000,
        current_revenue: 0,
        target_volume: 585,
        current_volume: 0,
        unit_type: 'articles/week',
        unit_price_min: 34,
        unit_price_max: 34,
        status: 'active',
        priority: 3,
        kpis: JSON.stringify({
          domains_active: 0,
          articles_published: 0,
          affiliate_clicks: 0,
          conversion_rate: 0,
          cross_selling_rate: 0,
          ecosystem_synergy_score: 0
        })
      },
      {
        name: 'Technical Writing',
        description: 'Documentation API & articles techniques',
        probability_score: 6.5,
        target_revenue_min: 800,
        target_revenue_max: 1400,
        current_revenue: 0,
        target_volume: 5,
        current_volume: 0,
        unit_type: 'articles',
        unit_price_min: 200,
        unit_price_max: 300,
        status: 'active',
        priority: 4,
        kpis: JSON.stringify({
          words_per_hour: 0,
          client_approval_rate: 0,
          revision_rounds: 0,
          seo_performance: 0
        })
      },
      {
        name: 'API Troubleshooting',
        description: 'Support urgence développeurs (€100-300/h)',
        probability_score: 6.0,
        target_revenue_min: 500,
        target_revenue_max: 1200,
        current_revenue: 0,
        target_volume: 8,
        current_volume: 0,
        unit_type: 'sessions',
        unit_price_min: 100,
        unit_price_max: 300,
        status: 'active',
        priority: 5,
        kpis: JSON.stringify({
          first_call_resolution: 0,
          average_session_time: 0,
          customer_rating: 0,
          escalation_rate: 0
        })
      },
      {
        name: 'Done-for-You Services',
        description: 'Architecture API complète (€2,000)',
        probability_score: 5.5,
        target_revenue_min: 0,
        target_revenue_max: 2000,
        current_revenue: 0,
        target_volume: 1,
        current_volume: 0,
        unit_type: 'projects',
        unit_price_min: 2000,
        unit_price_max: 2000,
        status: 'active',
        priority: 6,
        kpis: JSON.stringify({
          project_completion_rate: 0,
          on_time_delivery: 0,
          scope_creep_incidents: 0,
          client_satisfaction: 0
        })
      },
      {
        name: 'Founding Members',
        description: 'Programme fondateur OnlyOneAPI (€997)',
        probability_score: 4.0,
        target_revenue_min: 1000,
        target_revenue_max: 3000,
        current_revenue: 0,
        target_volume: 3,
        current_volume: 0,
        unit_type: 'members',
        unit_price_min: 997,
        unit_price_max: 997,
        status: 'active',
        priority: 7,
        kpis: JSON.stringify({
          conversion_rate: 0,
          churn_rate: 0,
          lifetime_value: 0,
          referral_rate: 0
        })
      },
    ];

    // Insert activities
    for (const activity of activities) {
      await db('business_activities').insert(activity);
      console.log(`✅ Added: ${activity.name} (Priority ${activity.priority})`);
    }

    console.log('🎉 Business activities seeded successfully');
    console.log(`📊 Total activities: ${activities.length}`);
    console.log(`💰 Total target range: €${activities.reduce((sum, a) => sum + a.target_revenue_min, 0).toLocaleString()} - €${activities.reduce((sum, a) => sum + a.target_revenue_max, 0).toLocaleString()}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to seed business activities:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedBusinessActivities()
    .then(() => {
      console.log('🎊 Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedBusinessActivities;