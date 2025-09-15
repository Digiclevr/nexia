const db = require('./connection');

async function initializeDatabase() {
  try {
    console.log('🗄️ Initializing database tables...');

    // Agents table
    await db.schema.createTable('agents', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('type').notNullable(); // 'outreach', 'content', 'sales', 'metrics', 'delivery'
      table.string('status').defaultTo('inactive'); // 'active', 'inactive', 'error', 'paused'
      table.json('config'); // Agent configuration
      table.json('stats'); // Current statistics
      table.timestamp('last_run');
      table.timestamps(true, true);
    });

    // Daily metrics table
    await db.schema.createTable('daily_metrics', (table) => {
      table.increments('id').primary();
      table.date('date').notNullable().unique();
      table.decimal('target_revenue', 10, 2).defaultTo(3571); // €25,000 / 7 days
      table.decimal('current_revenue', 10, 2).defaultTo(0);
      table.integer('target_leads').defaultTo(60);
      table.integer('current_leads').defaultTo(0);
      table.integer('bookings_confirmed').defaultTo(0);
      table.decimal('conversion_rate', 5, 2).defaultTo(0);
      table.timestamps(true, true);
    });

    // Activity log table
    await db.schema.createTable('activity_log', (table) => {
      table.increments('id').primary();
      table.string('agent_name');
      table.string('action').notNullable();
      table.string('status').notNullable(); // 'success', 'warning', 'error'
      table.text('message').notNullable();
      table.json('metadata');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });

    // Validation queue table
    await db.schema.createTable('validation_queue', (table) => {
      table.increments('id').primary();
      table.string('agent_name').notNullable();
      table.string('content_type').notNullable(); // 'linkedin_post', 'twitter_thread', 'linkedin_dm'
      table.text('content').notNullable();
      table.json('metadata'); // Target audience, timing, etc.
      table.string('status').defaultTo('pending'); // 'pending', 'approved', 'rejected', 'published'
      table.text('feedback');
      table.timestamp('scheduled_for');
      table.timestamp('published_at');
      table.timestamps(true, true);
    });

    // Revenue events table
    await db.schema.createTable('revenue_events', (table) => {
      table.increments('id').primary();
      table.string('source').notNullable(); // 'audit', 'consulting', 'founding_member'
      table.decimal('amount', 10, 2).notNullable();
      table.string('client_name');
      table.string('status').defaultTo('confirmed'); // 'pending', 'confirmed', 'cancelled'
      table.text('notes');
      table.timestamps(true, true);
    });

    // Leads table
    await db.schema.createTable('leads', (table) => {
      table.increments('id').primary();
      table.string('source').notNullable(); // 'linkedin', 'upwork', 'referral'
      table.string('name');
      table.string('email');
      table.string('company');
      table.string('title');
      table.string('status').defaultTo('new'); // 'new', 'contacted', 'qualified', 'converted'
      table.integer('score').defaultTo(0); // 0-100 lead scoring
      table.json('metadata');
      table.timestamps(true, true);
    });

    // Business activities table
    await db.schema.createTable('business_activities', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('description');
      table.decimal('probability_score', 3, 1).notNullable(); // Ex: 9.0, 7.5, 6.5
      table.decimal('target_revenue_min', 10, 2).defaultTo(0);
      table.decimal('target_revenue_max', 10, 2).defaultTo(0);
      table.decimal('current_revenue', 10, 2).defaultTo(0);
      table.integer('target_volume').defaultTo(0); // Nombre d'unités ciblées
      table.integer('current_volume').defaultTo(0); // Nombre d'unités réalisées
      table.string('unit_type'); // 'audits', 'hours', 'members', 'articles', etc.
      table.decimal('unit_price_min', 10, 2).defaultTo(0);
      table.decimal('unit_price_max', 10, 2).defaultTo(0);
      table.string('status').defaultTo('active'); // 'active', 'paused', 'completed'
      table.integer('priority').defaultTo(1); // 1-7 basé sur probabilité × CA × vitesse
      table.json('kpis'); // KPIs spécifiques par activité
      table.timestamps(true, true);
    });

    // Session status table for cross-session coordination
    await db.schema.createTable('session_status', (table) => {
      table.increments('id').primary();
      table.string('session_name').notNullable();
      table.integer('session_id').notNullable().unique();
      table.string('status').notNullable(); // 'active', 'waiting_action', 'blocked', 'completed'
      table.integer('day').defaultTo(1); // Current day of challenge
      table.json('progress'); // Day completion, targets, etc.
      table.json('metrics'); // Revenue, volume, KPIs
      table.json('alerts'); // Alerts for supervision
      table.json('actions_required'); // Actions waiting for supervision
      table.text('message'); // Status message
      table.timestamp('last_update').defaultTo(db.fn.now());
      table.timestamps(true, true);
    });

    console.log('✅ Database tables created successfully');
    return true;
  } catch (error) {
    if (error.code === 'SQLITE_ERROR' && error.message.includes('already exists')) {
      console.log('ℹ️ Some database tables already exist, checking for missing ones...');
      
      // Check if business_activities table exists
      try {
        await db.schema.hasTable('business_activities').then(async (exists) => {
          if (!exists) {
            console.log('ℹ️ Creating missing business_activities table...');
            await db.schema.createTable('business_activities', (table) => {
              table.increments('id').primary();
              table.string('name').notNullable();
              table.string('description');
              table.decimal('probability_score', 3, 1).notNullable();
              table.decimal('target_revenue_min', 10, 2).defaultTo(0);
              table.decimal('target_revenue_max', 10, 2).defaultTo(0);
              table.decimal('current_revenue', 10, 2).defaultTo(0);
              table.integer('target_volume').defaultTo(0);
              table.integer('current_volume').defaultTo(0);
              table.string('unit_type');
              table.decimal('unit_price_min', 10, 2).defaultTo(0);
              table.decimal('unit_price_max', 10, 2).defaultTo(0);
              table.string('status').defaultTo('active');
              table.integer('priority').defaultTo(1);
              table.json('kpis');
              table.timestamps(true, true);
            });
            console.log('✅ business_activities table created');
          }
        });
      } catch (checkError) {
        console.error('Error checking/creating business_activities table:', checkError);
      }

      // Check if session_status table exists
      try {
        await db.schema.hasTable('session_status').then(async (exists) => {
          if (!exists) {
            console.log('ℹ️ Creating missing session_status table...');
            await db.schema.createTable('session_status', (table) => {
              table.increments('id').primary();
              table.string('session_name').notNullable();
              table.integer('session_id').notNullable().unique();
              table.string('status').notNullable(); // 'active', 'waiting_action', 'blocked', 'completed'
              table.integer('day').defaultTo(1); // Current day of challenge
              table.json('progress'); // Day completion, targets, etc.
              table.json('metrics'); // Revenue, volume, KPIs
              table.json('alerts'); // Alerts for supervision
              table.json('actions_required'); // Actions waiting for supervision
              table.text('message'); // Status message
              table.timestamp('last_update').defaultTo(db.fn.now());
              table.timestamps(true, true);
            });
            console.log('✅ session_status table created');
          }
        });
      } catch (checkError) {
        console.error('Error checking/creating session_status table:', checkError);
      }
      
      return true;
    }
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database ready for use');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;