const request = require('supertest');
const app = require('../server');

describe('Server Setup', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.message).toBe('Nivolo Refind API is running');
  });
});