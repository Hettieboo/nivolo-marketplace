const { db } = require('../config/database');

// Place a bid
async function placeBid(auctionId, bidAmount, bidderId) {
  // Optional: check if auction exists
  const auctionCheck = await db.query('SELECT id, starting_bid FROM listings WHERE id = $1', [auctionId]);
  if (auctionCheck.rows.length === 0) {
    throw new Error('Auction not found');
  }

  // Optional: check bid amount against highest bid
  const highestBidRes = await db.query(
    'SELECT MAX(amount) AS highest_bid FROM bids WHERE auction_id = $1',
    [auctionId]
  );
  const highestBid = highestBidRes.rows[0].highest_bid || auctionCheck.rows[0].starting_bid;
  if (bidAmount <= highestBid) {
    throw new Error(`Bid must be higher than current highest bid (${highestBid})`);
  }

  // Insert bid
  const result = await db.query(
    `INSERT INTO bids (auction_id, bidder_id, amount, created_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [auctionId, bidderId, bidAmount]
  );

  return result.rows[0];
}

// Get all bids for an auction
async function getAuctionBids(auctionId) {
  const result = await db.query(
    `SELECT b.*, u.email AS bidder_email
     FROM bids b
     JOIN users u ON b.bidder_id = u.id
     WHERE b.auction_id = $1
     ORDER BY b.amount DESC, b.created_at ASC`,
    [auctionId]
  );

  return result.rows;
}

// Get all bids by a user
async function getUserBids(userId) {
  const result = await db.query(
    `SELECT b.*, l.title AS auction_title
     FROM bids b
     JOIN listings l ON b.auction_id = l.id
     WHERE b.bidder_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );

  return result.rows;
}

module.exports = { placeBid, getAuctionBids, getUserBids };
