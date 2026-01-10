const request = require('supertest');
const app = require('../server');
const fc = require('fast-check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

describe('Authentication Property-Based Tests', () => {
  beforeEach(async () => {
    // Clean up users table before each test
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  describe('Property 1: User registration creates valid accounts', () => {
    test('should create valid user accounts with proper password hashing and JWT generation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }),
            role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
          }),
          async (userData) => {
            const response = await request(app)
              .post('/api/auth/register')
              .send(userData);

            // Should return 201 status for successful registration
            expect(response.status).toBe(201);
            
            // Should return a JWT token
            expect(response.body.token).toBeDefined();
            expect(typeof response.body.token).toBe('string');
            
            // Should return user data without password
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.role).toBe(userData.role);
            expect(response.body.user.password).toBeUndefined();
            expect(response.body.user.password_hash).toBeUndefined();
            
            // Verify JWT token is valid
            const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decoded.userId).toBeDefined();
            expect(decoded.email).toBe(userData.email);
            expect(decoded.role).toBe(userData.role);
            
            // Verify user is stored in database with hashed password
            const dbUser = await new Promise((resolve, reject) => {
              db.get(
                'SELECT * FROM users WHERE email = ?',
                [userData.email],
                (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                }
              );
            });
            
            expect(dbUser).toBeDefined();
            expect(dbUser.email).toBe(userData.email);
            expect(dbUser.role).toBe(userData.role);
            
            // Verify password is properly hashed (not plain text)
            expect(dbUser.password_hash).not.toBe(userData.password);
            expect(dbUser.password_hash.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars
            
            // Verify password can be validated with bcrypt
            const isValidPassword = await bcrypt.compare(userData.password, dbUser.password_hash);
            expect(isValidPassword).toBe(true);
            
            // Verify is_admin flag is set correctly
            expect(dbUser.is_admin).toBe(userData.role === 'admin' ? 1 : 0);
            
            // Verify timestamps are set
            expect(dbUser.created_at).toBeDefined();
            expect(dbUser.updated_at).toBeDefined();
          }
        ),
        { numRuns: 10 } // Run 10 different test cases
      );
    });
  });

  describe('Property 2: Duplicate email registration rejection', () => {
    test('should reject registration attempts with duplicate emails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
            role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
          }),
          fc.record({
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
            role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
          }),
          async (firstUser, secondUserData) => {
            // Register first user
            const firstResponse = await request(app)
              .post('/api/auth/register')
              .send(firstUser);
            
            // Skip if first registration failed due to validation
            if (firstResponse.status !== 201) {
              return;
            }
            
            // Attempt to register second user with same email (case insensitive)
            const secondUser = {
              ...secondUserData,
              email: firstUser.email.toUpperCase() // Test case insensitivity
            };
            
            const secondResponse = await request(app)
              .post('/api/auth/register')
              .send(secondUser);
            
            // Should reject duplicate email registration
            expect(secondResponse.status).toBe(400);
            expect(secondResponse.body.error).toContain('already exists');
            
            // Verify only one user exists in database
            const userCount = await new Promise((resolve, reject) => {
              db.get(
                'SELECT COUNT(*) as count FROM users WHERE email = ?',
                [firstUser.email],
                (err, row) => {
                  if (err) reject(err);
                  else resolve(row.count);
                }
              );
            });
            
            expect(userCount).toBe(1);
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Property 3: Input validation prevents invalid registrations', () => {
    test('should reject registrations with invalid input data', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            // Invalid email formats
            fc.record({
              email: fc.oneof(
                fc.constant(''),
                fc.constant('invalid-email'),
                fc.constant('@domain.com'),
                fc.constant('user@'),
                fc.string().filter(s => !s.includes('@'))
              ),
              password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
              role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
            }),
            // Invalid passwords (too short or empty)
            fc.record({
              email: fc.emailAddress(),
              password: fc.oneof(
                fc.string({ maxLength: 5 }),
                fc.constant(''),
                fc.constant('     ') // Only spaces
              ),
              role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
            }),
            // Missing required fields
            fc.record({
              email: fc.emailAddress(),
              role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
              // Missing password
            }),
            fc.record({
              password: fc.string({ minLength: 6, maxLength: 50 }).filter(s => s.trim().length >= 6),
              role: fc.oneof(fc.constant('buyer'), fc.constant('seller'))
              // Missing email
            })
          ),
          async (invalidUserData) => {
            const response = await request(app)
              .post('/api/auth/register')
              .send(invalidUserData);
            
            // Should reject invalid input with 400 status
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            
            // Should not create user in database
            if (invalidUserData.email && invalidUserData.email.includes('@')) {
              const dbUser = await new Promise((resolve, reject) => {
                db.get(
                  'SELECT * FROM users WHERE email = ?',
                  [invalidUserData.email],
                  (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                  }
                );
              });
              
              expect(dbUser).toBeUndefined();
            }
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});