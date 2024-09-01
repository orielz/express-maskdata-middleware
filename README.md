# express-maskdata-middleware

`express-maskdata-middleware` is an Express middleware that allows you to mask sensitive data in API responses. This is useful for protecting sensitive information such as email addresses, passwords, and other personal data in responses sent by your API.

The middleware is built on top of the `maskdata` package and allows you to easily specify which fields in your JSON response should be masked.

## Features

- Mask sensitive data such as emails, passwords, phone numbers, etc.
- Easily configurable rules to define what fields should be masked.
- Simple integration with existing Express applications.

## Installation

You can install the package using npm or yarn:

```bash
npm install express-maskdata-middleware
```

or

```bash
yarn add express-maskdata-middleware
```

## Usage

To use the middleware in your Express app, simply import it, define your masking rules, and apply the middleware to your routes.

Here's an example of how to use the middleware:

```typescript
import express from 'express';
import { createMaskingMiddleware } from 'express-maskdata-middleware';

const app = express();

// Define your masking rules
const maskingRules = {
  emailFields: ['email'],
  passwordFields: ['password'],
};

// Apply the masking middleware to all routes
app.use(createMaskingMiddleware(maskingRules));

app.get('/user', (req, res) => {
  res.json({
    email: 'user@example.com',
    password: 'supersecretpassword',
    username: 'testuser',
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

In this example, the middleware will mask the `email` and `password` fields in the JSON response, based on the rules defined in `maskingRules`.

### Masking Options

The middleware leverages the `maskdata` package and supports several masking options. Here are some of the key options you can use:

- **emailFields**: An array of field names in your response that contain email addresses to be masked.
- **passwordFields**: An array of field names in your response that contain passwords to be masked.
- **phoneFields**: An array of field names in your response that contain phone numbers to be masked.
- **ssnFields**: An array of field names in your response that contain SSNs (Social Security Numbers) to be masked.
- **cardFields**: An array of field names in your response that contain credit card numbers to be masked.

You can configure these options by passing them as an object when you create the middleware.

```typescript
const maskingRules = {
  emailFields: ['email'],
  passwordFields: ['password'],
  phoneFields: ['phoneNumber'],
  ssnFields: ['ssn'],
  cardFields: ['creditCard'],
};
```

## Testing

Jest tests are set up to run with `npm test` or `yarn test`.

We include both unit tests for the middleware logic and integration tests that demonstrate the middleware in action within a real Express app.

For example, we test that sensitive data is masked correctly when making actual HTTP requests to the Express server.

Here is an example of an integration test:

```typescript
import express from 'express';
import request from 'supertest';
import { createMaskingMiddleware } from '../src/index';

describe('Masking Middleware in Express App', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();

    const maskingRules = {
      emailFields: ['email'],
      passwordFields: ['password'],
    };

    app.use(createMaskingMiddleware(maskingRules));

    app.get('/test', (req, res) => {
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
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('use*@*********om'); // Expected masked email
    expect(response.body.password).toBe('****************'); // Expected masked password
    expect(response.body.username).toBe('testuser'); // Non-sensitive data should remain the same
  });
});
```

## Commands

### Development

To run the project in watch mode, use:

```bash
npm start # or yarn start
```

This will build the project to `/dist` and watch for changes.

### Build

To do a one-off build, use:

```bash
npm run build # or yarn build
```

### Tests

To run the tests:

```bash
npm test # or yarn test
```

### Bundle Analysis

You can analyze the bundle size using the following commands:

```bash
npm run size
npm run analyze
```

## Continuous Integration

### GitHub Actions

Two GitHub Actions are configured:

- `main`: Installs dependencies, lints, tests, and builds the project on every push.
- `size`: Comments on pull requests with a bundle size comparison using `size-limit`.

## Publishing to NPM

When you're ready to publish your package to npm, you can use [np](https://github.com/sindresorhus/np) for a smooth publishing experience.

```bash
npx np
```

This will handle version bumping, tagging, and publishing to npm.

## Folder Structure

Here's the structure of the project:

```txt
/src
  index.ts        # The main middleware implementation
/test
  index.test.ts   # Unit tests for the middleware
  createMaskingMiddleware.integration.test.ts  # Integration tests with a real Express app
.gitignore
package.json
README.md         # This file
tsconfig.json
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
