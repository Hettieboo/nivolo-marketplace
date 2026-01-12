// backend/seed.js
const { Pool } = require('pg');
require('dotenv').config();

// Connect to Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log('🌱 Starting database seeding...');

// Sample products with Cloudinary URLs
const sampleProducts = [
  {
    title: 'Vintage Leather Watch',
    description: 'Beautiful vintage leather watch in excellent condition. Classic design with modern functionality.',
    price: 149.99,
    listing_type: 'fixed_price',
    image_url: 'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved',
  },
  {
    title: 'Designer Sunglasses',
    description: 'Premium designer sunglasses with UV protection. Stylish and durable.',
    price: 89.99,
    listing_type: 'fixed_price',
    image_url: 'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172673/images-1767780162193-372417661_engz9i.png',
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved',
  },
];

async function seed() {
  try {
    // Check if listings already exist
    const { rows } = await pool.query('SELECT COUNT(*) FROM listings');
    if (parseInt(rows[0].count) > 0) {
      console.log(`✅ Database already has ${rows[0].count} listings. Skipping seed.`);
      return;
    }

    for (const product of sampleProducts) {
      await pool.query(
        `INSERT INTO listings (user_id, title, description, price, listing_type, image_paths, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [product.seller_id, product.title, product.description, product.price, product.listing_type, JSON.stringify([product.image_url]), product.status]
      );
      console.log(`✅ Created listing: ${product.title}`);
    }

    console.log('\n🎉 Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await pool.end();
    console.log('✅ Database connection closed.');
  }
}

seed();
