const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class BiddingService {
  async placeBid(auctionId, bidAmount, bidderId) {
    return new Promise((resolve, reject) => {
      // Check if auction exists and is still active
      const checkQuery = `
        SELECT * FROM listings 
        WHERE id = ? AND listing_type = 'auction' 
        AND status = 'approved' 
        AND datetime(auction_end_time) > datetime('now')
      `;
      
      db.get(checkQuery, [auctionId], (err, auction) => {
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        
        if (!auction) {
          reject(new Error('Auction not found or has ended'));
          return;
        }
        
        // Check if bid is higher than current highest bid
        const currentBidQuery = `
          SELECT MAX(bid_amount) as highest_bid 
          FROM bids WHERE auction_id = ?
        `;
        
        db.get(currentBidQuery, [auctionId], (err, result) => {
          if (err) {
            reject(new Error('Database error: ' + err.message));
            return;
          }
          
          const currentHighest = result.highest_bid || auction.starting_bid;
          
          if (bidAmount <= currentHighest) {
            reject(new Error(`Bid must be higher than $${currentHighest}`));
            return;
          }
          
          // Place the bid
          const bidId = uuidv4();
          const insertQuery = `
            INSERT INTO bids (id, auction_id, bidder_id, bid_amount, bid_time)
            VALUES (?, ?, ?, ?, datetime('now'))
          `;
          
          db.run(insertQuery, [bidId, auctionId, bidderId, bidAmount], function(err) {
            if (err) {
              reject(new Error('Failed to place bid: ' + err.message));
              return;
            }
            
            resolve({
              message: 'Bid placed successfully',
              bidId: bidId,
              bidAmount: bidAmount
            });
          });
        });
      });
    });
  }

  async getCurrentHighestBid(auctionId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT MAX(bid_amount) as highest_bid 
        FROM bids WHERE auction_id = ?
      `;
      
      db.get(query, [auctionId], (err, result) => {
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        
        resolve(result.highest_bid || 0);
      });
    });
  }

  async getAuctionBids(auctionId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, u.email as bidder_email 
        FROM bids b
        JOIN users u ON b.bidder_id = u.id
        WHERE b.auction_id = ?
        ORDER BY b.bid_amount DESC, b.bid_time DESC
      `;
      
      db.all(query, [auctionId], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch bids: ' + err.message));
          return;
        }
        
        const bids = rows.map(row => ({
          ...row,
          bid_amount: parseFloat(row.bid_amount)
        }));
        
        resolve(bids);
      });
    });
  }

  async getUserBids(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, l.title, l.image_paths, l.auction_end_time, l.status as auction_status,
               (SELECT MAX(bid_amount) FROM bids WHERE auction_id = b.auction_id) as current_highest_bid,
               (SELECT COUNT(*) FROM bids WHERE auction_id = b.auction_id AND bid_amount > b.bid_amount) as outbid_count
        FROM bids b
        JOIN listings l ON b.auction_id = l.id
        WHERE b.bidder_id = ?
        ORDER BY b.bid_time DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch user bids: ' + err.message));
          return;
        }
        
        const bids = rows.map(row => ({
          ...row,
          bid_amount: parseFloat(row.bid_amount),
          current_highest_bid: parseFloat(row.current_highest_bid),
          image_paths: JSON.parse(row.image_paths || '[]'),
          is_winning: row.outbid_count === 0,
          auction_ended: new Date(row.auction_end_time) < new Date()
        }));
        
        resolve(bids);
      });
    });
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