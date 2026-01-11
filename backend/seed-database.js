const sqlite3 = require('sqlite3').verbose();

// Database path
const db = new sqlite3.Database('./database.sqlite');

console.log('🌱 Starting database seeding...');

const sampleProducts = [
  {
    title: 'Vintage Leather Watch',
    description: 'Beautiful vintage leather watch in excellent condition. Classic design with modern functionality.',
    price: 149.99,
    listing_type: 'fixed_price',
    image_paths: ['https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg'],
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: 'Designer Sunglasses',
    description: 'Premium designer sunglasses with UV protection. Stylish and durable.',
    price: 89.99,
    listing_type: 'fixed_price',
    image_paths: ['https://res.cloudinary.com/dylxle0dq/image/upload/v1768172673/images-1767780162193-372417661_engz9i.png'],
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  }
];

// Seed function
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
          null, // no auction for these
          product.listing_type,
          null, // no auction end time
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
  .then(() => db.close(() => console.log('✅ Database connection closed.')))
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    db.close();
  });
