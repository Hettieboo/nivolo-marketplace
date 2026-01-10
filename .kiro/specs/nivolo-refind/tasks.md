# Implementation Plan

**Reference Websites for Design Inspiration:**
- https://rasmus.com (clean, minimal design)
- https://www.liquidation.com (auction/marketplace layout)
- https://www.ebth.com (professional listing grids)

**MVP Specification Alignment:**
- Frontend: React with simple styling, separate hosting
- Backend: Node.js/Express/SQLite, separate hosting  
- Authentication: Email/password with JWT in localStorage
- Payments: Stripe Checkout only
- Images: Local storage in /uploads directory
- Database: SQLite local file with specified tables

# Implementation Plan

- [x] 1. Set up project structure and development environment
  - Create backend directory structure with Express.js, SQLite, and required dependencies
  - Create frontend directory structure with React and required dependencies
  - Set up package.json files with all necessary dependencies including Jest, fast-check, bcrypt, JWT, Stripe, and email service
  - Initialize SQLite database with all required tables (users, listings, bids, orders, payments, password_reset_tokens)
  - Configure environment variables for JWT secret, Stripe keys, and email service credentials
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 8.1, 10.1_

- [ ] 2. Implement user authentication system
  - [x] 2.1 Create user registration functionality
    - Implement user registration API endpoint with email/password validation
    - Add password hashing using bcrypt
    - Create JWT token generation and response handling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Write property test for user registration
    - **Property 1: User registration creates valid accounts**
    - **Validates: Requirements 1.1, 1.3**

  - [x] 2.3 Write property test for duplicate email handling
    - **Property 2: Duplicate email registration rejection**
    - **Validates: Requirements 1.2**

  - [x] 2.4 Write property test for input validation
    - **Property 3: Input validation prevents invalid registrations**
    - **Validates: Requirements 1.4, 1.5**

  - [x] 2.5 Create user login functionality
    - Implement login API endpoint with credential validation
    - Add JWT token generation for successful logins
    - Create logout functionality with token removal
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 2.6 Write property test for authentication token management
    - **Property 4: Authentication token management**
    - **Validates: Requirements 2.1, 2.3, 2.5**

  - [x] 2.7 Write property test for invalid credential rejection
    - **Property 5: Invalid credential rejection**
    - **Validates: Requirements 2.2**

  - [x] 2.8 Write property test for token expiration
    - **Property 6: Token expiration enforcement**
    - **Validates: Requirements 2.4**

- [ ] 3. Implement password reset functionality
  - [ ] 3.1 Create password reset request system
    - Implement password reset request API endpoint
    - Add secure token generation with expiration
    - Integrate transactional email service for reset emails
    - _Requirements: 3.1, 3.2_

  - [ ] 3.2 Create password reset completion system
    - Implement password reset completion API endpoint
    - Add token validation and password update functionality
    - Handle expired token rejection
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ] 3.3 Write property test for password reset lifecycle
    - **Property 7: Password reset token lifecycle**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ] 4. Implement listing management system
  - [x] 4.1 Create listing creation functionality
    - Implement listing creation API endpoint with validation
    - Add support for both fixed-price and auction listing types
    - Create image upload handling with Multer
    - Store listings in pending approval status
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 4.2 Write property test for listing creation and approval
    - **Property 8: Listing creation and approval workflow**
    - **Validates: Requirements 4.1, 5.2, 5.3**

  - [ ] 4.3 Write property test for listing type validation
    - **Property 9: Listing type validation**
    - **Validates: Requirements 4.3, 4.4**

  - [ ] 4.4 Create image upload and validation system
    - Implement image upload validation (JPG/PNG, 2-3 files, 5MB limit)
    - Add local file storage in /uploads directory
    - Create static file serving for uploaded images
    - Store image paths in database
    - _Requirements: 4.2, 4.5, 9.1, 9.2, 9.3, 9.4_

  - [ ] 4.5 Write property test for image upload validation
    - **Property 10: Image upload validation**
    - **Validates: Requirements 4.2, 4.5, 9.4**

  - [ ] 4.6 Write property test for image storage and serving
    - **Property 11: Image storage and serving**
    - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ] 5. Implement admin functionality
  - [ ] 5.1 Create admin dashboard and listing approval system
    - Implement admin dashboard with user, listing, and payment totals
    - Create listing approval/rejection API endpoints
    - Add admin authorization middleware
    - Display pending listings for admin review
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ] 5.2 Write property test for admin authorization
    - **Property 12: Admin authorization enforcement**
    - **Validates: Requirements 5.4, 5.5**

- [ ] 6. Implement marketplace browsing functionality
  - [ ] 6.1 Create listing display system
    - Implement API endpoint to fetch approved listings
    - Create listing detail view with all required information
    - Add separate display logic for auction vs fixed-price listings
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 6.2 Write property test for listing visibility control
    - **Property 13: Listing visibility control**
    - **Validates: Requirements 6.1, 6.2**

  - [ ] 6.3 Write property test for auction display and expiration
    - **Property 14: Auction display and expiration**
    - **Validates: Requirements 6.3, 6.5, 7.5**

- [ ] 7. Implement bidding system
  - [ ] 7.1 Create bidding functionality
    - Implement bid placement API endpoint with validation
    - Add bid amount validation (higher than current highest)
    - Create auction winner determination logic
    - Prevent bidding on expired auctions using server time
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 7.2 Write property test for bid validation and processing
    - **Property 15: Bid validation and processing**
    - **Validates: Requirements 7.1, 7.2, 7.3**

  - [ ] 7.3 Write property test for auction winner determination
    - **Property 16: Auction winner determination**
    - **Validates: Requirements 7.4, 8.2**

- [ ] 8. Implement payment system
  - [ ] 8.1 Create Stripe Checkout integration
    - Implement Stripe Checkout session creation
    - Add payment success/failure handling
    - Create order management with payment status tracking
    - Restrict auction payment to winning bidders only
    - Store payment records in database
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 8.2 Write property test for payment processing workflow
    - **Property 17: Payment processing workflow**
    - **Validates: Requirements 8.1, 8.3, 8.4, 8.5**

- [ ] 9. Implement email notification system
  - [ ] 9.1 Create transactional email functionality
    - Set up transactional email service integration
    - Create email templates for password reset and order confirmation
    - Add graceful error handling for email failures
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [ ] 9.2 Write property test for email notification system
    - **Property 18: Email notification system**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.5**

- [ ] 10. Create frontend React application
  - [x] 10.1 Build authentication components
    - Create login, registration, and password reset forms
    - Implement JWT token storage and management in localStorage
    - Add form validation and error handling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 10.2 Build listing management components
    - Create listing creation form with image upload
    - Add listing type selection (fixed-price vs auction)
    - Implement form validation for required fields
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 10.3 Build marketplace browsing components
    - Create listing grid view for approved listings
    - Build detailed listing view with images and pricing
    - Add different displays for auction vs fixed-price items
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 10.4 Build bidding interface
    - Create bid placement form with validation
    - Display current highest bid and time remaining
    - Show auction status and winner information
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 10.5 Build admin dashboard
    - Create admin-only dashboard with totals display
    - Build listing approval interface
    - Add user and payment management views
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Implement branding and UI consistency
  - [ ] 11.1 Add Nivolo branding elements
    - Integrate Nivolo logo across all pages
    - Add brand slogan "Sell Fast. Buy Smart. Find More. Pay Less."
    - Ensure consistent styling and professional appearance
    - _Requirements: 11.1, 11.3, 11.5_

  - [ ] 11.2 Write property test for brand consistency
    - **Property 19: Brand consistency**
    - **Validates: Requirements 11.1, 11.3, 11.5**

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Integration and deployment preparation
  - [ ] 13.1 Configure production environment settings
    - Set up environment variables for production deployment
    - Configure database persistence and uploads directory
    - Test Stripe integration in production mode
    - Verify email service configuration
    - _Requirements: All requirements for production readiness_

  - [ ] 13.2 Create deployment documentation
    - Document backend deployment requirements
    - Document frontend deployment and API configuration
    - Create environment variable reference guide
    - _Requirements: System deployment and maintenance_

- [ ] 14. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.