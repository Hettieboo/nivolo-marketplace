const request = require('supertest');
const app = require('../app'); // IMPORTANT: Express app, not server
const fc = require('fast-check');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

describe('Authentication Login Property-Based Tests', () => {
  beforeEach(async () => {
    // PostgreSQL-safe cleanup
    await db.query('DELETE FROM users');
  });

  describe('Property 4: Authentication token management', () => {
    test('should generate valid JWT tokens with correct claims and expiration', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(p => p.trim().length >= 6),
            role: fc.constantFrom('buyer', 'seller')
          }),
          async (userData) => {
            const registerResponse = await request(app)
              .post('/api/auth/register')
              .send(userData);

            expect(registerResponse.status).toBe(201);

            const loginResponse = await request(app)
              .post('/api/auth/login')
              .send({
                email: userData.email,
                password: userData.password
              });

            expect(loginResponse.status).toBe(200);

            const token = loginResponse.body.token;
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            expect(decoded.userId).toBeDefined();
            expect(decoded.email).toBe(userData.email);
            expect(decoded.role).toBe(userData.role);
            expect(decoded.is_admin).toBeDefined();

            // Expiration check (±2s tolerance)
            const lifetime = decoded.exp - decoded.iat;
            const expected = 7 * 24 * 60 * 60;
            expect(Math.abs(lifetime - expected)).toBeLessThanOrEqual(2);

            const now = Math.floor(Date.now() / 1000);
            expect(decoded.exp).toBeGreaterThan(now);

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
            password: fc.string({ minLength: 6, maxLength: 50 }).filter(p => p.trim().length >= 6),
            role: fc.constantFrom('buyer', 'seller')
          }),
          fc.oneof(
            fc.record({ wrongPassword: fc.string({ minLength: 6 }) }),
            fc.record({ wrongEmail: fc.emailAddress() }),
            fc.record({ invalidEmail: fc.constantFrom('', 'invalid', '@x.com', 'user@') }),
            fc.record({ emptyPassword: fc.constant('') })
          ),
          async (validUser, invalid) => {
            await request(app)
              .post('/api/auth/register')
              .send(validUser);

            let credentials;

            if (invalid.wrongPassword) {
              credentials = {
                email: validUser.email,
                password:
                  invalid.wrongPassword === validUser.password
                    ? invalid.wrongPassword + 'x'
                    : invalid.wrongPassword
              };
            } else if (invalid.wrongEmail) {
              credentials = {
                email:
                  invalid.wrongEmail === validUser.email
                    ? `x${invalid.wrongEmail}`
                    : invalid.wrongEmail,
                password: validUser.password
              };
            } else if (invalid.invalidEmail !== undefined) {
              credentials = {
                email: invalid.invalidEmail,
                password: validUser.password
              };
            } else {
              credentials = {
                email: validUser.email,
                password: ''
              };
            }

            const response = await request(app)
              .post('/api/auth/login')
              .send(credentials);

            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.body.token).toBeUndefined();
            expect(response.body.error).toBeDefined();
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
            role: fc.constantFrom('buyer', 'seller')
          }),
          async (userData) => {
            const now = Math.floor(Date.now() / 1000);

            const expiredToken = jwt.sign(
              {
                userId: 'test-id',
                email: userData.email,
                role: userData.role,
                is_admin: 0,
                iat: now - 7200,
                exp: now - 3600
              },
              process.env.JWT_SECRET
            );

            expect(() => jwt.verify(expiredToken, process.env.JWT_SECRET))
              .toThrow(/expired/);

            const validToken = jwt.sign(
              {
                userId: 'test-id',
                email: userData.email,
                role: userData.role,
                is_admin: 0
              },
              process.env.JWT_SECRET,
              { expiresIn: '7d' }
            );

            const decoded = jwt.verify(validToken, process.env.JWT_SECRET);
            expect(decoded.exp).toBeGreaterThan(now);
          }
        ),
        { numRuns: 5 }
      );
    }, 10000);
  });
});
