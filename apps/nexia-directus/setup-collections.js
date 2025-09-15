const { createDirectus, authentication, rest, createCollection, createField } = require('@directus/sdk');

const client = createDirectus('http://localhost:7012')
  .with(authentication())
  .with(rest());

async function setupNexiaCollections() {
  try {
    console.log('🔐 Authenticating to NEXIA Directus...');
    await client.login('admin@nexia.com', 'NexiaAdmin2025!');
    console.log('✅ Authentication successful');

    // Create Ecosystems collection
    console.log('📦 Creating Ecosystems collection...');
    await client.request(createCollection({
      collection: 'ecosystems',
      meta: {
        collection: 'ecosystems',
        icon: 'cloud',
        note: 'NEXIA Supervised Ecosystems',
        display_template: '{{name}} ({{status}})',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'en-US',
            translation: 'Ecosystems'
          },
          {
            language: 'fr-FR', 
            translation: 'Écosystèmes'
          }
        ],
        archive_field: null,
        archive_value: null,
        unarchive_value: null,
        sort_field: 'sort',
        accountability: 'all',
        color: '#3B82F6',
        item_duplication_fields: null,
        group: null,
        versioning: false
      },
      schema: {
        name: 'ecosystems'
      }
    }));

    // Add fields to Ecosystems
    const ecosystemFields = [
      {
        collection: 'ecosystems',
        field: 'id',
        type: 'integer',
        meta: {
          hidden: true,
          interface: 'input',
          readonly: true
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: true
        }
      },
      {
        collection: 'ecosystems',
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          readonly: false,
          hidden: false,
          sort: 1,
          width: 'full',
          translations: [
            { language: 'en-US', translation: 'Name' },
            { language: 'fr-FR', translation: 'Nom' }
          ],
          note: 'Ecosystem name (e.g., BlueOcean, OnlyOneAPI)'
        },
        schema: {
          name: 'name',
          table: 'ecosystems',
          data_type: 'varchar',
          max_length: 255,
          is_nullable: false,
          is_unique: true
        }
      },
      {
        collection: 'ecosystems',
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'half',
          options: {
            choices: [
              { text: 'Online', value: 'online' },
              { text: 'Offline', value: 'offline' },
              { text: 'Warning', value: 'warning' }
            ]
          },
          display_options: {
            choices: [
              { text: 'Online', value: 'online', foreground: '#FFFFFF', background: '#10B981' },
              { text: 'Offline', value: 'offline', foreground: '#FFFFFF', background: '#EF4444' },
              { text: 'Warning', value: 'warning', foreground: '#000000', background: '#F59E0B' }
            ]
          }
        },
        schema: {
          default_value: 'offline',
          is_nullable: false
        }
      },
      {
        collection: 'ecosystems',
        field: 'url',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'formatted-value',
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'full',
          display_options: {
            format: true
          },
          note: 'Main endpoint URL'
        },
        schema: {
          data_type: 'text'
        }
      },
      {
        collection: 'ecosystems',
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          display: 'formatted-value',
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'full'
        },
        schema: {
          data_type: 'text'
        }
      },
      {
        collection: 'ecosystems',
        field: 'services_count',
        type: 'integer',
        meta: {
          interface: 'input',
          display: 'raw',
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'half',
          note: 'Number of services in ecosystem'
        },
        schema: {
          default_value: 0,
          is_nullable: false
        }
      },
      {
        collection: 'ecosystems',
        field: 'last_check',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          display: 'datetime',
          readonly: false,
          hidden: false,
          sort: 6,
          width: 'half'
        },
        schema: {
          default_value: 'now()'
        }
      }
    ];

    for (const field of ecosystemFields) {
      console.log(`📝 Creating field: ${field.field}`);
      await client.request(createField(field.collection, field));
    }

    // Create Voice Commands collection
    console.log('🎙️ Creating Voice Commands collection...');
    await client.request(createCollection({
      collection: 'voice_commands',
      meta: {
        collection: 'voice_commands',
        icon: 'record_voice_over',
        note: 'NEXIA Voice Commands Configuration',
        display_template: '{{command}} → {{action}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'en-US',
            translation: 'Voice Commands'
          },
          {
            language: 'fr-FR',
            translation: 'Commandes Vocales'
          }
        ],
        color: '#8B5CF6'
      },
      schema: {
        name: 'voice_commands'
      }
    }));

    // Add fields to Voice Commands
    const voiceCommandFields = [
      {
        collection: 'voice_commands',
        field: 'id',
        type: 'integer',
        meta: { hidden: true, interface: 'input', readonly: true },
        schema: { is_primary_key: true, has_auto_increment: true }
      },
      {
        collection: 'voice_commands',
        field: 'command',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          display: 'raw',
          readonly: false,
          hidden: false,
          sort: 1,
          width: 'full',
          note: 'Siri phrase (e.g., "Nexia status global")'
        },
        schema: { is_nullable: false }
      },
      {
        collection: 'voice_commands',
        field: 'action',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'raw',
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'half',
          options: {
            choices: [
              { text: 'Status Check', value: 'status' },
              { text: 'Health Check', value: 'health' },
              { text: 'Deploy', value: 'deploy' },
              { text: 'Restart', value: 'restart' },
              { text: 'Scale', value: 'scale' }
            ]
          }
        },
        schema: { is_nullable: false }
      },
      {
        collection: 'voice_commands',
        field: 'endpoint',
        type: 'text',
        meta: {
          interface: 'input',
          display: 'raw',
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'full',
          note: 'API endpoint URL'
        },
        schema: { is_nullable: false }
      },
      {
        collection: 'voice_commands',
        field: 'response_template',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          display: 'raw',
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'full',
          note: 'Siri response template'
        }
      },
      {
        collection: 'voice_commands',
        field: 'active',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          display: 'boolean',
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'half'
        },
        schema: { default_value: true, is_nullable: false }
      }
    ];

    for (const field of voiceCommandFields) {
      console.log(`📝 Creating field: ${field.field}`);
      await client.request(createField(field.collection, field));
    }

    console.log('🎉 NEXIA Collections setup completed successfully!');
    console.log('');
    console.log('📱 Next steps:');
    console.log('1. Visit http://localhost:7012/admin');
    console.log('2. Login with: admin@nexia.com / NexiaAdmin2025!');
    console.log('3. Configure your ecosystems and voice commands');

  } catch (error) {
    console.error('❌ Error setting up collections:', error.message);
    if (error.extensions) {
      console.error('Details:', error.extensions);
    }
  }
}

// Install required dependencies if not present
async function installDependencies() {
  const { execSync } = require('child_process');
  
  try {
    require('@directus/sdk');
    console.log('✅ Dependencies already installed');
  } catch (e) {
    console.log('📦 Installing Directus SDK...');
    execSync('npm install @directus/sdk', { stdio: 'inherit' });
  }
}

async function main() {
  console.log('🧠 NEXIA Directus Collections Setup');
  console.log('=====================================');
  
  await installDependencies();
  await setupNexiaCollections();
}

main();