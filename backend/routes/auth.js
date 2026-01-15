const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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
    
    // Generate UUID for user
    const userId = uuidv4();
    
    // Insert user into PostgreSQL - USING password_hash COLUMN
    const result = await db.query(
      `INSERT INTO users (id, email, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, role, is_admin, created_at`,
      [userId, email, hashedPassword, role]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token - NOW INCLUDING is_admin
    const token = jwt.sign({ 
      userId: user.id, 
      role: user.role,
      is_admin: user.is_admin || false 
    }, JWT_SECRET, { expiresIn: '7d' });
    
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
    
    // Compare password - USING password_hash COLUMN
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token - NOW INCLUDING is_admin
    const token = jwt.sign({ 
      userId: user.id, 
      role: user.role,
      is_admin: user.is_admin || false 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    // Remove password_hash before returning
    delete user.password_hash;
    
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
