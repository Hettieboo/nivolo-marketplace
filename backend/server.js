const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://nivolo-marketplace.vercel.app',
    'https://nivolo-marketplace-git-main-henriettaatsenokhais-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get('/api/reset-db', async (req, res) => {
  try {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, 'database.sqlite');
    const db = new sqlite3.Database(dbPath);
    
    db.run('DELETE FROM listings', (err) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }
      db.close();
      res.json({ message: 'All listings deleted. You can now re-seed.' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/seed-demo', async (req, res) => {
  try {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, 'database.sqlite');
    const db = new sqlite3.Database(dbPath);
    
    const sampleProducts = [
      {
        title: 'Sample Product 1',
        description: 'This is a sample description for product 1.',
        price: 50,
        listing_type: 'fixed_price',
        image_path: 'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172678/images-1767781790406-890804133_uexiqx.jpg',
        user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
        status: 'approved'
      },
      {
        title: 'Sample Product 2',
        description: 'This is a sample description for product 2.',
        price: 100,
        listing_type: 'fixed_price',
        image_path: 'https://res.cloudinary.com/dylxle0dq/image/upload/v1768172673/images-1767780162193-372417661_engz9i.png',
        user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
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
          user_id, title, description, price, starting_bid, 
          listing_type, auction_end_time, image_paths, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let inserted = 0;
      const errors = [];

      sampleProducts.forEach(product => {
        const imagePaths = JSON.stringify([product.image_path]);
        
        stmt.run(
          product.user_id,
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
