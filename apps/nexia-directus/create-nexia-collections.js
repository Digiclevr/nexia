const axios = require('axios');

async function createNexiaCollections() {
  try {
    console.log('🏗️ Creating NEXIA OGER Collections...');
    
    // 1. Authenticate
    const authResponse = await axios.post('http://localhost:7012/auth/login', {
      email: 'admin@nexia.com',
      password: 'NexiaAdmin2025!'
    });
    
    const token = authResponse.data.data.access_token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log('✅ Authenticated with Directus');
    
    // 2. Create claude_artifacts collection
    const artifactsCollection = {
      collection: 'claude_artifacts',
      meta: {
        collection: 'claude_artifacts',
        icon: 'description',
        note: 'Collection for storing Claude-generated artifacts and action plans',
        display_template: '{{title}}',
        hidden: false,
        singleton: false,
        translations: null,
        archive_field: null,
        archive_app_filter: true,
        archive_value: null,
        unarchive_value: null,
        sort_field: 'created_at',
        accountability: 'all',
        color: '#6644FF',
        item_duplication_fields: null,
        sort: 1,
        group: null,
        collapse: 'open'
      },
      schema: {
        name: 'claude_artifacts'
      }
    };
    
    await axios.post('http://localhost:7012/collections', artifactsCollection, { headers });
    console.log('✅ Created collection: claude_artifacts');
    
    // 3. Create fields for claude_artifacts
    const artifactFields = [
      {
        collection: 'claude_artifacts',
        field: 'id',
        type: 'uuid',
        meta: {
          field: 'id',
          special: ['uuid'],
          interface: 'input',
          options: null,
          display: null,
          display_options: null,
          readonly: true,
          hidden: true,
          sort: 1,
          width: 'full',
          translations: null,
          note: 'Primary key',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'id',
          table: 'claude_artifacts',
          data_type: 'char',
          default_value: null,
          max_length: 36,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: true,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'title',
        type: 'string',
        meta: {
          field: 'title',
          special: null,
          interface: 'input',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'full',
          translations: null,
          note: 'Artifact title',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'type',
        type: 'string',
        meta: {
          field: 'type',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Analysis', value: 'analysis' },
              { text: 'Action Plan', value: 'action_plan' },
              { text: 'Specification', value: 'specification' },
              { text: 'Documentation', value: 'documentation' },
              { text: 'Executive Report', value: 'executive_report' }
            ]
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'half',
          translations: null,
          note: 'Type of artifact',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'content',
        type: 'text',
        meta: {
          field: 'content',
          special: null,
          interface: 'input-rich-text-md',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'full',
          translations: null,
          note: 'Markdown content of the artifact',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'status',
        type: 'string',
        meta: {
          field: 'status',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Draft', value: 'draft' },
              { text: 'Approved', value: 'approved' },
              { text: 'In Progress', value: 'in_progress' },
              { text: 'Completed', value: 'completed' },
              { text: 'Archived', value: 'archived' }
            ]
          },
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#6B7280' },
              { text: 'Approved', value: 'approved', foreground: '#FFFFFF', background: '#059669' },
              { text: 'In Progress', value: 'in_progress', foreground: '#FFFFFF', background: '#DC2626' },
              { text: 'Completed', value: 'completed', foreground: '#FFFFFF', background: '#059669' },
              { text: 'Archived', value: 'archived', foreground: '#FFFFFF', background: '#374151' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'half',
          translations: null,
          note: 'Current status',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'priority',
        type: 'string',
        meta: {
          field: 'priority',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Urgent', value: 'urgent' },
              { text: 'High', value: 'high' },
              { text: 'Medium', value: 'medium' },
              { text: 'Low', value: 'low' }
            ]
          },
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Urgent', value: 'urgent', foreground: '#FFFFFF', background: '#DC2626' },
              { text: 'High', value: 'high', foreground: '#FFFFFF', background: '#EA580C' },
              { text: 'Medium', value: 'medium', foreground: '#FFFFFF', background: '#D97706' },
              { text: 'Low', value: 'low', foreground: '#FFFFFF', background: '#65A30D' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 6,
          width: 'half',
          translations: null,
          note: 'Priority level',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'created_at',
        type: 'timestamp',
        meta: {
          field: 'created_at',
          special: ['date-created'],
          interface: 'datetime',
          options: null,
          display: 'datetime',
          display_options: { relative: true },
          readonly: true,
          hidden: false,
          sort: 7,
          width: 'half',
          translations: null,
          note: 'Creation timestamp',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        }
      },
      {
        collection: 'claude_artifacts',
        field: 'estimated_duration',
        type: 'integer',
        meta: {
          field: 'estimated_duration',
          special: null,
          interface: 'input',
          options: { suffix: ' minutes' },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 8,
          width: 'half',
          translations: null,
          note: 'Estimated duration in minutes',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        }
      }
    ];
    
    for (const field of artifactFields) {
      try {
        await axios.post('http://localhost:7012/fields', field, { headers });
        console.log(`✅ Created field: ${field.field}`);
      } catch (error) {
        console.log(`ℹ️ Field ${field.field} might already exist`);
      }
    }
    
    console.log('');
    console.log('🎉 NEXIA OGER Collections created successfully!');
    console.log('🌐 Admin interface: http://localhost:7012/admin');
    console.log('📊 Collection: claude_artifacts ready for OGER implementation');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error.response?.data || error.message);
  }
}

createNexiaCollections();