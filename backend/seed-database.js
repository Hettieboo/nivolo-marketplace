const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'database.sqlite');
const uploadsPath = path.join(__dirname, 'uploads');

// Connect to database
const db = new sqlite3.Database(dbPath);

console.log('🌱 Starting database seeding...');

// Sample products to seed - UPDATED WITH YOUR CORRECT USER ID
const sampleProducts = [
  {
    title: 'Vintage Leather Watch',
    description: 'Beautiful vintage leather watch in excellent condition. Classic design with modern functionality.',
    price: 149.99,
    listing_type: 'fixed_price',
    image_path: '/uploads/watch.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc', // YOUR ACTUAL USER ID
    status: 'approved'
  },
  {
    title: 'Designer Sunglasses',
    description: 'Premium designer sunglasses with UV protection. Stylish and durable.',
    price: 89.99,
    listing_type: 'fixed_price',
    image_path: '/uploads/sunglasses.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation. Perfect sound quality.',
    price: 199.99,
    listing_type: 'fixed_price',
    image_path: '/uploads/headphones.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: 'Leather Handbag',
    description: 'Elegant leather handbag with multiple compartments. Perfect for everyday use.',
    price: 249.99,
    listing_type: 'fixed_price',
    image_path: '/uploads/handbag.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: 'Running Shoes',
    description: 'Comfortable running shoes with excellent support. Barely used, like new condition.',
    price: 79.99,
    listing_type: 'fixed_price',
    image_path: '/uploads/shoes.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: 'Acoustic Guitar',
    description: 'Beautiful acoustic guitar with rich sound. Perfect for beginners and professionals.',
    starting_bid: 299.99,
    listing_type: 'auction',
    auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    image_path: '/uploads/guitar.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  }
];

// Seed function
async function seed() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM listings', (err, row) => {
      if (err) {
        console.error('❌ Error checking existing listings:', err);
        return reject(err);
      }

      if (row.count > 0) {
        console.log(`✅ Database already has ${row.count} listings. Skipping seed.`);
        return resolve();
      }

      const stmt = db.prepare(`
        INSERT INTO listings (
          user_id, title, description, price, starting_bid, 
          listing_type, auction_end_time, image_paths, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let inserted = 0;
      sampleProducts.forEach(product => {
        const imagePaths = JSON.stringify([product.image_path]);
        
        stmt.run(
          product.seller_id,
          product.title,
          product.description,
          product.price || null,
          product.starting_bid || null,
          product.listing_type,
          product.auction_end_time || null,
          imagePaths,
          product.status,
          new Date().toISOString(),
          (err) => {
            if (err) {
              console.error(`❌ Error inserting ${product.title}:`, err);
            } else {
              inserted++;
              console.log(`✅ Created listing: ${product.title}`);
            }

            if (inserted === sampleProducts.length) {
              stmt.finalize();
              console.log(`\n🎉 Seeding complete! Added ${inserted} products.`);
              resolve();
            }
          }
        );
      });
    });
  });
}

seed()
  .then(() => {
    db.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    db.close();
    process.exit(1);
  });
