const db = require('./connection');

async function addPublishedColumn() {
  try {
    console.log('Adding published_at column to validation_queue table...');
    
    // Check if column already exists
    const hasColumn = await db.schema.hasColumn('validation_queue', 'published_at');
    
    if (!hasColumn) {
      await db.schema.alterTable('validation_queue', (table) => {
        table.timestamp('published_at');
      });
      console.log('✅ published_at column added successfully');
    } else {
      console.log('ℹ️  published_at column already exists');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to add published_at column:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addPublishedColumn()
    .then(() => {
      console.log('🎉 Column addition complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Column addition failed:', error);
      process.exit(1);
    });
}

module.exports = addPublishedColumn;