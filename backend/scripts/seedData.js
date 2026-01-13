const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Temporary seed endpoint - REMOVE AFTER USE
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Your Cloudinary URLs
    const cloudinaryImages = [
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768286524/images-1767780162195-900590149_k7yh5x.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg',
      'https://res.cloudinary.com/dylxle0dq/image/upload/v1768311131/images-1767458331658-405423621_zm3jd9.png'
    ];
    
    // Create varied product listings
    const sampleProducts = [
      {
        title: 'Vintage Leather Jacket',
        description: 'Classic brown leather jacket in excellent condition. Genuine leather with brass zippers. Size: Medium',
        price: 150.00,
        listing_type: 'fixed_price',
        image_paths: [cloudinaryImages[0]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Designer Sunglasses',
        description: 'Polarized designer sunglasses with UV protection. Comes with original case and cleaning cloth.',
        price: 89.99,
        listing_type: 'fixed_price',
        image_paths: [cloudinaryImages[1]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Rare Collectible Watch',
        description: 'Limited edition timepiece from 2020. Automatic movement, sapphire crystal. Perfect condition with box and papers.',
        starting_bid: 200.00,
        listing_type: 'auction',
        auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        image_paths: [cloudinaryImages[2]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Handcrafted Leather Wallet',
        description: 'Premium full-grain leather wallet with multiple card slots and bill compartment. Handmade with attention to detail.',
        price: 45.00,
        listing_type: 'fixed_price',
        image_paths: [cloudinaryImages[0]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Retro Gaming Console',
        description: 'Classic gaming console from the 90s. Fully functional with original controllers and cables. Great for collectors!',
        starting_bid: 75.00,
        listing_type: 'auction',
        auction_end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        image_paths: [cloudinaryImages[1]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Professional Camera Lens',
        description: '50mm f/1.8 prime lens. Sharp images with beautiful bokeh. Compatible with Canon EF mount. Includes lens cap and hood.',
        price: 275.00,
        listing_type: 'fixed_price',
        image_paths: [cloudinaryImages[2]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Vintage Vinyl Record Player',
        description: 'Restored vintage turntable with new needle. Belt-drive system with adjustable speed. Sounds amazing!',
        starting_bid: 120.00,
        listing_type: 'auction',
        auction_end_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        image_paths: [cloudinaryImages[0]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Smart Fitness Watch',
        description: 'Latest model with heart rate monitor, GPS, and water resistance. Tracks all your activities. Like new condition.',
        price: 199.99,
        listing_type: 'fixed_price',
        image_paths: [cloudinaryImages[1]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Antique Desk Lamp',
        description: 'Beautiful brass desk lamp from the 1950s. Fully functional with new wiring. Perfect for vintage decor enthusiasts.',
        price: 65.00,
        listing_type: 'fixed_price',
        image_paths: [cloudinaryImages[2]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Limited Edition Sneakers',
        description: 'Rare colorway from 2022 collaboration. Size 10. Never worn, includes original box and tags. Deadstock condition.',
        starting_bid: 180.00,
        listing_type: 'auction',
        auction_end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        image_paths: [cloudinaryImages[0]],
        seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      }
    ];
    
    // Check if already seeded
    const countResult = await db.query('SELECT COUNT(*) as count FROM listings');
    const count = parseInt(countResult.rows[0].count);
    
    if (count >= 10) {
      console.log(`✅ Database already has ${count} listings. Skipping seed.`);
      return res.json({ 
        message: 'Database already seeded', 
        count: count 
      });
    }
    
    // Delete existing listings to reseed
    await db.query('DELETE FROM listings');
    console.log('🗑️ Cleared existing listings');
    
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
          product.starting_bid || null,
          product.listing_type,
          product.auction_end_time || null,
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
