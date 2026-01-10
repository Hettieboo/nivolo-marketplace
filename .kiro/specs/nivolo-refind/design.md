# Nivolo Refind Design Document

## Overview

Nivolo Refind is a lightweight online marketplace MVP built with a focus on simplicity, speed, and real usability. The system enables sellers to list products as fixed-price items or auctions, while buyers can browse approved listings, place bids, or make direct purchases. The platform uses a straightforward architecture with separate frontend and backend deployments, SQLite for data persistence, and minimal external dependencies.

The system prioritizes functionality over scalability, making it ideal for rapid deployment and testing of the marketplace concept. All payments flow through the platform admin, with seller settlements handled offline, simplifying the financial complexity typical of marketplace platforms.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        UI[User Interface]
        Auth[Authentication]
        Dashboard[Admin Dashboard]
    end
    
    subgraph "Backend (Node.js/Express)"
        API[REST API]
        AuthService[Auth Service]
        ListingService[Listing Service]
        BidService[Bidding Service]
        PaymentService[Payment Service]
        EmailService[Email Service]
    end
    
    subgraph "Data Layer"
        DB[(SQLite Database)]
        Files[/uploads/ Directory]
    end
    
    subgraph "External Services"
        Stripe[Stripe Checkout]
        Email[Transactional Email Service]
    end
    
    UI --> API
    Auth --> AuthService
    Dashboard --> API
    
    API --> DB
    API --> Files
    PaymentService --> Stripe
    EmailService --> Email
```

### Deployment Architecture

- **Frontend**: Deployed separately as static files with configurable backend API base URL
- **Backend**: Deployed on server with persistent storage for SQLite database and uploads directory
- **Database**: SQLite file stored locally on backend server
- **Images**: Stored in local `/uploads` directory, served as static files
- **External Services**: Stripe for payments, transactional email service for notifications

## Components and Interfaces

### Frontend Components

#### Authentication Components
- **LoginForm**: Handles user login with email/password validation
- **RegisterForm**: Manages user registration with role selection
- **PasswordResetForm**: Provides password reset request functionality
- **PasswordResetConfirm**: Handles password reset completion

#### Marketplace Components
- **ListingGrid**: Displays approved listings with filtering and search
- **ListingDetail**: Shows detailed listing view with bidding/purchase options
- **CreateListing**: Form for sellers to create new listings
- **BiddingInterface**: Real-time bidding display and bid placement

#### Admin Components
- **AdminDashboard**: Overview with totals and quick stats
- **ListingApproval**: Interface for approving/rejecting listings
- **UserManagement**: View and manage platform users
- **PaymentOverview**: Display payment records and totals

### Backend Services

#### AuthService
```typescript
interface AuthService {
  register(userData: UserRegistration): Promise<AuthResponse>
  login(credentials: LoginCredentials): Promise<AuthResponse>
  generateJWT(user: User): string
  validateJWT(token: string): Promise<User>
  requestPasswordReset(email: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
}
```

#### ListingService
```typescript
interface ListingService {
  createListing(listingData: ListingData, sellerId: string): Promise<Listing>
  getApprovedListings(): Promise<Listing[]>
  getPendingListings(): Promise<Listing[]>
  approveListing(listingId: string): Promise<void>
  rejectListing(listingId: string): Promise<void>
  uploadImages(files: File[], listingId: string): Promise<string[]>
}
```

#### BiddingService
```typescript
interface BiddingService {
  placeBid(auctionId: string, bidAmount: number, bidderId: string): Promise<Bid>
  getCurrentHighestBid(auctionId: string): Promise<Bid | null>
  validateBid(auctionId: string, bidAmount: number): Promise<boolean>
  getAuctionWinner(auctionId: string): Promise<User | null>
  isAuctionActive(auctionId: string): Promise<boolean>
}
```

#### PaymentService
```typescript
interface PaymentService {
  createCheckoutSession(orderId: string): Promise<string>
  handlePaymentSuccess(sessionId: string): Promise<void>
  recordPayment(paymentData: PaymentData): Promise<Payment>
  getPaymentRecords(): Promise<Payment[]>
}
```

## Data Models

### User Model
```typescript
interface User {
  id: string
  email: string
  password_hash: string
  role: 'admin' | 'seller' | 'buyer'
  is_admin: boolean
  created_at: Date
  updated_at: Date
}
```

### Listing Model
```typescript
interface Listing {
  id: string
  seller_id: string
  title: string
  description: string
  listing_type: 'fixed_price' | 'auction'
  price?: number
  starting_bid?: number
  auction_end_time?: Date
  status: 'pending' | 'approved' | 'rejected'
  image_paths: string[]
  created_at: Date
  updated_at: Date
}
```

### Bid Model
```typescript
interface Bid {
  id: string
  auction_id: string
  bidder_id: string
  bid_amount: number
  bid_time: Date
}
```

### Order Model
```typescript
interface Order {
  id: string
  buyer_id: string
  listing_id: string
  order_type: 'purchase' | 'auction_win'
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  created_at: Date
  updated_at: Date
}
```

### Payment Model
```typescript
interface Payment {
  id: string
  order_id: string
  stripe_session_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  payment_date: Date
}
```

### PasswordResetToken Model
```typescript
interface PasswordResetToken {
  id: string
  user_id: string
  token: string
  expires_at: Date
  used: boolean
  created_at: Date
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated to eliminate redundancy:

- Authentication properties (1.1-2.5) can be grouped into registration, login, and token management properties
- Bidding validation properties (7.1, 7.3) are redundant - one comprehensive bidding validation property covers both
- Auction expiration properties (6.5, 7.5) are identical and can be combined
- Image handling properties (9.1-9.4) can be consolidated into comprehensive image management properties

### Core Properties

**Property 1: User registration creates valid accounts**
*For any* valid user registration data, the system should create a new user account with properly hashed password and generate a JWT token
**Validates: Requirements 1.1, 1.3**

**Property 2: Duplicate email registration rejection**
*For any* email address that already exists in the system, registration attempts should be rejected with appropriate error messaging
**Validates: Requirements 1.2**

**Property 3: Input validation prevents invalid registrations**
*For any* invalid user input (malformed email, short password), the system should reject registration and provide appropriate feedback
**Validates: Requirements 1.4, 1.5**

**Property 4: Authentication token management**
*For any* valid user credentials, login should generate a JWT token, and logout should remove the token from storage
**Validates: Requirements 2.1, 2.3, 2.5**

**Property 5: Invalid credential rejection**
*For any* invalid login credentials, the system should reject authentication attempts with error messaging
**Validates: Requirements 2.2**

**Property 6: Token expiration enforcement**
*For any* expired JWT token, the system should require re-authentication before allowing protected operations
**Validates: Requirements 2.4**

**Property 7: Password reset token lifecycle**
*For any* valid email address, password reset should generate a secure token with expiration, send reset email, and allow password update only with valid tokens
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

**Property 8: Listing creation and approval workflow**
*For any* valid listing data, sellers should be able to create listings in pending status, and only admins should be able to approve or reject them
**Validates: Requirements 4.1, 5.2, 5.3**

**Property 9: Listing type validation**
*For any* listing creation, auction types should require end time and starting bid, while fixed-price types should require only price
**Validates: Requirements 4.3, 4.4**

**Property 10: Image upload validation**
*For any* image upload, the system should accept 2-3 JPG/PNG files under 5MB each and reject invalid formats or oversized files
**Validates: Requirements 4.2, 4.5, 9.4**

**Property 11: Image storage and serving**
*For any* successfully uploaded image, the system should store it locally, save the path in database, and serve it as a static file
**Validates: Requirements 9.1, 9.2, 9.3**

**Property 12: Admin authorization enforcement**
*For any* non-admin user, attempts to access admin functions should be denied, while admin users should have full access to dashboard and approval functions
**Validates: Requirements 5.4, 5.5**

**Property 13: Listing visibility control**
*For any* marketplace browsing, buyers should see only approved listings with complete information (title, description, images, pricing)
**Validates: Requirements 6.1, 6.2**

**Property 14: Auction display and expiration**
*For any* auction listing, the system should display current highest bid and time remaining, and prevent new bids after expiration
**Validates: Requirements 6.3, 6.5, 7.5**

**Property 15: Bid validation and processing**
*For any* bid attempt on an active auction, the system should accept only bids higher than current highest bid and update the auction accordingly
**Validates: Requirements 7.1, 7.2, 7.3**

**Property 16: Auction winner determination**
*For any* completed auction, the system should determine the winner based on highest bid and allow only the winner to proceed to payment
**Validates: Requirements 7.4, 8.2**

**Property 17: Payment processing workflow**
*For any* purchase attempt, the system should redirect to Stripe Checkout, mark orders as paid upon successful payment, and maintain unpaid status on failure
**Validates: Requirements 8.1, 8.3, 8.4, 8.5**

**Property 18: Email notification system**
*For any* password reset request or completed order, the system should send appropriate transactional emails and handle failures gracefully
**Validates: Requirements 10.1, 10.2, 10.3, 10.5**

**Property 19: Brand consistency**
*For any* page load, the system should display the Nivolo logo prominently and maintain brand messaging throughout the interface
**Validates: Requirements 11.1, 11.3, 11.5**

## Error Handling

### Authentication Errors
- Invalid credentials return 401 Unauthorized with clear error messages
- Expired tokens trigger automatic logout and redirect to login
- Registration failures provide specific validation error details
- Password reset failures maintain security by not revealing user existence

### Listing Management Errors
- Image upload failures provide clear size/format requirements
- Listing creation errors specify missing required fields
- Approval/rejection operations include audit logging
- Unauthorized access attempts are logged and blocked

### Bidding and Payment Errors
- Invalid bids return specific error messages (too low, auction ended)
- Payment failures maintain order integrity and allow retry
- Stripe integration errors are handled gracefully with user feedback
- Auction timing conflicts are resolved using server timestamps

### System Errors
- Database connection failures trigger appropriate fallbacks
- File system errors for image operations provide recovery options
- Email service failures don't block core functionality
- All errors are logged with sufficient detail for debugging

## Testing Strategy

### Dual Testing Approach

The system will employ both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Unit Testing Requirements

Unit tests will cover:
- Specific examples that demonstrate correct behavior
- Integration points between components
- Error handling scenarios
- Edge cases like empty inputs, boundary values, and invalid data

### Property-Based Testing Requirements

- **Testing Library**: Jest with fast-check for JavaScript/TypeScript property-based testing
- **Test Configuration**: Each property-based test will run a minimum of 100 iterations
- **Test Tagging**: Each property-based test will include a comment with the format: `**Feature: nivolo-refind, Property {number}: {property_text}**`
- **Property Implementation**: Each correctness property will be implemented by a single property-based test
- **Generator Strategy**: Smart generators will constrain inputs to valid domains (valid emails, proper image formats, realistic bid amounts)

### Testing Framework Integration

- **Frontend Testing**: React Testing Library with Jest for component testing
- **Backend Testing**: Jest with Supertest for API endpoint testing
- **Database Testing**: In-memory SQLite for isolated test runs
- **Integration Testing**: End-to-end scenarios covering complete user workflows
- **Property Testing**: fast-check generators for comprehensive input coverage

### Test Data Management

- **User Data**: Generated valid/invalid email formats, password variations, role combinations
- **Listing Data**: Various product types, price ranges, auction durations
- **Image Data**: Different file formats, sizes, and validation scenarios
- **Bidding Data**: Bid sequences, timing scenarios, amount validations
- **Payment Data**: Success/failure scenarios, amount validations

The testing strategy ensures that both specific use cases and general system properties are thoroughly validated, providing confidence in the system's correctness and reliability.