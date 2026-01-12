const request = require('supertest');
const app = require('../server');
const fc = require('fast-check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

describe('Authentication Login Property-Based Tests', () => {
  beforeEach(async () => {
    // Clean up users table before each test
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  describe('Property 4: Authentication token management', () => {
    test('should generate valid JWT tokens with correct claims and expiration', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
            role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
          }),
          async (userData) => {
            // First register a user
            const registerResponse = await request(app)
              .post('/api/auth/register')
              .send(userData);
            
            expect(registerResponse.status).toBe(201);
            
            // Then login with the same credentials
            const loginResponse = await request(app)
              .post('/api/auth/login')
              .send({
                email: userData.email,
                password: userData.password
              });
            
            expect(loginResponse.status).toBe(200);
            
            // Verify JWT token structure and claims
            const token = loginResponse.body.token;
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            
            // Decode and verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verify token claims
            expect(decoded.userId).toBeDefined();
            expect(decoded.email).toBe(userData.email);
            expect(decoded.role).toBe(userData.role);
            expect(decoded.is_admin).toBeDefined();
            
            // Verify token expiration (should be 7 days from now)
            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
            
            const tokenLifetime = decoded.exp - decoded.iat;
            const expectedLifetime = 7 * 24 * 60 * 60; // 7 days in seconds
            expect(tokenLifetime).toBe(expectedLifetime);
            
            // Verify token is not expired
            const now = Math.floor(Date.now() / 1000);
            expect(decoded.exp).toBeGreaterThan(now);
            
            // Verify user data in response matches database
            const user = loginResponse.body.user;
            expect(user.id).toBe(decoded.userId);
            expect(user.email).toBe(userData.email);
            expect(user.role).toBe(userData.role);
            expect(user.password).toBeUndefined();
            expect(user.password_hash).toBeUndefined();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 5: Invalid credential rejection', () => {
    test('should reject login attempts with invalid credentials', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
            role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
          }),
          fc.oneof(
            // Wrong password
            fc.record({
              wrongPassword: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6)
            }),
            // Wrong email
            fc.record({
              wrongEmail: fc.emailAddress()
            }),
            // Invalid email format
            fc.record({
              invalidEmail: fc.oneof(
                fc.constant(''),
                fc.constant('invalid-email'),
                fc.constant('@domain.com'),
                fc.constant('user@')
              )
            }),
            // Empty password
            fc.record({
              emptyPassword: fc.constant('')
            })
          ),
          async (validUser, invalidCredentials) => {
            // First register a valid user
            const registerResponse = await request(app)
              .post('/api/auth/register')
              .send(validUser);
            
            expect(registerResponse.status).toBe(201);
            
            // Prepare invalid login credentials
            let loginCredentials;
            if (invalidCredentials.wrongPassword) {
              // Ensure wrong password is different from correct one
              const wrongPassword = invalidCredentials.wrongPassword === validUser.password 
                ? validUser.password + 'x' 
                : invalidCredentials.wrongPassword;
              loginCredentials = {
                email: validUser.email,
                password: wrongPassword
              };
            } else if (invalidCredentials.wrongEmail) {
              // Ensure wrong email is different from correct one
              const wrongEmail = invalidCredentials.wrongEmail === validUser.email
                ? 'different' + invalidCredentials.wrongEmail
                : invalidCredentials.wrongEmail;
              loginCredentials = {
                email: wrongEmail,
                password: validUser.password
              };
            } else if (invalidCredentials.invalidEmail) {
              loginCredentials = {
                email: invalidCredentials.invalidEmail,
                password: validUser.password
              };
            } else if (invalidCredentials.emptyPassword !== undefined) {
              loginCredentials = {
                email: validUser.email,
                password: invalidCredentials.emptyPassword
              };
            }
            
            // Attempt login with invalid credentials
            const loginResponse = await request(app)
              .post('/api/auth/login')
              .send(loginCredentials);
            
            // Should reject invalid credentials
            expect(loginResponse.status).toBeGreaterThanOrEqual(400);
            expect(loginResponse.body.token).toBeUndefined();
            expect(loginResponse.body.error).toBeDefined();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 6: Token expiration enforcement', () => {
    test('should reject expired tokens', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
            role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
          }),
          async (userData) => {
            // Create an expired token manually
            const userId = 'test-user-id';
            const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
            
            const expiredToken = jwt.sign(
              {
                userId: userId,
                email: userData.email,
                role: userData.role,
                is_admin: 0,
                iat: pastTime - 3600, // Issued 2 hours ago
                exp: pastTime // Expired 1 hour ago
              },
              process.env.JWT_SECRET
            );
            
            // Verify that jwt.verify throws an error for expired token
            expect(() => {
              jwt.verify(expiredToken, process.env.JWT_SECRET);
            }).toThrow('jwt expired');
            
            // Test with a valid token that has proper expiration
            const validToken = jwt.sign(
              {
                userId: userId,
                email: userData.email,
                role: userData.role,
                is_admin: 0
              },
              process.env.JWT_SECRET,
              { expiresIn: '7d' } // Standard 7-day expiration
            );
            
            // Should be valid
            const decoded = jwt.verify(validToken, process.env.JWT_SECRET);
            expect(decoded.userId).toBe(userId);
            expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
          }
        ),
        { numRuns: 5 }
      );
    }, 10000); // 10 second timeout
  });
});