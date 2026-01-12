const { db, initializeDatabase } = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  console.log('Seeding database with sample data...');

  try {
    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('Nivolo@123', 10);
    await db.query(`
      INSERT INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO NOTHING
    `, [adminId, 'admin@nivolo.com', adminPassword]);

    // Create seller user
    const sellerId = uuidv4();
    const sellerPassword = await bcrypt.hash('Nivolo@123', 10);
    await db.query(`
      INSERT INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, 'user', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO NOTHING
    `, [sellerId, 'seller@example.com', sellerPassword]);

    // Create test user
    const testId = uuidv4();
    const testPassword = await bcrypt.hash('Nivolo@123', 10);
    await db.query(`
      INSERT INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, 'user', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO NOTHING
    `, [testId, 'test@gmail.com', testPassword]);

    // Sample listings array (only showing a couple for brevity)
    const sampleListings = [
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Vintage Leather Jacket',
        description: 'Authentic vintage leather jacket from the 1980s.',
        listing_type: 'fixed_price',
        price: 299.99,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'MacBook Pro 2019 - 16 inch',
        description: 'MacBook Pro 16-inch, 2019 model.',
        listing_type: 'auction',
        starting_bid: 800.00,
        auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'])
      }
      // ...add the rest similarly
    ];

    // Insert listings
    for (const listing of sampleListings) {
      await db.query(`
        INSERT INTO listings (
          id, seller_id, title, description, listing_type,
          price, starting_bid, auction_end_time, status,
          image_paths, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO NOTHING
      `, [
        listing.id, listing.seller_id, listing.title, listing.description,
        listing.listing_type, listing.price || null, listing.starting_bid || null,
        listing.auction_end_time || null, listing.status, listing.image_paths
      ]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@nivolo.com / Nivolo@123');
    console.log('📧 Seller login: seller@example.com / Nivolo@123');
    console.log('📧 Test login: test@gmail.com / Nivolo@123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase().then(() => seedDatabase());
}

module.exports = { seedDatabase };
