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
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO orders (
          id, buyer_id, listing_id, seller_id, amount, 
          payment_intent_id, billing_info, status, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', datetime('now'), datetime('now'))
      `;
      
      db.run(query, [
        orderId, buyerId, listingId, listing.seller_id, total,
        paymentIntentId, JSON.stringify(billingInfo), 
      ], function(err) {
        if (err) {
          reject(new Error('Failed to create order: ' + err.message));
          return;
        }
        
        // Update listing status to sold
        db.run(
          'UPDATE listings SET status = ? WHERE id = ?',
          ['sold', listingId],
          (updateErr) => {
            if (updateErr) {
              console.error('Failed to update listing status:', updateErr);
            }
          }
        );
        
        resolve({
          id: orderId,
          buyer_id: buyerId,
          listing_id: listingId,
          seller_id: listing.seller_id,
          amount: total,
          payment_intent_id: paymentIntentId,
          billing_info: billingInfo,
          status: 'completed'
        });
      });
    });
  }
  
  async getUserOrders(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.*, l.title, l.description, l.image_paths, l.price,
               u.email as seller_email
        FROM orders o
        JOIN listings l ON o.listing_id = l.id
        JOIN users u ON o.seller_id = u.id
        WHERE o.buyer_id = ?
        ORDER BY o.created_at DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(new Error('Failed to fetch orders: ' + err.message));
          return;
        }
        
        const orders = rows.map(row => ({
          ...row,
          image_paths: JSON.parse(row.image_paths || '[]'),
          billing_info: JSON.parse(row.billing_info || '{}'),
          amount: parseFloat(row.amount)
        }));
        
        resolve(orders);
      });
    });
  }
  
  async getListingForPayment(listingId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM listings 
        WHERE id = ? AND status = 'approved'
      `;
      
      db.get(query, [listingId], (err, row) => {
        if (err) {
          reject(new Error('Failed to fetch listing: ' + err.message));
          return;
        }
        
        resolve(row);
      });
    });
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