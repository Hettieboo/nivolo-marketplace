const { initializeDatabase } = require('../config/database');
const { seedDatabase } = require('./seedData');

async function startup() {
  try {
    console.log('🚀 Starting application...');
    
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection established');
    
    // Only seed on first deployment or when explicitly enabled
    if (process.env.RUN_SEED === 'true') {
      console.log('🌱 Seeding database...');
      await seedDatabase();
      console.log('✅ Database seeding complete');
    } else {
      console.log('⏭️  Skipping database seed (RUN_SEED not set to true)');
    }
    
    // Start the server
    require('../../server');
    
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

startup();
