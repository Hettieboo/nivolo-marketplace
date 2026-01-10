const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const listingService = require('../services/listingService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/listings - Get approved listings
router.get('/', async (req, res) => {
  try {
    const listings = await listingService.getApprovedListings();
    res.status(200).json({
      listings: listings
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// POST /api/listings - Create new listing (requires authentication)
router.post('/', authenticateToken, upload.array('images', 3), [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 1, max: 2000 }),
  body('listing_type').isIn(['fixed_price', 'auction']),
  body('price').optional().isFloat({ min: 0 }),
  body('starting_bid').optional().isFloat({ min: 0 }),
  body('auction_end_time').optional().isISO8601()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const sellerId = req.user.userId;
    const listingData = req.body;
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      listingData.image_paths = JSON.stringify(imagePaths);
    } else {
      // Use placeholder image if no images uploaded
      listingData.image_paths = JSON.stringify(['https://via.placeholder.com/400x300?text=No+Image']);
    }
    
    const listing = await listingService.createListing(listingData, sellerId);
    
    res.status(201).json({
      message: 'Listing created successfully',
      listing: listing
    });
    
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// GET /api/listings/pending - Get pending listings (admin only)
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listings = await listingService.getPendingListings();
    res.status(200).json({
      listings: listings
    });
  } catch (error) {
    console.error('Get pending listings error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// PUT /api/listings/:id/approve - Approve listing (admin only)
router.put('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listingId = req.params.id;
    const result = await listingService.approveListing(listingId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// GET /api/listings/user/my-listings - Get current user's listings
router.get('/user/my-listings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listings = await listingService.getUserListings(userId);
    
    res.status(200).json({
      listings: listings
    });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// GET /api/listings/user/my-purchases - Get current user's purchases
router.get('/user/my-purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const purchases = await listingService.getUserPurchases(userId);
    
    res.status(200).json({
      purchases: purchases
    });
  } catch (error) {
    console.error('Get user purchases error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// GET /api/listings/:id - Get single listing details
router.get('/:id', async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await listingService.getListingById(listingId);
    
    res.status(200).json({
      listing: listing
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(404).json({
      error: error.message
    });
  }
});

// Routes will be implemented in later tasks
// GET /api/listings/:id - task 6.1
// POST /api/listings/:id/images - task 4.4
// PUT /api/listings/:id/reject - task 5.1

// DELETE /api/listings/:id - Delete listing (owner or admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user.userId;
    const isAdmin = req.user.is_admin;
    
    const result = await listingService.deleteListing(listingId, userId, isAdmin);
    res.status(200).json(result);
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;