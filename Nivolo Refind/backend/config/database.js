const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'buyer', 'seller', 'user')),
          is_admin BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Listings table
      db.run(`
        CREATE TABLE IF NOT EXISTS listings (
          id TEXT PRIMARY KEY,
          seller_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          listing_type TEXT NOT NULL CHECK(listing_type IN ('fixed_price', 'auction')),
          price DECIMAL(10,2),
          starting_bid DECIMAL(10,2),
          auction_end_time DATETIME,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'sold')),
          image_paths TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (seller_id) REFERENCES users (id)
        )
      `);

      // Bids table
      db.run(`
        CREATE TABLE IF NOT EXISTS bids (
          id TEXT PRIMARY KEY,
          auction_id TEXT NOT NULL,
          bidder_id TEXT NOT NULL,
          bid_amount DECIMAL(10,2) NOT NULL,
          bid_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (auction_id) REFERENCES listings (id),
          FOREIGN KEY (bidder_id) REFERENCES users (id)
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          buyer_id TEXT NOT NULL,
          listing_id TEXT NOT NULL,
          seller_id TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          payment_intent_id TEXT,
          billing_info TEXT,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (buyer_id) REFERENCES users (id),
          FOREIGN KEY (listing_id) REFERENCES listings (id),
          FOREIGN KEY (seller_id) REFERENCES users (id)
        )
      `);

      // Payments table
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          stripe_session_id TEXT,
          amount DECIMAL(10,2) NOT NULL,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed')),
          payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id)
        )
      `);

      // Password reset tokens table
      db.run(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          token TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          used BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database tables initialized successfully');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initializeDatabase };