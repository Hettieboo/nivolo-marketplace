const { db } = require('../config/database');

// Create a new listing
async function createListing(data, sellerId) {
  const result = await db.query(
    `INSERT INTO listings 
     (title, description, listing_type, price, starting_bid, auction_end_time, image_paths, seller_id, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
     RETURNING *`,
    [
      data.title,
      data.description,
      data.listing_type,
      data.price || null,
      data.starting_bid || null,
      data.auction_end_time || null,
      data.image_paths,
      sellerId
    ]
  );
  return result.rows[0];
}

// Get approved listings
async function getApprovedListings() {
  const result = await db.query(
    `SELECT l.*, u.email AS seller_email
     FROM listings l
     JOIN users u ON l.seller_id = u.id
     WHERE l.status = 'approved'
     ORDER BY l.created_at DESC`
  );

  return result.rows.map(row => ({
    ...row,
    image_paths: JSON.parse(row.image_paths || '[]'),
    price: row.price ? parseFloat(row.price) : null,
    starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
  }));
}

// Get pending listings (admin only)
async function getPendingListings() {
  const result = await db.query(
    `SELECT l.*, u.email AS seller_email
     FROM listings l
     JOIN users u ON l.seller_id = u.id
     WHERE l.status = 'pending'
     ORDER BY l.created_at DESC`
  );

  return result.rows.map(row => ({
    ...row,
    image_paths: JSON.parse(row.image_paths || '[]')
  }));
}

// Approve a listing (admin)
async function approveListing(listingId) {
  const result = await db.query(
    `UPDATE listings 
     SET status = 'approved', updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, status`,
    [listingId]
  );

  if (result.rows.length === 0) throw new Error('Listing not found');

  return { message: 'Listing approved successfully', listing: result.rows[0] };
}

// Get single listing by ID
async function getListingById(listingId) {
  const result = await db.query(
    `SELECT l.*, u.email AS seller_email
     FROM listings l
     JOIN users u ON l.seller_id = u.id
     WHERE l.id = $1`,
    [listingId]
  );

  if (result.rows.length === 0) throw new Error('Listing not found');

  const listing = result.rows[0];
  listing.image_paths = JSON.parse(listing.image_paths || '[]');
  listing.price = listing.price ? parseFloat(listing.price) : null;
  listing.starting_bid = listing.starting_bid ? parseFloat(listing.starting_bid) : null;

  return listing;
}

// Get listings of a specific user
async function getUserListings(userId) {
  const result = await db.query(
    `SELECT * FROM listings
     WHERE seller_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows.map(row => ({
    ...row,
    image_paths: JSON.parse(row.image_paths || '[]')
  }));
}

// Get user purchases
async function getUserPurchases(userId) {
  const result = await db.query(
    `SELECT o.*, l.title AS listing_title
     FROM orders o
     JOIN listings l ON o.listing_id = l.id
     WHERE o.buyer_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );

  return result.rows.map(row => ({
    ...row,
    amount: parseFloat(row.amount)
  }));
}

// Delete a listing (owner or admin)
async function deleteListing(listingId, userId, isAdmin) {
  const listingRes = await db.query('SELECT * FROM listings WHERE id = $1', [listingId]);
  if (listingRes.rows.length === 0) throw new Error('Listing not found');

  const listing = listingRes.rows[0];
  if (!isAdmin && listing.seller_id !== userId) throw new Error('Not authorized');

  await db.query('DELETE FROM listings WHERE id = $1', [listingId]);

  return { message: 'Listing deleted successfully' };
}

module.exports = {
  createListing,
  getApprovedListings,
  getPendingListings,
  approveListing,
  getListingById,
  getUserListings,
  getUserPurchases,
  deleteListing
};
