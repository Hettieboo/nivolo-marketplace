# Nivolo Refind Backend...

Backend API for the Nivolo Refind marketplace platform.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your actual credentials:
   - JWT_SECRET: A secure secret key for JWT tokens
   - STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key
   - STRIPE_SECRET_KEY: Your Stripe secret key
   - EMAIL_* variables: Your email service credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Database

The application uses SQLite with the following tables:
- users
- listings
- bids
- orders
- payments
- password_reset_tokens

The database is automatically initialized when the server starts.

## API Endpoints

API endpoints will be documented as they are implemented in subsequent tasks....
------
