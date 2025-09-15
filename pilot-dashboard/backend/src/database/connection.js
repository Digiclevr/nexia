const knex = require('knex');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbPath = path.join(__dirname, '../../database');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(dbPath, 'pilot.db')
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  },
  migrations: {
    directory: path.join(__dirname, 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'seeds')
  }
});

// Test connection
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ SQLite database connected');
  })
  .catch((err) => {
    console.error('❌ SQLite connection failed:', err);
  });

module.exports = db;