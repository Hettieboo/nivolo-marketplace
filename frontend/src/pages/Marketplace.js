import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../services/api';
import './Marketplace.css';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'fixed_price', 'auction'

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listingAPI.getListings();
      console.log('API Response:', response); // Debug log
      setListings(response.listings || []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.listing_type === filter;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getImageUrl = (imagePaths) => {
    if (!imagePaths || imagePaths.length === 0) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    // If it's a Cloudinary URL, use it directly
    if (imagePaths[0].startsWith('http')) {
      return imagePaths[0];
    }
    // Otherwise, it's from uploads folder - hardcoded Railway URL
    return `https://diligent-encouragement-production.up.railway.app${imagePaths[0]}`;
  };

  if (loading) {
    return (
      <div className="marketplace-container">
        <div className="loading">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-container">
        <div className="error">
          {error}
          <button onClick={fetchListings} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h1>Marketplace</h1>
        <p>Discover unique items from verified sellers</p>
      </div>

      <div className="marketplace-filters">
        <button 
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          All Items ({listings.length})
        </button>
        <button 
          className={filter === 'fixed_price' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('fixed_price')}
        >
          Buy Now
        </button>
        <button 
          className={filter === 'auction' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('auction')}
        >
          Auctions
        </button>
      </div>

      {filteredListings.length === 0 ? (
        <div className="no-listings">
          <p>No listings found. Found {listings.length} total listings.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {filteredListings.map(listing => (
            <Link to={`/listing/${listing.id}`} key={listing.id} className="listing-card">
              <div className="listing-image">
                <img src={getImageUrl(listing.image_paths)} alt={listing.title} />
                <span className={`listing-type ${listing.listing_type}`}>
                  {listing.listing_type === 'auction' ? '🔨 Auction' : '💰 Buy Now'}
                </span>
              </div>
              <div className="listing-content">
                <h3>{listing.title}</h3>
                <p className="listing-description">{listing.description}</p>
                <div className="listing-footer">
                  {listing.listing_type === 'fixed_price' ? (
                    <span className="price">{formatPrice(listing.price)}</span>
                  ) : (
                    <span className="price">Starting bid: {formatPrice(listing.starting_bid)}</span>
                  )}
                  <span className="seller">by {listing.seller_email}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
