const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { authenticateToken } = require('../middleware/auth');

// Routes will be implemented in later tasks
// POST /api/payments/create-checkout-session - task 8.1
// POST /api/payments/webhook - task 8.1
// GET /api/payments - task 8.1

module.exports = router;