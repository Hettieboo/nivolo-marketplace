const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { db } = require('../config/database');

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/listings - Get all listings
router.get('/listings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listings = await getAllListings();
    res.status(200).json({ listings });
  } catch (error) {
    console.error('Get all listings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/payments - Get all payments/orders
router.get('/payments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/listings/:id/reject - Reject listing
router.put('/listings/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listingId = req.params.id;
    const result = await rejectListing(listingId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Reject listing error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Helper functions
async function getDashboardStats() {
  return new Promise((resolve, reject) => {
    const queries = [
      'SELECT COUNT(*) as total_users FROM users',
      'SELECT COUNT(*) as total_listings FROM listings',
      'SELECT COUNT(*) as pending_listings FROM listings WHERE status = "pending"',
      'SELECT COUNT(*) as approved_listings FROM listings WHERE status = "approved"',
      'SELECT COUNT(*) as rejected_listings FROM listings WHERE status = "rejected"',
      'SELECT COUNT(*) as total_orders FROM orders',
      'SELECT COALESCE(SUM(amount), 0) as total_revenue FROM orders WHERE status = "paid"'
    ];

    let completed = 0;
    const stats = {};

    queries.forEach((query, index) => {
      db.get(query, [], (err, row) => {
        if (err) {
          reject(new Error('Failed to fetch dashboard stats: ' + err.message));
          return;
        }

        const key = Object.keys(row)[0];
        stats[key] = row[key];
        completed++;

        if (completed === queries.length) {
          resolve(stats);
        }
      });
    });
  });
}

async function getAllUsers() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, email, role, is_admin, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(new Error('Failed to fetch users: ' + err.message));
        return;
      }
      
      const users = rows.map(row => ({
        ...row,
        is_admin: Boolean(row.is_admin)
      }));
      
      resolve(users);
    });
  });
}

async function getAllListings() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT l.*, u.email as seller_email 
      FROM listings l 
      JOIN users u ON l.seller_id = u.id 
      ORDER BY l.created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(new Error('Failed to fetch listings: ' + err.message));
        return;
      }
      
      const listings = rows.map(row => ({
        ...row,
        image_paths: JSON.parse(row.image_paths || '[]'),
        price: row.price ? parseFloat(row.price) : null,
        starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
      }));
      
      resolve(listings);
    });
  });
}

async function getAllPayments() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT o.*, l.title as listing_title, 
             buyer.email as buyer_email, 
             seller.email as seller_email
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      JOIN users buyer ON o.buyer_id = buyer.id
      JOIN users seller ON l.seller_id = seller.id
      ORDER BY o.created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(new Error('Failed to fetch payments: ' + err.message));
        return;
      }
      
      const payments = rows.map(row => ({
        ...row,
        amount: row.amount ? parseFloat(row.amount) : null
      }));
      
      resolve(payments);
    });
  });
}

async function rejectListing(listingId) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE listings 
      SET status = 'rejected', updated_at = datetime('now') 
      WHERE id = ?
    `;
    
    db.run(query, [listingId], function(err) {
      if (err) {
        reject(new Error('Failed to reject listing: ' + err.message));
        return;
      }
      
      if (this.changes === 0) {
        reject(new Error('Listing not found'));
        return;
      }
      
      resolve({ message: 'Listing rejected successfully' });
    });
  });
}

module.exports = router;