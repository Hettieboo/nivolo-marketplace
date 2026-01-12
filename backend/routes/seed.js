const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample products using Cloudinary URLs
const sampleProducts = [
  {
    title: 'Vintage Leather Watch',
    description: 'Beautiful vintage leather watch in excellent condition.',
    price: 149.99,
    listing_type: 'fixed_price',
    image_paths: ['https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg'],
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: 'Designer Sunglasses',
    description: 'Premium designer sunglasses with UV protection.',
    price: 89.99,
    listing_type: 'fixed_price',
    image_paths: ['https://res.cloudinary.com/dylxle0dq/image/upload/v1768172673/images-1767780162193-372417661_engz9i.png'],
    seller_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  }
];

router.post('/seed', async (req, res) => {
  db.get('SELECT COUNT(*) as count FROM listings', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row.count > 0) return res.json({ message: 'Database already seeded.' });

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
        product.starting_bid || null,
        product.listing_type,
        product.auction_end_time || null,
        JSON.stringify(product.image_paths),
        product.status,
        new Date().toISOString(),
        (err) => {
          if (err) console.error(err);
          inserted++;
          if (inserted === sampleProducts.length) {
            stmt.finalize();
            res.json({ message: `Seeding complete! Added ${inserted} products.` });
          }
        }
      );
    });
  });
});

module.exports = router;
