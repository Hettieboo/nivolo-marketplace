const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug logging for environment
console.log('🔍 Environment Configuration:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', PORT);
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL);

// Middleware - CORS with debug logging
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('🔍 Incoming request from origin:', origin);
      
      const allowedOrigins = [
        'https://nivolo-marketplace.vercel.app',
        'http://localhost:3000'
      ];
      
      // Also allow any vercel preview deployment
      const isVercelDomain = origin && origin.endsWith('sandrixs-projects-794dd683.vercel.app');
      
      if (!origin || allowedOrigins.includes(origin) || isVercelDomain) {
        console.log('✅ Origin allowed');
        callback(null, true);
      } else {
        console.log('❌ Origin blocked:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');           // auth routes
const listingRoutes = require('./routes/listings');    // listing routes
const adminRoutes = require('./routes/admin');         // admin routes
const paymentRoutes = require('./routes/payment');     // real payment endpoints.
const paymentsRoutes = require('./routes/payments');   // placeholder/future endpoints
const bidRoutes = require('./routes/bids');            // bidding routes
const seedRoutes = require('./scripts/seedData');      // seed route

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api', seedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Nivolo Refind API is running',
    cors_configured_for: process.env.FRONTEND_URL || 'http://localhost:3000',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ CORS configured for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
