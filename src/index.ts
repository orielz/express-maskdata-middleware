import { Request, Response, NextFunction } from 'express';
import { maskJSON2, JsonMask2Configs } from 'maskdata';

// Define the type for masking rules based on `JsonMask2Configs`
type MaskingRules = JsonMask2Configs;

// Function to create the masking middleware with error handling
export const createMaskingMiddleware = (rules: MaskingRules) => {
  // Middleware to modify the response and mask data
  return (req: Request, res: Response, next: NextFunction): void => {
    // Store the original `res.send` function
    const originalSend = res.send;

    // Override `res.send` to intercept and modify the response body
    res.send = function (body: any) {
      try {
        // Check if the body is a JSON object or string that can be parsed as JSON
        if (typeof body === 'object' || (typeof body === 'string' && body.startsWith('{') && body.endsWith('}'))) {
          let jsonResponse: Record<string, any>;

          // Attempt to parse the response body as JSON if it's a string
          try {
            jsonResponse = typeof body === 'string' ? JSON.parse(body) : body;
          } catch (err) {
            console.error('Error parsing JSON response:', err);
            // Send the original response if parsing fails
            return originalSend.call(this, body);
          }

          // Mask the data using the provided rules
          let maskedResponse: Record<string, any>;
          try {
            maskedResponse = maskJSON2(jsonResponse, rules);
          } catch (err) {
            console.error('Error masking response:', err);
            // Send the original response if masking fails
            return originalSend.call(this, body);
          }

          // Send the masked response
          return originalSend.call(this, JSON.stringify(maskedResponse));
        }

        // If the response isn't JSON, send it as-is
        return originalSend.call(this, body);
      } catch (err) {
        console.error('Unexpected error in masking middleware:', err);
        // If any unexpected error occurs, send the original response
        return originalSend.call(this, body);
      }
    };

    // Call the next middleware or route handler
    next();
  };
};
