import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Discover Extraordinary Items</h1>
            <p className="hero-subtitle">From vintage treasures to modern essentials</p>
            <p className="hero-description">
              Join thousands of collectors, sellers, and smart shoppers in our curated marketplace. 
              Find unique items, bid on exclusive auctions, or sell your treasures to a global community.
            </p>
            <div className="hero-actions">
              {!isAuthenticated ? (
                <>
                  <Link to="/marketplace" className="btn-hero primary">
                    Explore Marketplace
                  </Link>
                  <Link to="/auth/register" className="btn-hero secondary">
                    Start Selling
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/marketplace" className="btn-hero primary">
                    Browse Items
                  </Link>
                  <Link to="/sell" className="btn-hero secondary">
                    List an Item
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">15</div>
              <div className="stat-label">Items Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">Live Auctions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1,250</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3,420</div>
              <div className="stat-label">Items Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            <div className="category-card electronics">
              <div className="category-icon">📱</div>
              <h3>Electronics</h3>
              <p>Latest gadgets and tech</p>
            </div>
            <div className="category-card fashion">
              <div className="category-icon">👗</div>
              <h3>Fashion</h3>
              <p>Designer clothes & accessories</p>
            </div>
            <div className="category-card collectibles">
              <div className="category-icon">🎨</div>
              <h3>Collectibles</h3>
              <p>Rare finds and antiques</p>
            </div>
            <div className="category-card home">
              <div className="category-icon">🏠</div>
              <h3>Home & Garden</h3>
              <p>Furniture and decor</p>
            </div>
            <div className="category-card sports">
              <div className="category-icon">⚽</div>
              <h3>Sports</h3>
              <p>Equipment and memorabilia</p>
            </div>
            <div className="category-card books">
              <div className="category-icon">📚</div>
              <h3>Books & Media</h3>
              <p>Rare books and vinyl</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Nivolo Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-icon">🔍</div>
              <h3>Discover</h3>
              <p>Browse thousands of unique items from trusted sellers worldwide</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-icon">💰</div>
              <h3>Bid or Buy</h3>
              <p>Place bids on auctions or purchase items instantly at fixed prices</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-icon">🚚</div>
              <h3>Secure Payment</h3>
              <p>Complete your purchase with our secure payment system</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-icon">📦</div>
              <h3>Receive</h3>
              <p>Get your items delivered safely to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-indicators">
            <div className="trust-item">
              <div className="trust-icon">🔒</div>
              <h4>Secure Payments</h4>
              <p>SSL encrypted transactions</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">✅</div>
              <h4>Verified Sellers</h4>
              <p>All sellers are authenticated</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🛡️</div>
              <h4>Buyer Protection</h4>
              <p>Money-back guarantee</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📞</div>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;