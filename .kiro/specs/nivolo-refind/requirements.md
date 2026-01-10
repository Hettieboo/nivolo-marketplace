# Requirements Document

## Introduction

Nivolo Refind is a lightweight online marketplace MVP that enables sellers to list products as fixed-price items or auctions, while buyers can browse approved listings, place bids, or purchase items directly. The platform focuses on speed, simplicity, and real usability with payments collected by the platform admin and seller settlements handled offline.

## Glossary

- **Nivolo_System**: The complete Nivolo Refind marketplace platform including frontend, backend, and database
- **Admin**: Platform administrator with approval rights and dashboard access
- **Seller**: Registered user who can create and manage product listings
- **Buyer**: Registered user who can view listings, place bids, and make purchases
- **Listing**: A product entry that can be either fixed-price or auction-based
- **Auction**: A time-limited listing where buyers place competing bids
- **Fixed_Price_Listing**: A listing with a set price for immediate purchase
- **Bid**: An offer amount placed by a buyer on an auction listing
- **Order**: A purchase transaction created after successful payment
- **JWT**: JSON Web Token used for user authentication
- **Reset_Token**: Secure token generated for password reset functionality
- **Brand_Logo**: The Nivolo company logo used across the platform interface

## Requirements

### Requirement 1

**User Story:** As a new user, I want to register with email and password, so that I can access the marketplace as either a seller or buyer.

#### Acceptance Criteria

1. WHEN a user submits valid registration data THEN the Nivolo_System SHALL create a new user account with hashed password
2. WHEN a user submits duplicate email during registration THEN the Nivolo_System SHALL reject the registration and display an error message
3. WHEN a user registers successfully THEN the Nivolo_System SHALL generate a JWT token and store it in localStorage
4. WHEN a user provides invalid email format THEN the Nivolo_System SHALL validate the input and prevent account creation
5. WHEN a user provides a password shorter than minimum length THEN the Nivolo_System SHALL reject the registration with appropriate feedback

### Requirement 2

**User Story:** As a registered user, I want to log in with my credentials, so that I can access my account and marketplace features.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials THEN the Nivolo_System SHALL authenticate the user and generate a JWT token
2. WHEN a user submits invalid credentials THEN the Nivolo_System SHALL reject the login attempt and display an error message
3. WHEN a user logs in successfully THEN the Nivolo_System SHALL store the JWT token in localStorage
4. WHEN a user's JWT token expires THEN the Nivolo_System SHALL require re-authentication
5. WHEN a user logs out THEN the Nivolo_System SHALL remove the JWT token from localStorage

### Requirement 3

**User Story:** As a user who forgot my password, I want to reset it using my email, so that I can regain access to my account.

#### Acceptance Criteria

1. WHEN a user requests password reset with valid email THEN the Nivolo_System SHALL generate a secure reset token with expiration
2. WHEN a reset token is generated THEN the Nivolo_System SHALL send a reset email with the reset link
3. WHEN a user clicks a valid reset link THEN the Nivolo_System SHALL allow password update
4. WHEN a user submits new password via reset link THEN the Nivolo_System SHALL hash and save the new password
5. WHEN a reset token expires THEN the Nivolo_System SHALL reject password reset attempts using that token

### Requirement 4

**User Story:** As a seller, I want to create product listings with images and pricing details, so that I can sell my items on the marketplace.

#### Acceptance Criteria

1. WHEN a seller creates a listing with required fields THEN the Nivolo_System SHALL save the listing in pending approval status
2. WHEN a seller uploads images for a listing THEN the Nivolo_System SHALL accept 2-3 JPG or PNG files under 5MB each
3. WHEN a seller selects auction type THEN the Nivolo_System SHALL require auction end time and starting bid
4. WHEN a seller selects fixed-price type THEN the Nivolo_System SHALL require a fixed price amount
5. WHEN image upload exceeds size limit THEN the Nivolo_System SHALL reject the upload and display error message

### Requirement 5

**User Story:** As an admin, I want to approve or reject seller listings, so that I can maintain quality control on the marketplace.

#### Acceptance Criteria

1. WHEN an admin views pending listings THEN the Nivolo_System SHALL display all listings awaiting approval
2. WHEN an admin approves a listing THEN the Nivolo_System SHALL make the listing publicly visible to buyers
3. WHEN an admin rejects a listing THEN the Nivolo_System SHALL update the listing status and notify the seller
4. WHEN a non-admin user attempts to access approval functions THEN the Nivolo_System SHALL deny access
5. WHEN an admin accesses the dashboard THEN the Nivolo_System SHALL display user totals, listing totals, and payment totals

### Requirement 6

**User Story:** As a buyer, I want to view approved listings and their details, so that I can find products I want to purchase.

#### Acceptance Criteria

1. WHEN a buyer browses the marketplace THEN the Nivolo_System SHALL display only approved listings
2. WHEN a buyer views a listing THEN the Nivolo_System SHALL show title, description, images, and pricing information
3. WHEN a buyer views an auction listing THEN the Nivolo_System SHALL display current highest bid and time remaining
4. WHEN a buyer views a fixed-price listing THEN the Nivolo_System SHALL display the purchase price
5. WHEN an auction end time passes THEN the Nivolo_System SHALL prevent new bids on that listing

### Requirement 7

**User Story:** As a buyer, I want to place bids on auction items, so that I can compete to purchase items at favorable prices.

#### Acceptance Criteria

1. WHEN a buyer places a bid on an active auction THEN the Nivolo_System SHALL validate the bid is higher than current highest bid
2. WHEN a buyer places a valid bid THEN the Nivolo_System SHALL update the auction with the new highest bid
3. WHEN a buyer places a bid lower than current highest THEN the Nivolo_System SHALL reject the bid and display error message
4. WHEN an auction ends THEN the Nivolo_System SHALL determine the winning bidder based on highest bid
5. WHEN current server time exceeds auction end time THEN the Nivolo_System SHALL prevent new bids on that auction

### Requirement 8

**User Story:** As a buyer, I want to purchase items and make payments, so that I can complete transactions and receive my purchases.

#### Acceptance Criteria

1. WHEN a buyer purchases a fixed-price item THEN the Nivolo_System SHALL redirect to Stripe Checkout for payment
2. WHEN a buyer wins an auction THEN the Nivolo_System SHALL allow only the winning bidder to proceed to payment
3. WHEN payment is completed successfully THEN the Nivolo_System SHALL mark the order as paid in the database
4. WHEN payment fails THEN the Nivolo_System SHALL maintain the order in unpaid status
5. WHEN payment is processed THEN the Nivolo_System SHALL store payment records in the database

### Requirement 9

**User Story:** As the system, I want to handle image storage and serving, so that product listings can display visual content to users.

#### Acceptance Criteria

1. WHEN images are uploaded THEN the Nivolo_System SHALL store them locally in the uploads directory
2. WHEN images are requested THEN the Nivolo_System SHALL serve them as static files from the backend
3. WHEN image paths are stored THEN the Nivolo_System SHALL save the file paths in the database
4. WHEN invalid image formats are uploaded THEN the Nivolo_System SHALL reject non-JPG and non-PNG files
5. WHEN the uploads directory is accessed THEN the Nivolo_System SHALL ensure persistent storage across deployments

### Requirement 10

**User Story:** As the system, I want to send transactional emails, so that users receive important notifications like password resets.

#### Acceptance Criteria

1. WHEN a password reset is requested THEN the Nivolo_System SHALL send a reset email via transactional email service
2. WHEN an order is completed THEN the Nivolo_System SHALL optionally send order confirmation email
3. WHEN email sending fails THEN the Nivolo_System SHALL log the error but continue processing
4. WHEN transactional email service is configured THEN the Nivolo_System SHALL use SMTP or API credentials
5. WHEN email templates are rendered THEN the Nivolo_System SHALL include relevant user and transaction data

### Requirement 11

**User Story:** As a user, I want to see consistent branding and professional design, so that I have confidence in the marketplace platform.

#### Acceptance Criteria

1. WHEN a user visits any page THEN the Nivolo_System SHALL display the Nivolo logo prominently
2. WHEN the platform loads THEN the Nivolo_System SHALL apply consistent styling across all pages
3. WHEN users interact with the interface THEN the Nivolo_System SHALL maintain the "Sell Fast. Buy Smart. Find More. Pay Less." brand messaging
4. WHEN images are displayed THEN the Nivolo_System SHALL ensure proper aspect ratios and professional presentation
5. WHEN the logo file is referenced THEN the Nivolo_System SHALL serve it from the correct file path