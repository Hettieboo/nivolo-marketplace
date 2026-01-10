const { db, initializeDatabase } = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  console.log('Seeding database with sample data...');
  
  try {
    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('Nivolo@123', 10);
    
    db.run(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES (?, ?, ?, 'admin', 1, datetime('now'), datetime('now'))
    `, [adminId, 'admin@nivolo.com', adminPassword]);
    
    // Create seller user
    const sellerId = uuidv4();
    const sellerPassword = await bcrypt.hash('Nivolo@123', 10);
    
    db.run(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES (?, ?, ?, 'user', 0, datetime('now'), datetime('now'))
    `, [sellerId, 'seller@example.com', sellerPassword]);
    
    // Create test user
    const testId = uuidv4();
    const testPassword = await bcrypt.hash('Nivolo@123', 10);
    
    db.run(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES (?, ?, ?, 'user', 0, datetime('now'), datetime('now'))
    `, [testId, 'test@gmail.com', testPassword]);
    
    // Sample listings data with high-quality placeholder images
    const sampleListings = [
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Vintage Leather Jacket',
        description: 'Authentic vintage leather jacket from the 1980s. Excellent condition, genuine leather, perfect for collectors or fashion enthusiasts. Size Medium, classic brown color.',
        listing_type: 'fixed_price',
        price: 299.99,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'MacBook Pro 2019 - 16 inch',
        description: 'MacBook Pro 16-inch, 2019 model. Intel Core i7, 16GB RAM, 512GB SSD. Excellent condition, barely used. Includes original charger and box. Perfect for professionals.',
        listing_type: 'auction',
        starting_bid: 800.00,
        auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Antique Wooden Dining Table',
        description: 'Beautiful antique oak dining table, seats 6 people comfortably. Solid wood construction, some minor wear consistent with age. Perfect for traditional homes.',
        listing_type: 'fixed_price',
        price: 450.00,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Rare Pokemon Card Collection',
        description: 'Collection of rare Pokemon cards from the original Base Set. Includes Charizard, Blastoise, and Venusaur holos. All cards in near mint condition.',
        listing_type: 'auction',
        starting_bid: 150.00,
        auction_end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Vintage Camera Collection',
        description: 'Rare collection of vintage cameras including a 1960s Leica M3, Canon AE-1, and Nikon F. All in working condition with original cases. Perfect for collectors or photography enthusiasts.',
        listing_type: 'auction',
        starting_bid: 450.00,
        auction_end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Professional Camera Lens - Canon 70-200mm',
        description: 'Canon EF 70-200mm f/2.8L IS III USM lens. Professional grade telephoto lens, perfect for portraits and sports photography. Excellent optical quality.',
        listing_type: 'fixed_price',
        price: 1899.99,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Vintage Gibson Electric Guitar',
        description: 'Vintage Gibson Les Paul Standard from 1995. Sunburst finish, excellent playability, some minor cosmetic wear. Includes hard case.',
        listing_type: 'auction',
        starting_bid: 1200.00,
        auction_end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Designer Handbag - Louis Vuitton',
        description: 'Authentic Louis Vuitton Neverfull MM in Damier Ebene canvas. Excellent condition, comes with dust bag and authenticity card. Perfect everyday bag.',
        listing_type: 'fixed_price',
        price: 850.00,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Vintage Rolex Submariner Watch',
        description: 'Vintage Rolex Submariner from 1985. Automatic movement, stainless steel case, excellent working condition. A true collectors piece with original box.',
        listing_type: 'auction',
        starting_bid: 3500.00,
        auction_end_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Mid-Century Modern Armchair',
        description: 'Beautiful mid-century modern armchair in excellent condition. Teak wood frame with original upholstery. Perfect statement piece for any modern home.',
        listing_type: 'fixed_price',
        price: 675.00,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Professional Art Supplies Set',
        description: 'Complete professional art supplies set including oil paints, brushes, canvas, and easel. Perfect for artists or art students. Barely used.',
        listing_type: 'auction',
        starting_bid: 85.00,
        auction_end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Gaming Setup - RTX 3080 PC',
        description: 'High-end gaming PC with RTX 3080, Intel i7-11700K, 32GB RAM, 1TB NVMe SSD. Perfect for gaming and content creation. Includes RGB keyboard and mouse.',
        listing_type: 'fixed_price',
        price: 2299.99,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Vintage Vinyl Record Collection',
        description: 'Collection of 50+ vintage vinyl records from the 60s-80s. Includes Beatles, Pink Floyd, Led Zeppelin, and more. All in excellent condition.',
        listing_type: 'auction',
        starting_bid: 200.00,
        auction_end_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Professional Espresso Machine',
        description: 'Breville Barista Express espresso machine. Excellent condition, perfect for coffee enthusiasts. Includes grinder, milk frother, and accessories.',
        listing_type: 'fixed_price',
        price: 425.00,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Antique Persian Rug',
        description: 'Beautiful hand-woven Persian rug, approximately 8x10 feet. Rich colors and intricate patterns. Perfect for living room or dining room.',
        listing_type: 'auction',
        starting_bid: 450.00,
        auction_end_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop'])
      },
      {
        id: uuidv4(),
        seller_id: sellerId,
        title: 'Professional Bicycle - Carbon Fiber',
        description: 'High-end carbon fiber road bike, perfect for racing or long-distance cycling. Shimano components, lightweight frame, excellent condition.',
        listing_type: 'fixed_price',
        price: 1250.00,
        status: 'approved',
        image_paths: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'])
      }
    ];
    
    // Insert sample listings
    for (const listing of sampleListings) {
      db.run(`
        INSERT OR IGNORE INTO listings (
          id, seller_id, title, description, listing_type, 
          price, starting_bid, auction_end_time, status, 
          image_paths, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
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
  initializeDatabase().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase };