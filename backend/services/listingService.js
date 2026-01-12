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
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO listings (
          id, seller_id, title, description, listing_type, 
          price, starting_bid, auction_end_time, status, 
          image_paths, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, datetime('now'), datetime('now'))
      `;
      
      const imagePaths = listingData.image_paths || '[]';
      
      db.run(query, [
        listingId, sellerId, title, description, listing_type,
        price || null, starting_bid || null, auction_end_time || null,
        imagePaths
      ], function(err) {
        if (err) {
          reject(new Error('Failed to create listing: ' + err.message));
          return;
        }
        
        resolve({
          id: listingId,
          seller_id: sellerId,
          title,
          description,
          listing_type,
          price: price || null,
          starting_bid: starting_bid || null,
          auction_end_time: auction_end_time || null,
          status: 'pending',
          image_paths: JSON.parse(imagePaths)
        });
      });
    });
  }

  async getApprovedListings() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.email as seller_email 
        FROM listings l 
        JOIN users u ON l.seller_id = u.id 
        WHERE l.status = 'approved' 
        ORDER BY l.created_at DESC
      `;
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch listings: ' + err.message));
          return;
        }
        
        const listings = rows.map(row => ({
          ...row,
          image_paths: JSON.parse(row.image_paths || '[]'),
          price: row.price ? parseFloat(row.price) : null,
          starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
        }));
        
        resolve(listings);
      });
    });
  }

  async getPendingListings() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.email as seller_email 
        FROM listings l 
        JOIN users u ON l.seller_id = u.id 
        WHERE l.status = 'pending' 
        ORDER BY l.created_at DESC
      `;
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch pending listings: ' + err.message));
          return;
        }
        
        const listings = rows.map(row => ({
          ...row,
          image_paths: JSON.parse(row.image_paths || '[]'),
          price: row.price ? parseFloat(row.price) : null,
          starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
        }));
        
        resolve(listings);
      });
    });
  }

  async getUserListings(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM listings 
        WHERE seller_id = ? 
        ORDER BY created_at DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch user listings: ' + err.message));
          return;
        }
        
        const listings = rows.map(row => ({
          ...row,
          image_paths: JSON.parse(row.image_paths || '[]'),
          price: row.price ? parseFloat(row.price) : null,
          starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
        }));
        
        resolve(listings);
      });
    });
  }

  async getUserPurchases(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.*, l.title, l.description, l.image_paths, l.listing_type
        FROM orders o
        JOIN listings l ON o.listing_id = l.id
        WHERE o.buyer_id = ?
        ORDER BY o.created_at DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch user purchases: ' + err.message));
          return;
        }
        
        const purchases = rows.map(row => ({
          ...row,
          image_paths: JSON.parse(row.image_paths || '[]'),
          amount: row.amount ? parseFloat(row.amount) : null
        }));
        
        resolve(purchases);
      });
    });
  }

  async approveListing(listingId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE listings 
        SET status = 'approved', updated_at = datetime('now') 
        WHERE id = ?
      `;
      
      db.run(query, [listingId], function(err) {
        if (err) {
          reject(new Error('Failed to approve listing: ' + err.message));
          return;
        }
        
        if (this.changes === 0) {
          reject(new Error('Listing not found'));
          return;
        }
        
        resolve({ message: 'Listing approved successfully' });
      });
    });
  }

  async getListingById(listingId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.email as seller_email 
        FROM listings l 
        JOIN users u ON l.seller_id = u.id 
        WHERE l.id = ? AND l.status = 'approved'
      `;
      
      db.get(query, [listingId], (err, row) => {
        if (err) {
          reject(new Error('Failed to fetch listing: ' + err.message));
          return;
        }
        
        if (!row) {
          reject(new Error('Listing not found'));
          return;
        }
        
        const listing = {
          ...row,
          image_paths: JSON.parse(row.image_paths || '[]'),
          price: row.price ? parseFloat(row.price) : null,
          starting_bid: row.starting_bid ? parseFloat(row.starting_bid) : null
        };
        
        resolve(listing);
      });
    });
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
    return new Promise((resolve, reject) => {
      // First check if listing exists and user has permission
      const checkQuery = 'SELECT * FROM listings WHERE id = ?';
      db.get(checkQuery, [listingId], (err, listing) => {
        if (err) {
          reject(new Error('Database error: ' + err.message));
          return;
        }
        
        if (!listing) {
          reject(new Error('Listing not found'));
          return;
        }
        
        // Check if user is owner or admin
        if (listing.seller_id !== userId && !isAdmin) {
          reject(new Error('Not authorized to delete this listing'));
          return;
        }
        
        // Delete the listing
        const deleteQuery = 'DELETE FROM listings WHERE id = ?';
        db.run(deleteQuery, [listingId], function(err) {
          if (err) {
            reject(new Error('Failed to delete listing: ' + err.message));
            return;
          }
          
          resolve({ message: 'Listing deleted successfully' });
        });
      });
    });
  }
}

module.exports = new ListingService();