# Nivolo Refind..

**Sell Fast. Buy Smart. Find More. Pay Less.**

A lightweight online marketplace MVP that enables sellers to list products as fixed-price items or auctions, while buyers can browse approved listings, place bids, or purchase items directly.

## Project Structure

```
├── backend/          # Node.js/Express API server
├── frontend/         # React frontend application
└── .kiro/specs/      # Feature specifications and implementation plan
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your actual credentials
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend application will start on `http://localhost:3000`

## Features

- **User Authentication**: Registration, login, password reset
- **Listing Management**: Create fixed-price and auction listings with image uploads
- **Admin Dashboard**: Approve/reject listings, view platform statistics
- **Marketplace Browsing**: View approved listings with detailed information
- **Bidding System**: Place bids on auction items with real-time updates
- **Payment Integration**: Stripe Checkout for secure payments
- **Email Notifications**: Transactional emails for password resets and order confirmations

## Technology Stack

### Backend
- Node.js with Express.js
- SQLite database
- JWT authentication
- Stripe payment processing
- Nodemailer for emails
- Jest + fast-check for testing

### Frontend
- React with React Router
- Axios for API communication
- React Testing Library for testing

## Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Environment Variables

See `backend/.env.example` for required environment variables including:
- JWT secret
- Stripe API keys
- Email service credentials

## Implementation Status

This project follows a spec-driven development approach. See `.kiro/specs/nivolo-refind/` for:
- `requirements.md` - Detailed feature requirements
- `design.md` - System architecture and design decisions
- `tasks.md` - Implementation task list

Current status: **Project structure and development environment set up** ✅

## License

This project is for educational and demonstration purposes.
