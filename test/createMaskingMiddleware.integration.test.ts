import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { createMaskingMiddleware } from '../src/index';

describe('Masking Middleware in Express App', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();

    // Define masking rules
    const maskingRules = {
      emailFields: ['email'],
      passwordFields: ['password'],
    };

    // Apply masking middleware
    app.use(createMaskingMiddleware(maskingRules));

    // Define a test route
    app.get('/test', (req: Request, res: Response) => {
      res.json({
        email: 'user@example.com',
        password: 'supersecretpassword',
        username: 'testuser',
      });
    });
  });

  it('should mask sensitive data in the API response', async () => {
    const response = await request(app)
      .get('/test')
      .set('Accept', 'application/json'); // Ensure response is interpreted as JSON

    // Expect the response to have masked data
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('use*@*********om'); // Expected masked email
    expect(response.body.password).toBe('****************'); // Expected masked password
    expect(response.body.username).toBe('testuser'); // Non-sensitive data should remain the same
  });
});
