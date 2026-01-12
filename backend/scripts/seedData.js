const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Temporary seed endpoint - REMOVE AFTER USE
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Your Cloudinary URLs
    const cloudinaryImages = [
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172673/images-1767780162193-372417661_engz9i.png'
    ];
    
    // Automatically generate product data
    const sampleProducts = cloudinaryImages.map((url, index) => ({
      title: `Sample Product ${index + 1}`,
      description: `This is a sample description for product ${index + 1}.`,
      price: (index + 1) * 50,
      listing_type: 'fixed_price',
      image_paths: [url],
      seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
      status: 'approved'
    }));
    
    // Check if already seeded
    const countResult = await db.query('SELECT COUNT(*) as count FROM listings');
    const count = parseInt(countResult.rows[0].count);
    
    if (count > 0) {
      console.log(`✅ Database already has ${count} listings. Skipping seed.`);
      return res.json({ 
        message: 'Database already seeded', 
        count: count 
      });
    }
    
    // Insert products
    let inserted = 0;
    const errors = [];
    
    for (const product of sampleProducts) {
      try {
        await db.query(`
          INSERT INTO listings (
            id, seller_id, title, description, price, starting_bid,
            listing_type, auction_end_time, image_paths, status, created_at
          ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
        console.log(`✅ Created listing: ${product.title}`);
      } catch (err) {
        console.error(`❌ Error inserting ${product.title}:`, err);
        errors.push({ product: product.title, error: err.message });
      }
    }
    
    console.log(`\n🎉 Seeding complete! Added ${inserted} products.`);
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      inserted: inserted,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
