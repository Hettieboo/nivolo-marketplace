const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const paymentService = require('../services/paymentService');

// POST /api/payment/create-intent - Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { listingId, billingInfo } = req.body;
    const buyerId = req.user.userId;
    
    const paymentIntent = await paymentService.createPaymentIntent(listingId, buyerId, billingInfo);
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// POST /api/payment/confirm - Confirm payment and create order
router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, listingId, billingInfo } = req.body;
    const buyerId = req.user.userId;
    
    const order = await paymentService.confirmPayment(paymentIntentId, listingId, buyerId, billingInfo);
    
    res.status(200).json({
      message: 'Payment confirmed successfully',
      order: order
    });
    
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// GET /api/payment/orders - Get user's orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await paymentService.getUserOrders(userId);
    
    res.status(200).json({
      orders: orders
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;