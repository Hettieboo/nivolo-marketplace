import React, { useState, useEffect } from 'react';
import './ListingGrid.css';

const ListingGrid = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings`);
      const data = await response.json();
      
      if (response.ok) {
        setListings(data.listings);
      } else {
        setError(data.error || 'Failed to fetch listings');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Auction ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getFilteredAndSortedListings = () => {
    let filtered = listings;
    
    // Filter by type
    if (filter === 'auctions') {
      filtered = listings.filter(listing => listing.listing_type === 'auction');
    } else if (filter === 'buy-now') {
      filtered = listings.filter(listing => listing.listing_type === 'fixed_price');
    }
    
    // Sort listings
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceA = a.listing_type === 'auction' ? a.starting_bid : a.price;
          const priceB = b.listing_type === 'auction' ? b.starting_bid : b.price;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.listing_type === 'auction' ? a.starting_bid : a.price;
          const priceB2 = b.listing_type === 'auction' ? b.starting_bid : b.price;
          return priceB2 - priceA2;
        case 'ending-soon':
          if (a.listing_type === 'auction' && b.listing_type === 'auction') {
            return new Date(a.auction_end_time) - new Date(b.auction_end_time);
          }
          return 0;
        default: // newest
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  };

  if (loading) {
    return (
      <div className="marketplace-page">
        <div className="loading">Loading marketplace...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const filteredListings = getFilteredAndSortedListings();

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <div className="header-content">
          <h1>Marketplace</h1>
          <p className="tagline">Sell Fast. Buy Smart. Find More. Pay Less.</p>
          <div className="marketplace-stats">
            <div className="stat-item">
              <span className="stat-number">{listings.length}</span>
              <span className="stat-label">Items Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{listings.filter(l => l.listing_type === 'auction').length}</span>
              <span className="stat-label">Live Auctions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{listings.filter(l => l.listing_type === 'fixed_price').length}</span>
              <span className="stat-label">Buy Now Items</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="marketplace-filters">
        <div className="filter-section">
          <div className="filter-group">
            <label>Filter by:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Items</option>
              <option value="auctions">Auctions Only</option>
              <option value="buy-now">Buy Now Only</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="ending-soon">Ending Soon</option>
            </select>
          </div>
        </div>
        
        <div className="results-count">
          Showing {filteredListings.length} of {listings.length} items
        </div>
      </div>
      
      <div className="marketplace-content">
        {filteredListings.length === 0 ? (
          <div className="no-listings">
            <div className="no-listings-icon">📦</div>
            <h3>No items found</h3>
            <p>Try adjusting your filters or check back later for new listings!</p>
          </div>
        ) : (
          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="listing-image">
                  <img 
                    src={JSON.parse(listing.image_paths)[0]}
                    alt={listing.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className={`listing-type-badge ${listing.listing_type}`}>
                    {listing.listing_type === 'auction' ? (
                      <>
                        <span className="badge-icon">🔨</span>
                        <span>Auction</span>
                      </>
                    ) : (
                      <>
                        <span className="badge-icon">💰</span>
                        <span>Buy Now</span>
                      </>
                    )}
                  </div>
                  {listing.listing_type === 'auction' && (
                    <div className="time-remaining-overlay">
                      {formatTimeRemaining(listing.auction_end_time)}
                    </div>
                  )}
                </div>
                
                <div className="listing-content">
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-description">
                    {listing.description.length > 120 
                      ? listing.description.substring(0, 120) + '...'
                      : listing.description
                    }
                  </p>
                  
                  <div className="listing-price-section">
                    {listing.listing_type === 'fixed_price' ? (
                      <div className="fixed-price">
                        <span className="price-label">Price</span>
                        <span className="price">{formatPrice(listing.price)}</span>
                      </div>
                    ) : (
                      <div className="auction-price">
                        <span className="price-label">Starting Bid</span>
                        <span className="starting-bid">{formatPrice(listing.starting_bid)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="listing-footer">
                    <div className="listing-seller">
                      <span className="seller-avatar">👤</span>
                      <span className="seller-name">{listing.seller_email.split('@')[0]}</span>
                    </div>
                    
                    <div className="listing-actions">
                      {listing.listing_type === 'fixed_price' ? (
                        <button className="btn-primary">
                          <span>Buy Now</span>
                        </button>
                      ) : (
                        <button className="btn-auction">
                          <span>Place Bid</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingGrid;