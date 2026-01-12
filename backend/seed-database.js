const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Temporary seed endpoint - REMOVE AFTER USE
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');

    // Database path
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    const db = new sqlite3.Database(dbPath);

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
    db.get('SELECT COUNT(*) as count FROM listings', (err, row) => {
      if (err) {
        console.error('❌ Error checking database:', err);
        db.close();
        return res.status(500).json({ error: err.message });
      }

      if (row.count > 0) {
        console.log(`✅ Database already has ${row.count} listings. Skipping seed.`);
        db.close();
        return res.json({ 
          message: 'Database already seeded', 
          count: row.count 
        });
      }

      // Insert products
      const stmt = db.prepare(`
        INSERT INTO listings (
          user_id, title, description, price, starting_bid,
          listing_type, auction_end_time, image_paths, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let inserted = 0;
      const errors = [];

      sampleProducts.forEach(product => {
        stmt.run(
          product.seller_id,
          product.title,
          product.description,
          product.price || null,
          null,
          product.listing_type,
          null,
          JSON.stringify(product.image_paths),
          product.status,
          new Date().toISOString(),
          (err) => {
            if (err) {
              console.error(`❌ Error inserting ${product.title}:`, err);
              errors.push({ product: product.title, error: err.message });
            } else {
              inserted++;
              console.log(`✅ Created listing: ${product.title}`);
            }

            if (inserted + errors.length === sampleProducts.length) {
              stmt.finalize();
              console.log(`\n🎉 Seeding complete! Added ${inserted} products.`);
              db.close();
              
              res.json({
                success: true,
                message: 'Database seeded successfully',
                inserted: inserted,
                errors: errors.length > 0 ? errors : undefined
              });
            }
          }
        );
      });
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
