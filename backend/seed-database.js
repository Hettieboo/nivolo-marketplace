const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Temporary seed endpoint - REMOVE AFTER USE
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Your NEW Cloudinary URLs - 4 new products only
    const cloudinaryImages = [
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172673/images-1767780162193-372417661_engz9i.png',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768343952/71rOW8EUKSL._AC_SY695__ove8eu.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768343951/ornate-golden-frame-mirror_dkd8lf.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768343952/suitcase-8510536_1280_jkwjmv.jpg'
    ];
    
    // Automatically generate product data
    const sampleProducts = cloudinaryImages.map((url, index) => ({
      title: `Sample Product ${index + 2}`, // Start at 2 since Product 1 exists
      description: `This is a sample description for product ${index + 2}.`,
      price: (index + 2) * 50, // $100, $150, $200, $250
      listing_type: 'fixed_price',
      image_paths: [url],
      seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
      status: 'approved'
    }));
    
    // Insert products
    let inserted = 0;
    const errors = [];
    
    for (const product of sampleProducts) {
      try {
        await db.query(`
          INSERT INTO listings (
            id, seller_id, title, description, price, starting_bid,
            listing_type, auction_end_time, image_paths, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          require('uuid').v4(), // Generate ID
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
```

## This will create:
- **Sample Product 2** - $100 (image 2)
- **Sample Product 3** - $150 (image 3 - the product photo)
- **Sample Product 4** - $200 (image 4 - golden frame mirror)
- **Sample Product 5** - $250 (image 5 - suitcase)

So you'll end up with **5 total products** in your marketplace (the existing Product 1 + these 4 new ones).

## Next steps - same as before:

1. **Update the seed file on GitHub** with this code
2. **Commit the changes**
3. **Trigger the seed endpoint** with a POST request to:
```
   https://diligent-encouragement-production.up.railway.app/api/seed
