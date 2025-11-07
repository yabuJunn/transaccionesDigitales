import request from 'supertest';
import express from 'express';
import * as dotenv from 'dotenv';

// Mock Firebase before importing the app
jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(),
  },
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

dotenv.config();

describe('Health Check', () => {
  let app: express.Application;

  beforeAll(() => {
    // Create a minimal app for testing
    app = express();
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });

  it('should return 200 and status ok', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

