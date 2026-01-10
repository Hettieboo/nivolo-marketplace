const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authService = require('../services/authService');

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['buyer', 'seller', 'admin'])
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { email, password, role } = req.body;
    
    const result = await authService.register({ email, password, role });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { email, password } = req.body;
    
    const result = await authService.login({ email, password });
    
    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: error.message
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Since we're using JWT tokens stored in localStorage,
  // logout is handled on the frontend by removing the token
  res.status(200).json({
    message: 'Logout successful'
  });
});

// Routes will be implemented in later tasks
// POST /api/auth/reset-password-request - task 3.1
// POST /api/auth/reset-password - task 3.2

module.exports = router;