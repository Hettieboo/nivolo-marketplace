const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Register a new user
async function register({ email, password, role = 'buyer' }) {
  // Check if user already exists
  const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('Email already registered');
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

  return { user, token };
}

// Login
async function login({ email, password }) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  // Compare password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  // Remove password before returning
  delete user.password;

  return { user, token };
}

module.exports = { register, login };
