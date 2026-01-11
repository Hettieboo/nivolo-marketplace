const sqlite3 = require('sqlite3').verbose();

// Database path
const db = new sqlite3.Database('./backend/database.sqlite');

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
  price: (index + 1) * 50, // Example prices: 50, 100, ...
  listing_type: 'fixed_price',
  image_paths: [url],
  seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
  status: 'approved'
}));

async function seed() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM listings', (err, row) => {
      if (err) return reject(err);

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
        stmt.run(
          product.seller_id,
          product.title,
          product.description,
          product.price || null,
          null, // starting_bid (fixed_price)
          product.listing_type,
          null, // auction_end_time
          JSON.stringify(product.image_paths),
          product.status,
          new Date().toISOString(),
          (err) => {
            if (err) console.error(`❌ Error inserting ${product.title}:`, err);
            else {
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
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    db.close();
    process.exit(1);
  });
