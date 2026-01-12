const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
class ListingService {
  async createListing(listingData, sellerId) {
    const { title, description, listing_type, price, starting_bid, auction_end_time } = listingData;
    
    // Validate input
    if (!title || !description || !listing_type) {
      throw new Error('Title, description, and listing type are required');
    }
    
    if (listing_type === 'fixed_price' && !price) {
      throw new Error('Price is required for fixed-price listings');
    }
    
    if (listing_type === 'auction' && (!starting_bid || !auction_end_time)) {
      throw new Error('Starting bid and auction end time are required for auctions');
    }
    
    const listingId = uuidv4();
    const imagePaths = listingData.image_paths || '[]';
    
    const query = `
      INSERT INTO listings (
        id, seller_id, title, description, listing_type, 
        price, starting_bid, auction_end_time, status, 
        image_paths, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      listingId, sellerId, title, description, listing_type,
      price || null, starting_bid || null, auction_end_time || null,
      imagePaths
    ]);
    
    const listing = result.rows[0];
    
    return {
      id: listing.id,
      seller_id: listing.seller_id,
      title: listing.title,
      description: listing.description,
      listing_type: listing.listing_type,
      price: listing.price ? parseFloat(listing.price) : null,
      starting_bid: listing.starting_bid ? parseFloat(listing.starting_bid) : null,
      auction_end_time: listing.auction_end_time,
      status: listing.status,
      image_paths: JSON.parse(listing.image_paths)
    };
  }

  async getApprovedListings() {
    const query = `
      SELECT l.*, u.email as seller_email 
      FROM listings l 
      JOIN users u ON l.seller_id = u.id 
      WHERE l.status = 'approved' 
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

  async getPendingListings() {
    const query = `
      SELECT l.*, u.email as seller_email 
      FROM listings l 
      JOIN users u ON l.seller_id = u.id 
      WHERE l.status = 'pending' 
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

  async getUserListings(userId) {
    const query = `
      SELECT * FROM listings 
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    
    const listings = result.rows.map(row => ({
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]'),
      price: row.price ? parseFloat(row.price) : null,
      starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
    }));
    
    return listings;
  }

  async getUserPurchases(userId) {
    const query = `
      SELECT o.*, l.title, l.description, l.image_paths, l.listing_type
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      WHERE o.buyer_id = $1
      ORDER BY o.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    
    const purchases = result.rows.map(row => ({
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]'),
      amount: row.amount ? parseFloat(row.amount) : null
    }));
    
    return purchases;
  }

  async approveListing(listingId) {
    const query = `
      UPDATE listings 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await db.query(query, [listingId]);
    
    if (result.rows.length === 0) {
      throw new Error('Listing not found');
    }
    
    return { message: 'Listing approved successfully' };
  }

  async getListingById(listingId) {
    const query = `
      SELECT l.*, u.email as seller_email 
      FROM listings l 
      JOIN users u ON l.seller_id = u.id 
      WHERE l.id = $1 AND l.status = 'approved'
    `;
    
    const result = await db.query(query, [listingId]);
    
    if (result.rows.length === 0) {
      throw new Error('Listing not found');
    }
    
    const row = result.rows[0];
    
    const listing = {
      ...row,
      image_paths: JSON.parse(row.image_paths || '[]'),
      price: row.price ? parseFloat(row.price) : null,
      starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
    };
    
    return listing;
  }

  async rejectListing(listingId) {
    // Implementation will be added in task 5.1
    throw new Error('Not implemented yet');
  }

  async uploadImages(files, listingId) {
    // Implementation will be added in task 4.4
    throw new Error('Not implemented yet');
  }

  async deleteListing(listingId, userId, isAdmin) {
    // First check if listing exists and user has permission
    const checkQuery = 'SELECT * FROM listings WHERE id = $1';
    const checkResult = await db.query(checkQuery, [listingId]);
    
    if (checkResult.rows.length === 0) {
      throw new Error('Listing not found');
    }
    
    const listing = checkResult.rows[0];
    
    // Check if user is owner or admin
    if (listing.seller_id !== userId && !isAdmin) {
      throw new Error('Not authorized to delete this listing');
    }
    
    // Delete the listing
    const deleteQuery = 'DELETE FROM listings WHERE id = $1';
    await db.query(deleteQuery, [listingId]);
    
    return { message: 'Listing deleted successfully' };
  }
}

module.exports = new ListingService();
