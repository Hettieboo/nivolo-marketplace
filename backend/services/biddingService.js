const { v4: uuidv4 } = require('uuid');
const { db } = require('../backend/config/database');

class BiddingService {
  async placeBid(auctionId, bidAmount, bidderId) {
    try {
      // Check if auction exists and is still active
      const checkQuery = `
        SELECT * FROM listings 
        WHERE id = $1 AND listing_type = 'auction' 
        AND status = 'approved' 
        AND auction_end_time > NOW()
      `;
      
      const auctionResult = await db.query(checkQuery, [auctionId]);
      const auction = auctionResult.rows[0];
      
      if (!auction) {
        throw new Error('Auction not found or has ended');
      }
      
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
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      
      await db.query(insertQuery, [bidId, auctionId, bidderId, bidAmount]);
      
      return {
        message: 'Bid placed successfully',
        bidId: bidId,
        bidAmount: bidAmount
      };
    } catch (error) {
      throw error;
    }
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
      is_winning: row.outbid_count === 0,
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
