const request = require('supertest');
const app = require('../app'); // Express app, not server
const fc = require('fast-check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

describe('Authentication Property-Based Tests', () => {
  beforeEach(async () => {
    await db.query('DELETE FROM users');
  });

  describe('Property 1: User registration creates valid accounts', () => {
    test('should create valid user accounts with proper password hashing and JWT generation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(p => p.trim().length >= 6),
            role: fc.constantFrom('buyer', 'seller')
          }),
          async (userData) => {
            const response = await request(app)
              .post('/api/auth/register')
              .send(userData);

            expect(response.status).toBe(201);

            expect(typeof response.body.token).toBe('string');
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.role).toBe(userData.role);
            expect(response.body.user.password).toBeUndefined();
            expect(response.body.user.password_hash).toBeUndefined();

            const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decoded.userId).toBeDefined();
            expect(decoded.email).toBe(userData.email);
            expect(decoded.role).toBe(userData.role);

            const { rows } = await db.query(
              'SELECT * FROM users WHERE email = $1',
              [userData.email]
            );

            const dbUser = rows[0];
            expect(dbUser).toBeDefined();
            expect(dbUser.email).toBe(userData.email);
            expect(dbUser.role).toBe(userData.role);

            expect(dbUser.password_hash).not.toBe(userData.password);
            expect(dbUser.password_hash.length).toBeGreaterThan(50);

            const validPassword = await bcrypt.compare(
              userData.password,
              dbUser.password_hash
            );
            expect(validPassword).toBe(true);

            expect(dbUser.is_admin).toBe(false);

            expect(dbUser.created_at).toBeDefined();
            expect(dbUser.updated_at).toBeDefined();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 2: Duplicate email registration rejection', () => {
    test('should reject registration attempts with duplicate emails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(p => p.trim().length >= 6),
            role: fc.constantFrom('buyer', 'seller')
          }),
          fc.record({
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(p => p.trim().length >= 6),
            role: fc.constantFrom('buyer', 'seller')
          }),
          async (firstUser, secondUserData) => {
            const firstResponse = await request(app)
              .post('/api/auth/register')
              .send(firstUser);

            if (firstResponse.status !== 201) return;

            const secondUser = {
              ...secondUserData,
              email: firstUser.email.toUpperCase()
            };

            const secondResponse = await request(app)
              .post('/api/auth/register')
              .send(secondUser);

            expect(secondResponse.status).toBe(400);
            expect(secondResponse.body.error).toBeDefined();

            const { rows } = await db.query(
              'SELECT COUNT(*)::int AS count FROM users WHERE LOWER(email) = LOWER($1)',
              [firstUser.email]
            );

            expect(rows[0].count).toBe(1);
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
            fc.record({
              email: fc.constantFrom('', 'invalid', '@domain.com', 'user@'),
              password: fc.string({ minLength: 6 }),
              role: fc.constantFrom('buyer', 'seller')
            }),
            fc.record({
              email: fc.emailAddress(),
              password: fc.constantFrom('', '     ', '123'),
              role: fc.constantFrom('buyer', 'seller')
            }),
            fc.record({
              email: fc.emailAddress(),
              role: fc.constantFrom('buyer', 'seller')
            }),
            fc.record({
              password: fc.string({ minLength: 6 }),
              role: fc.constantFrom('buyer', 'seller')
            })
          ),
          async (invalidUserData) => {
            const response = await request(app)
              .post('/api/auth/register')
              .send(invalidUserData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();

            if (invalidUserData.email) {
              const { rows } = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [invalidUserData.email]
              );
              expect(rows.length).toBe(0);
            }
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
