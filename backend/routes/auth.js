const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'buyer' } = req.body;
    
    // Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into PostgreSQL
    const result = await db.query(
      `INSERT INTO users (email, password, role, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, email, role, is_admin, created_at`,
      [email, hashedPassword, role]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    // Remove password before returning
    delete user.password;
    
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
