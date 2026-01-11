const express = require('express');
const router = express.Router();
const biddingService = require('../services/biddingService');
const { authenticateToken } = require('../middleware/auth');

// POST /api/bids - Place a bid
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;
    const bidderId = req.user.userId;
    
    if (!auctionId || !bidAmount) {
      return res.status(400).json({ error: 'Auction ID and bid amount are required' });
    }
    
    const result = await biddingService.placeBid(auctionId, bidAmount, bidderId);
    res.status(201).json(result);
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/bids/:auctionId - Get bids for an auction
router.get('/:auctionId', async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const bids = await biddingService.getAuctionBids(auctionId);
    res.status(200).json({ bids });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bids/user/my-bids - Get current user's bids
router.get('/user/my-bids', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bids = await biddingService.getUserBids(userId);
    res.status(200).json({ bids });
  } catch (error) {
    console.error('Get user bids error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;