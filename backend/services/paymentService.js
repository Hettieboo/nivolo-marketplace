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
