const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// POST /api/bids - Place a bid
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;
    const bidderId = req.user.userId;
    
    // Check if auction exists
    const auctionCheck = await db.query('SELECT id, starting_bid FROM listings WHERE id = $1', [auctionId]);
    if (auctionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    // Check bid amount against highest bid
    const highestBidRes = await db.query(
      'SELECT MAX(amount) AS highest_bid FROM bids WHERE auction_id = $1',
      [auctionId]
    );
    const highestBid = highestBidRes.rows[0].highest_bid || auctionCheck.rows[0].starting_bid;
    
    if (bidAmount <= highestBid) {
      return res.status(400).json({ error: `Bid must be higher than current highest bid (${highestBid})` });
    }
    
    // Insert bid
    const result = await db.query(
      `INSERT INTO bids (auction_id, bidder_id, amount, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [auctionId, bidderId, bidAmount]
    );
    
    res.status(201).json({ bid: result.rows[0] });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

// GET /api/bids/auction/:auctionId - Get all bids for an auction
router.get('/auction/:auctionId', async (req, res) => {
  try {
    const { auctionId } = req.params;
    
    const result = await db.query(
      `SELECT b.*, u.email AS bidder_email
       FROM bids b
       JOIN users u ON b.bidder_id = u.id
       WHERE b.auction_id = $1
       ORDER BY b.amount DESC, b.created_at ASC`,
      [auctionId]
    );
    
    res.json({ bids: result.rows });
  } catch (error) {
    console.error('Get auction bids error:', error);
    res.status(500).json({ error: 'Failed to get bids' });
  }
});

// GET /api/bids/user - Get all bids by the authenticated user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await db.query(
      `SELECT b.*, l.title AS auction_title
       FROM bids b
       JOIN listings l ON b.auction_id = l.id
       WHERE b.bidder_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    
    res.json({ bids: result.rows });
  } catch (error) {
    console.error('Get user bids error:', error);
    res.status(500).json({ error: 'Failed to get user bids' });
  }
});

module.exports = router;
