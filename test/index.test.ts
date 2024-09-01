import { Request, Response, NextFunction } from 'express';
import { createMaskingMiddleware } from '../src/index';

describe('Masking Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should mask sensitive data in the response based on the provided rules', () => {
    // Define masking rules
    const maskingRules = {
      emailFields: ['email'],
      passwordFields: ['password'],
    };

    // Create middleware instance
    const maskingMiddleware = createMaskingMiddleware(maskingRules)

    // Define a sample response body
    const responseBody = {
      email: 'user@example.com',
      password: 'supersecretpassword',
      username: 'testuser',
    };

    // Mock the original send function to capture the modified response
    res.send = jest.fn().mockImplementation((body) => {
      // Ensure that sensitive data is masked correctly
      const parsedBody = JSON.parse(body);
      expect(parsedBody.email).toBe('use*@*********om'); // Expected masked email
      expect(parsedBody.password).toBe('****************'); // Expected masked password
      expect(parsedBody.username).toBe('testuser'); // Non-sensitive data should remain the same
    });

    // Invoke the middleware
    maskingMiddleware(req as Request, res as Response, next);

    // Simulate sending the response
    res.send(JSON.stringify(responseBody));

    // Ensure next() is called
    expect(next).toHaveBeenCalled();
  });

  it('should handle JSON parsing errors and send the original response', () => {
    // Define masking rules
    const maskingRules = {
      emailFields: ['email'],
    };

    // Create middleware instance
    const maskingMiddleware = createMaskingMiddleware(maskingRules);

    // Invalid JSON response body (e.g., string instead of an object)
    const invalidResponseBody = 'This is not a valid JSON object';

    // Mock the original send function to capture the response
    res.send = jest.fn().mockImplementation((body) => {
      // Ensure that the original invalid response is sent
      expect(body).toBe(invalidResponseBody);
    });

    // Invoke the middleware
    maskingMiddleware(req as Request, res as Response, next);

    // Simulate sending the invalid response
    res.send(invalidResponseBody);

    // Ensure next() is called
    expect(next).toHaveBeenCalled();
  });
});
