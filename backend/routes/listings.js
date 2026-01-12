const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /api/listings - Create a new listing
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { title, description, listing_type, price, starting_bid, auction_end_time } = req.body;
    
    // Get uploaded image paths
    const image_paths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const result = await db.query(
      `INSERT INTO listings 
       (title, description, listing_type, price, starting_bid, auction_end_time, image_paths, seller_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
       RETURNING *`,
      [
        title,
        description,
        listing_type,
        price || null,
        starting_bid || null,
        auction_end_time || null,
        JSON.stringify(image_paths),
        sellerId
      ]
    );
    
    res.status(201).json({ listing: result.rows[0] });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// GET /api/listings - Get approved listings
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, u.email AS seller_email
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.status = 'approved'
       ORDER BY l.created_at DESC`
    );
    
    const listings = result.rows.map(row => ({
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]'),
      price: row.price ? parseFloat(row.price) : null,
      starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
    }));
    
    res.json({ listings });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

// GET /api/listings/pending - Get pending listings (admin only)
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, u.email AS seller_email
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.status = 'pending'
       ORDER BY l.created_at DESC`
    );
    
    const listings = result.rows.map(row => ({
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]')
    }));
    
    res.json({ listings });
  } catch (error) {
    console.error('Get pending listings error:', error);
    res.status(500).json({ error: 'Failed to get pending listings' });
  }
});

// GET /api/listings/my-listings - Get user's own listings
router.get('/my-listings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await db.query(
      `SELECT * FROM listings
       WHERE seller_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    
    const listings = result.rows.map(row => ({
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]')
    }));
    
    res.json({ listings });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ error: 'Failed to get user listings' });
  }
});

// GET /api/listings/my-purchases - Get user's purchases
router.get('/my-purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await db.query(
      `SELECT o.*, l.title AS listing_title
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );
    
    const purchases = result.rows.map(row => ({
      ...row,
      amount: parseFloat(row.amount)
    }));
    
    res.json({ purchases });
  } catch (error) {
    console.error('Get user purchases error:', error);
    res.status(500).json({ error: 'Failed to get purchases' });
  }
});

// GET /api/listings/:id - Get single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT l.*, u.email AS seller_email
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    const listing = result.rows[0];
    listing.image_paths = JSON.parse(listing.image_paths || '[]');
    listing.price = listing.price ? parseFloat(listing.price) : null;
    listing.starting_bid = listing.starting_bid ? parseFloat(listing.starting_bid) : null;
    
    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

// PUT /api/listings/:id/approve - Approve a listing (admin)
router.put('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `UPDATE listings 
       SET status = 'approved', updated_at = NOW()
       WHERE id = $1
       RETURNING id, title, status`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({ message: 'Listing approved successfully', listing: result.rows[0] });
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ error: 'Failed to approve listing' });
  }
});

// DELETE /api/listings/:id - Delete a listing (owner or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'admin';
    
    const listingRes = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    
    if (listingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    const listing = listingRes.rows[0];
    
    if (!isAdmin && listing.seller_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await db.query('DELETE FROM listings WHERE id = $1', [id]);
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
