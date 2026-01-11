const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const bidRoutes = require('./routes/bids');

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bids', bidRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Nivolo Refind API is running' });
});

// Temporary seed endpoint - visit once to populate demo products
app.get('/api/seed-demo', async (req, res) => {
  try {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, 'database.sqlite');
    const db = new sqlite3.Database(dbPath);
    
    const sampleProducts = [
      {
        title: 'Vintage Leather Watch',
        description: 'Beautiful vintage leather watch in excellent condition. Classic design with modern functionality.',
        price: 149.99,
        listing_type: 'fixed_price',
        image_path: '/uploads/watch.jpg',
        seller_id: 1,
        status: 'approved'
      },
      {
        title: 'Designer Sunglasses',
        description: 'Premium designer sunglasses with UV protection. Stylish and durable.',
        price: 89.99,
        listing_type: 'fixed_price',
        image_path: '/uploads/sunglasses.jpg',
        seller_id: 1,
        status: 'approved'
      },
      {
        title: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation. Perfect sound quality.',
        price: 199.99,
        listing_type: 'fixed_price',
        image_path: '/uploads/headphones.jpg',
        seller_id: 1,
        status: 'approved'
      },
      {
        title: 'Leather Handbag',
        description: 'Elegant leather handbag with multiple compartments. Perfect for everyday use.',
        price: 249.99,
        listing_type: 'fixed_price',
        image_path: '/uploads/handbag.jpg',
        seller_id: 1,
        status: 'approved'
      },
      {
        title: 'Running Shoes',
        description: 'Comfortable running shoes with excellent support. Barely used, like new condition.',
        price: 79.99,
        listing_type: 'fixed_price',
        image_path: '/uploads/shoes.jpg',
        seller_id: 1,
        status: 'approved'
      },
      {
        title: 'Acoustic Guitar',
        description: 'Beautiful acoustic guitar with rich sound. Perfect for beginners and professionals.',
        starting_bid: 299.99,
        listing_type: 'auction',
        auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        image_path: '/uploads/guitar.jpg',
        seller_id: 1,
        status: 'approved'
      }
    ];

    db.get('SELECT COUNT(*) as count FROM listings', (err, row) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }

      if (row.count > 0) {
        db.close();
        return res.json({ message: `Database already has ${row.count} listings. Skipping seed.` });
      }

      const stmt = db.prepare(`
        INSERT INTO listings (
          seller_id, title, description, price, starting_bid, 
          listing_type, auction_end_time, image_paths, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let inserted = 0;
      const errors = [];

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
              errors.push(`${product.title}: ${err.message}`);
            } else {
              inserted++;
            }

            if (inserted + errors.length === sampleProducts.length) {
              stmt.finalize();
              db.close();
              
              if (errors.length > 0) {
                res.status(500).json({ 
                  message: `Seeded ${inserted} products with ${errors.length} errors`,
                  errors 
                });
              } else {
                res.json({ message: `Successfully seeded ${inserted} demo products!` });
              }
            }
          }
        );
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
