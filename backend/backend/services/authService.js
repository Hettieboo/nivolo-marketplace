const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class AuthService {
  async register(userData) {
    const { email, password, role = 'user' } = userData;
    
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const userId = uuidv4();
    const is_admin = role === 'admin';
    
    const query = `
      INSERT INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, role, is_admin
    `;
    
    const result = await db.query(query, [userId, email, password_hash, role, is_admin]);
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        is_admin: user.is_admin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_admin: Boolean(user.is_admin)
      },
      token: token
    };
  }
  
  async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0]; // Returns undefined if not found
  }

  async login(credentials) {
    const { email, password } = credentials;
    
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Find user by email
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        is_admin: user.is_admin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_admin: Boolean(user.is_admin)
      },
      token: token
    };
  }

  generateJWT(user) {
    // Implementation will be added in task 2.1
    throw new Error('Not implemented yet');
  }

  async validateJWT(token) {
    // Implementation will be added in task 2.5
    throw new Error('Not implemented yet');
  }

  async requestPasswordReset(email) {
    // Implementation will be added in task 3.1
    throw new Error('Not implemented yet');
  }

  async resetPassword(token, newPassword) {
    // Implementation will be added in task 3.2
    throw new Error('Not implemented yet');
  }
}

module.exports = new AuthService();
