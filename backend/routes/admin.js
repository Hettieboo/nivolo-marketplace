const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { db } = require('../backend/config/database');

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
  const stats = {};
  
  // Run all queries in parallel
  const [
    totalUsers,
    totalListings,
    pendingListings,
    approvedListings,
    rejectedListings,
    totalOrders,
    totalRevenue
  ] = await Promise.all([
    db.query('SELECT COUNT(*) as total_users FROM users'),
    db.query('SELECT COUNT(*) as total_listings FROM listings'),
    db.query('SELECT COUNT(*) as pending_listings FROM listings WHERE status = $1', ['pending']),
    db.query('SELECT COUNT(*) as approved_listings FROM listings WHERE status = $1', ['approved']),
    db.query('SELECT COUNT(*) as rejected_listings FROM listings WHERE status = $1', ['rejected']),
    db.query('SELECT COUNT(*) as total_orders FROM orders'),
    db.query('SELECT COALESCE(SUM(amount), 0) as total_revenue FROM orders WHERE status = $1', ['paid'])
  ]);
  
  stats.total_users = parseInt(totalUsers.rows[0].total_users);
  stats.total_listings = parseInt(totalListings.rows[0].total_listings);
  stats.pending_listings = parseInt(pendingListings.rows[0].pending_listings);
  stats.approved_listings = parseInt(approvedListings.rows[0].approved_listings);
  stats.rejected_listings = parseInt(rejectedListings.rows[0].rejected_listings);
  stats.total_orders = parseInt(totalOrders.rows[0].total_orders);
  stats.total_revenue = parseFloat(totalRevenue.rows[0].total_revenue);
  
  return stats;
}

async function getAllUsers() {
  const query = `
    SELECT id, email, role, is_admin, created_at, updated_at
    FROM users 
    ORDER BY created_at DESC
  `;
  
  const result = await db.query(query);
  
  const users = result.rows.map(row => ({
    ...row,
    is_admin: Boolean(row.is_admin)
  }));
  
  return users;
}

async function getAllListings() {
  const query = `
    SELECT l.*, u.email as seller_email 
    FROM listings l 
    JOIN users u ON l.seller_id = u.id 
    ORDER BY l.created_at DESC
  `;
  
  const result = await db.query(query);
  
  const listings = result.rows.map(row => ({
    ...row,
    image_paths: JSON.parse(row.image_paths || '[]'),
    price: row.price ? parseFloat(row.price) : null,
    starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
  }));
  
  return listings;
}

async function getAllPayments() {
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
  
  const result = await db.query(query);
  
  const payments = result.rows.map(row => ({
    ...row,
    amount: row.amount ? parseFloat(row.amount) : null
  }));
  
  return payments;
}

async function rejectListing(listingId) {
  const query = `
    UPDATE listings 
    SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1
    RETURNING id
  `;
  
  const result = await db.query(query, [listingId]);
  
  if (result.rows.length === 0) {
    throw new Error('Listing not found');
  }
  
  return { message: 'Listing rejected successfully' };
}

module.exports = router;
