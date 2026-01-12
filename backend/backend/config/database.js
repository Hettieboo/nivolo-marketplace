const { Pool } = require('pg');

// Use Railway's DATABASE_URL or fallback to local PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'buyer', 'seller', 'user')),
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Listings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id TEXT PRIMARY KEY,
        seller_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        listing_type TEXT NOT NULL CHECK(listing_type IN ('fixed_price', 'auction')),
        price DECIMAL(10,2),
        starting_bid DECIMAL(10,2),
        auction_end_time TIMESTAMP,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'sold')),
        image_paths TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users (id)
      )
    `);

    // Bids table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        auction_id TEXT NOT NULL,
        bidder_id TEXT NOT NULL,
        bid_amount DECIMAL(10,2) NOT NULL,
        bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES listings (id),
        FOREIGN KEY (bidder_id) REFERENCES users (id)
      )
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        buyer_id TEXT NOT NULL,
        listing_id TEXT NOT NULL,
        seller_id TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_intent_id TEXT,
        billing_info TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users (id),
        FOREIGN KEY (listing_id) REFERENCES listings (id),
        FOREIGN KEY (seller_id) REFERENCES users (id)
      )
    `);

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        stripe_session_id TEXT,
        amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed')),
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      )
    `);

    // Password reset tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await client.query('COMMIT');
    console.log('Database tables initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { db: pool, initializeDatabase };
