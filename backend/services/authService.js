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
    const is_admin = role === 'admin' ? 1 : 0;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (id, email, password_hash, role, is_admin, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `;
      
      db.run(query, [userId, email, password_hash, role, is_admin], function(err) {
        if (err) {
          reject(new Error('Failed to create user: ' + err.message));
          return;
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: userId, 
            email: email, 
            role: role,
            is_admin: is_admin 
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        resolve({
          user: {
            id: userId,
            email: email,
            role: role,
            is_admin: Boolean(is_admin)
          },
          token: token
        });
      });
    });
  }
  
  findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
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