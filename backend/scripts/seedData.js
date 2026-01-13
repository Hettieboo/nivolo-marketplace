const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.post('/create-user', async (req, res) => {
  try {
    const userId = 'b694dd70-620b-4c25-a4a6-b32874270dfc';
    const email = 'seller@nivolo.com';
    const password_hash = '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890';
    
    const checkUser = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    
    if (checkUser.rows.length > 0) {
      return res.json({ message: 'User already exists', userId });
    }
    
    await db.query(
      'INSERT INTO users (id, email, password_hash, role, is_admin) VALUES ($1, $2, $3, $4, $5)',
      [userId, email, password_hash, 'seller', false]
    );
    
    res.json({ message: 'Test user created successfully', userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clear-listings', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM listings');
    res.json({ message: 'All listings deleted', count: result.rowCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    const cloudinaryImages = [
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768286524/images-1767780162195-900590149_k7yh5x.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768311131/images-1767458331658-405423621_zm3jd9.png'
    ];
    
    const sampleProducts = cloudinaryImages.map((url, index) => ({
      title: `Sample Product ${index + 1}`,
      description: `This is a sample description for product ${index + 1}.`,
      price: (index + 1) * 50,
      listing_type: 'fixed_price',
      image_paths: [url],
      seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
      status: 'approved'
    }));
    
    console.log('📦 Sample products to insert:', sampleProducts.length);
    
    const countResult = await db.query('SELECT COUNT(*) as count FROM listings');
    const count = parseInt(countResult.rows[0].count);
    
    console.log(`📊 Current listing count: ${count}`);
    
    if (count > 0) {
      console.log(`✅ Database already has ${count} listings. Skipping seed.`);
      return res.json({ 
        message: 'Database already seeded', 
        count: count 
      });
    }
    
    let inserted = 0;
    const errors = [];
    
    for (const product of sampleProducts) {
      try {
        console.log(`🔄 Attempting to insert: ${product.title}`);
        
        const result = await db.query(`
          INSERT INTO listings (
            id, seller_id, title, description, price, starting_bid,
            listing_type, auction_end_time, image_paths, status, created_at
          ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id
        `, [
          product.seller_id,
          product.title,
          product.description,
          product.price || null,
          null,
          product.listing_type,
          null,
          JSON.stringify(product.image_paths),
          product.status,
          new Date().toISOString()
        ]);
        
        inserted++;
        console.log(`✅ Created listing: ${product.title} (ID: ${result.rows[0].id})`);
      } catch (err) {
        console.error(`❌ Error inserting ${product.title}:`, err.message);
        console.error('Full error:', err);
        errors.push({ product: product.title, error: err.message });
      }
    }
    
    console.log(`\n🎉 Seeding complete! Added ${inserted} products.`);
    
    // Verify the count
    const finalCount = await db.query('SELECT COUNT(*) as count FROM listings');
    console.log(`📊 Final listing count: ${finalCount.rows[0].count}`);
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      inserted: inserted,
      totalListings: parseInt(finalCount.rows[0].count),
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

module.exports = router;
