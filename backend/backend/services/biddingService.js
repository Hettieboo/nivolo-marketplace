const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class PaymentService {
  async createPaymentIntent(listingId, buyerId, billingInfo) {
    // Get listing details
    const listing = await this.getListingForPayment(listingId);
    
    if (!listing) {
      throw new Error('Listing not found');
    }
    
    if (listing.listing_type !== 'fixed_price') {
      throw new Error('Only fixed-price items can be purchased directly');
    }
    
    // Calculate total amount
    const subtotal = parseFloat(listing.price);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = 9.99;
    const total = subtotal + tax + shipping;
    
    // In a real implementation, you would create a Stripe payment intent here:
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        listingId: listingId,
        buyerId: buyerId
      }
    });
    
    return paymentIntent;
    */
    
    // For now, return a mock payment intent
    return {
      id: `pi_mock_${uuidv4()}`,
      client_secret: `pi_mock_${uuidv4()}_secret_mock`,
      amount: Math.round(total * 100),
      currency: 'usd'
    };
  }
  
  async confirmPayment(paymentIntentId, listingId, buyerId, billingInfo) {
    // Get listing details
    const listing = await this.getListingForPayment(listingId);
    
    if (!listing) {
      throw new Error('Listing not found');
    }
    
    // Calculate total amount
    const subtotal = parseFloat(listing.price);
    const tax = subtotal * 0.08;
    const shipping = 9.99;
    const total = subtotal + tax + shipping;
    
    // In a real implementation, you would verify the payment with Stripe:
    /*
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not completed');
    }
    */
    
    // Create order in database
    const orderId = uuidv4();
    
    const query = `
      INSERT INTO orders (
        id, buyer_id, listing_id, seller_id, amount, 
        payment_intent_id, billing_info, status, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      orderId, buyerId, listingId, listing.seller_id, total,
      paymentIntentId, JSON.stringify(billingInfo)
    ]);
    
    // Update listing status to sold
    await db.query(
      'UPDATE listings SET status = $1 WHERE id = $2',
      ['sold', listingId]
    );
    
    const order = result.rows[0];
    
    return {
      id: order.id,
      buyer_id: order.buyer_id,
      listing_id: order.listing_id,
      seller_id: order.seller_id,
      amount: parseFloat(order.amount),
      payment_intent_id: order.payment_intent_id,
      billing_info: JSON.parse(order.billing_info),
      status: order.status
    };
  }
  
  async getUserOrders(userId) {
    const query = `
      SELECT o.*, l.title, l.description, l.image_paths, l.price,
             u.email as seller_email
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      JOIN users u ON o.seller_id = u.id
      WHERE o.buyer_id = $1
      ORDER BY o.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    
    const orders = result.rows.map(row => ({
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]'),
      billing_info: JSON.parse(row.billing_info || '{}'),
      amount: parseFloat(row.amount)
    }));
    
    return orders;
  }
  
  async getListingForPayment(listingId) {
    const query = `
      SELECT * FROM listings 
      WHERE id = $1 AND status = 'approved'
    `;
    
    const result = await db.query(query, [listingId]);
    
    return result.rows[0]; // Returns undefined if not found
  }

  // Placeholder methods - will be implemented in later tasks
  async createCheckoutSession(orderId) {
    // Implementation will be added in task 8.1
    throw new Error('Not implemented yet');
  }

  async handlePaymentSuccess(sessionId) {
    // Implementation will be added in task 8.1
    throw new Error('Not implemented yet');
  }

  async recordPayment(paymentData) {
    // Implementation will be added in task 8.1
    throw new Error('Not implemented yet');
  }

  async getPaymentRecords() {
    // Implementation will be added in task 8.1
    throw new Error('Not implemented yet');
  }
}

module.exports = new PaymentService();

Key Changes:
Same pattern as all the others:

✅ Removed new Promise() wrappers
✅ Changed ? to $1, $2 placeholders
✅ Changed datetime('now') to CURRENT_TIMESTAMP
✅ Converted callbacks to async/await
✅ Added RETURNING * to INSERT
✅ Used result.rows[0] for single row results


Last file!
backend/routes/bids.js - share it and we're done! 👇const express = require('express');
const router = express.Router();
const biddingService = require('../services/biddingService');
const { authenticateToken } = require('../middleware/auth');
// POST /api/bids - Place a bid
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;
    const bidderId = req.user.userId;    if (!auctionId || !bidAmount) {
      return res.status(400).json({ error: 'Auction ID and bid amount are required' });
    }    const result = await biddingService.placeBid(auctionId, bidAmount, bidderId);
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
module.exports = router;Show more2:21 AMGreat! Now I need:
backend/services/biddingService.js
Paste it! 👇const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class BiddingService {
  async placeBid(auctionId, bidAmount, bidderId) {
    return new Promise((resolve, reject) => {
      // Check if auction exists and is still active
      const checkQuery = `
     pasted2:21 AMPerfect! Here's your final converted file - backend/services/biddingService.js for PostgreSQL:
javascriptconst { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class BiddingService {
  async placeBid(auctionId, bidAmount, bidderId) {
    // Check if auction exists and is still active
    const checkQuery = `
      SELECT * FROM listings 
      WHERE id = $1 AND listing_type = 'auction' 
      AND status = 'approved' 
      AND auction_end_time > CURRENT_TIMESTAMP
    `;
    
    const auctionResult = await db.query(checkQuery, [auctionId]);
    
    if (auctionResult.rows.length === 0) {
      throw new Error('Auction not found or has ended');
    }
    
    const auction = auctionResult.rows[0];
    
    // Check if bid is higher than current highest bid
    const currentBidQuery = `
      SELECT MAX(bid_amount) as highest_bid 
      FROM bids WHERE auction_id = $1
    `;
    
    const bidResult = await db.query(currentBidQuery, [auctionId]);
    const currentHighest = bidResult.rows[0].highest_bid || auction.starting_bid;
    
    if (bidAmount <= currentHighest) {
      throw new Error(`Bid must be higher than $${currentHighest}`);
    }
    
    // Place the bid
    const bidId = uuidv4();
    const insertQuery = `
      INSERT INTO bids (id, auction_id, bidder_id, bid_amount, bid_time)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, bid_amount
    `;
    
    const insertResult = await db.query(insertQuery, [bidId, auctionId, bidderId, bidAmount]);
    
    return {
      message: 'Bid placed successfully',
      bidId: insertResult.rows[0].id,
      bidAmount: parseFloat(insertResult.rows[0].bid_amount)
    };
  }

  async getCurrentHighestBid(auctionId) {
    const query = `
      SELECT MAX(bid_amount) as highest_bid 
      FROM bids WHERE auction_id = $1
    `;
    
    const result = await db.query(query, [auctionId]);
    
    return result.rows[0].highest_bid || 0;
  }

  async getAuctionBids(auctionId) {
    const query = `
      SELECT b.*, u.email as bidder_email 
      FROM bids b
      JOIN users u ON b.bidder_id = u.id
      WHERE b.auction_id = $1
      ORDER BY b.bid_amount DESC, b.bid_time DESC
    `;
    
    const result = await db.query(query, [auctionId]);
    
    const bids = result.rows.map(row => ({
      ...row,
      bid_amount: parseFloat(row.bid_amount)
    }));
    
    return bids;
  }

  async getUserBids(userId) {
    const query = `
      SELECT b.*, l.title, l.image_paths, l.auction_end_time, l.status as auction_status,
             (SELECT MAX(bid_amount) FROM bids WHERE auction_id = b.auction_id) as current_highest_bid,
             (SELECT COUNT(*) FROM bids WHERE auction_id = b.auction_id AND bid_amount > b.bid_amount) as outbid_count
      FROM bids b
      JOIN listings l ON b.auction_id = l.id
      WHERE b.bidder_id = $1
      ORDER BY b.bid_time DESC
    `;
    
    const result = await db.query(query, [userId]);
    
    const bids = result.rows.map(row => ({
      ...row,
      bid_amount: parseFloat(row.bid_amount),
      current_highest_bid: parseFloat(row.current_highest_bid),
      image_paths: JSON.parse(row.image_paths || '[]'),
      is_winning: parseInt(row.outbid_count) === 0,
      auction_ended: new Date(row.auction_end_time) < new Date()
    }));
    
    return bids;
  }

  async validateBid(auctionId, bidAmount) {
    // Implementation placeholder
    return true;
  }

  async getAuctionWinner(auctionId) {
    // Implementation placeholder
    return null;
  }

  async isAuctionActive(auctionId) {
    // Implementation placeholder
    return true;
  }
}

module.exports = new BiddingService();
```

---
