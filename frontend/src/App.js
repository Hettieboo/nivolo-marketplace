import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/admin/AdminDashboard';

// Auth Buttons Component
const AuthButtons = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      minWidth: '200px'
    }}>
      {isAuthenticated ? (
        <>
          {user?.is_admin && (
            <a href="/admin" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              padding: '0.5rem 1rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '20px',
              fontWeight: '500',
              fontSize: '13px',
              whiteSpace: 'nowrap'
            }}>
              Admin
            </a>
          )}
          <button 
            onClick={handleLogout}
            style={{ 
              color: 'white', 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <a href="/auth?mode=signup" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            fontWeight: '500',
            fontSize: '13px',
            whiteSpace: 'nowrap'
          }}>
            Sign Up
          </a>
          <a href="/auth" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '20px',
            fontSize: '13px',
            whiteSpace: 'nowrap'
          }}>
            Sign In
          </a>
        </>
      )}
    </div>
  );
};
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      {isAuthenticated ? (
        <>
          <a href="/profile" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            padding: '0.75rem 1.5rem', 
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '25px',
            fontWeight: '500',
            fontSize: '15px'
          }}>
            👤 My Profile
          </a>
          {user?.is_admin && (
            <a href="/admin" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem', 
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '25px',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              🛠️ Admin Panel
            </a>
          )}
          <span style={{ 
            fontSize: '15px', 
            fontWeight: '500',
            opacity: 0.9
          }}>
            👋 {user?.email}
          </span>
          <button 
            onClick={handleLogout}
            style={{ 
              color: 'white', 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none',
              padding: '0.75rem 1.5rem', 
              borderRadius: '25px',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <a href="/auth?mode=signup" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            padding: '0.75rem 1.5rem', 
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '25px',
            fontWeight: '500',
            fontSize: '15px'
          }}>
            Sign Up
          </a>
          <a href="/auth" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            padding: '0.75rem 1.5rem', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '25px',
            fontWeight: '500',
            fontSize: '15px'
          }}>
            Sign In
          </a>
        </>
      )}
    </div>
  );
};

// Clean, minimal App component built from scratch
function App() {
  return (
    <Router>
      <div className="App">
        <header>
          {/* Top Header Bar */}
          <div style={{
            background: 'white',
            color: '#1a202c',
            padding: '0.75rem 2rem',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <span style={{ 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#374151'
              }}>
                📞 (555) 123-4567
              </span>
              <a href="/newsletter" style={{ 
                color: '#1a202c', 
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                border: '2px solid #667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#1a202c';
                e.target.style.transform = 'translateY(0)';
              }}>
                📧 Sign Up For Our E-Newsletter
              </a>
              <a href="/text-alerts" style={{ 
                color: '#1a202c', 
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#10b981';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#1a202c';
                e.target.style.transform = 'translateY(0)';
              }}>
                📱 GET TEXT ALERTS
              </a>
            </div>
            
            {/* Social Media Icons */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                color: '#1877f2',
                fontSize: '14px',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '2px solid #1877f2',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#1877f2';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#1877f2';
                e.target.style.transform = 'translateY(0)';
              }}>
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                color: '#e1306c',
                fontSize: '14px',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '2px solid #e1306c',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e1306c';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#e1306c';
                e.target.style.transform = 'translateY(0)';
              }}>
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
                color: '#ff0000',
                fontSize: '14px',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '2px solid #ff0000',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff0000';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ff0000';
                e.target.style.transform = 'translateY(0)';
              }}>
                YouTube
              </a>
            </div>
          </div>

          {/* Main Header */}
<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '0.75rem 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  flexWrap: 'wrap',
  gap: '0.5rem'
}}>
  {/* Logo */}
  <div style={{ display: 'flex', alignItems: 'center', minWidth: '120px' }}>
    <img 
      src="/Novolologo1.svg" 
      alt="Nivolo Refind Logo" 
      style={{ 
        height: '50px',
        width: 'auto',
        borderRadius: '4px'
      }} 
    />
  </div>

  {/* Navigation */}
  <nav style={{ 
    display: 'flex', 
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1
  }}>
    <a href="/" style={{ color: 'white', textDecoration: 'none', padding: '0.4rem 0.6rem', borderRadius: '6px', fontWeight: '500', fontSize: '12px', whiteSpace: 'nowrap' }}>Home</a>
    <a href="/blog" style={{ color: 'white', textDecoration: 'none', padding: '0.4rem 0.6rem', borderRadius: '6px', fontWeight: '500', fontSize: '12px', whiteSpace: 'nowrap' }}>Blog</a>
    <a href="/real-estate" style={{ color: 'white', textDecoration: 'none', padding: '0.4rem 0.6rem', borderRadius: '6px', fontWeight: '500', fontSize: '12px', whiteSpace: 'nowrap' }}>Buyer</a>
    <a href="/sell" style={{ color: 'white', textDecoration: 'none', padding: '0.4rem 0.6rem', borderRadius: '6px', fontWeight: '500', fontSize: '12px', whiteSpace: 'nowrap' }}>Seller</a>
    <a href="/contact" style={{ color: 'white', textDecoration: 'none', padding: '0.4rem 0.6rem', borderRadius: '6px', fontWeight: '500', fontSize: '12px', whiteSpace: 'nowrap' }}>Contact</a>
  </nav>

  {/* Auth Buttons */}
  <AuthButtons />
</div>
<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  flexWrap: 'wrap',
  gap: '1rem'
}}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/Novolologo1.svg" 
                alt="Nivolo Refind Logo" 
                style={{ 
                  height: '77px', 
                  width: 'auto',
                  borderRadius: '4px'
                }} 
              />
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="/" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Home
              </a>
              <a href="/blog" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Blog
              </a>
              <a href="/real-estate" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Buyer
              </a>
              <a href="/sell" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Seller
              </a>
              <a href="/about" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                About Us
              </a>
              <a href="/contact" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Contact Us
              </a>
              <a href="/help" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Help
              </a>
            </nav>

            {/* Auth Buttons */}
            <AuthButtons />
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/auctions" element={<AuctionPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/real-estate" element={<BuyerPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

// Buyer Page Component
const BuyerPage = () => {
  const [featuredItems, setFeaturedItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings`);
      const data = await response.json();
      
      if (response.ok) {
        // Get a mix of featured items (first 6 items)
        const featured = data.listings.slice(0, 6).map(listing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.listing_type === 'auction' ? listing.starting_bid : listing.price,
          type: listing.listing_type,
          image: listing.image_paths && listing.image_paths.length > 0 ? 
            (listing.image_paths[0].startsWith('http') ? listing.image_paths[0] : `http://localhost:5001${listing.image_paths[0]}`) :
            'https://via.placeholder.com/400x300?text=No+Image'
        }));
        setFeaturedItems(featured);
      }
    } catch (error) {
      console.error('Failed to fetch featured items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            🛒 Welcome Buyers!
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '1rem', opacity: 0.9 }}>
            Discover amazing deals on unique items, vintage treasures, and modern essentials
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8 }}>
            Shop with confidence on Nivolo Refind - your trusted marketplace for quality items at great prices
          </p>
        </div>
      </div>

      {/* Buyer Benefits Section */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a202c', textAlign: 'center', marginBottom: '3rem' }}>
          Why Buy on Nivolo Refind?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              Unique & Rare Items
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Find one-of-a-kind vintage pieces, collectibles, and rare items you won't find anywhere else. Our sellers offer carefully curated collections from around the world.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              Secure Shopping
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Shop with confidence using our secure payment system. All transactions are protected with SSL encryption and buyer protection policies.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              Auction Excitement
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Participate in live auctions and bid on exclusive items. Experience the thrill of competitive bidding and potentially win amazing deals.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              Verified Sellers
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              All our sellers are verified and rated by the community. Read reviews, check seller ratings, and buy with confidence from trusted merchants.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              Great Prices
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Find competitive prices on quality items. Whether you're looking for a bargain or a premium piece, we have options for every budget.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              Customer Support
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Our dedicated support team is here to help with any questions or issues. Get assistance with purchases, shipping, or returns whenever you need it.
            </p>
          </div>
        </div>

        {/* How to Buy Section */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '3rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', textAlign: 'center', marginBottom: '2rem' }}>
            How to Buy on Nivolo Refind
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#667eea', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                Browse & Search
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Explore our marketplace or use search filters to find exactly what you're looking for.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#667eea', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                Choose Your Method
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Buy instantly at fixed prices or participate in exciting auctions for better deals.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#667eea', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                Secure Checkout
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Complete your purchase with our secure payment system and track your order.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#667eea', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                Enjoy Your Purchase
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Receive your item and enjoy! Leave a review to help other buyers in our community.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Items */}
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', textAlign: 'center', marginBottom: '2rem' }}>
            Featured Items for Buyers
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading featured items...</p>
            </div>
          ) : featuredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3>No items available</h3>
              <p>Check back later for new featured items!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {featuredItems.map(item => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <a 
              href="/"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                padding: '1rem 3rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Browse All Items
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Start Shopping?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of satisfied buyers who have found amazing deals on Nivolo Refind
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/"
              style={{
                background: 'white',
                color: '#10b981',
                textDecoration: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🛒 Shop Now
            </a>
            <a 
              href="/auctions"
              style={{
                background: 'transparent',
                color: 'white',
                textDecoration: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'inline-block',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#10b981';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔨 View Auctions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page Component
const ContactPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Name, email, and message are required');
      }

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Thank you for your message! We\'ll get back to you soon.' });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
            Get in touch with our team - we'd love to hear from you!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1.5rem' }}>
              Send us a message
            </h2>

            {message.text && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: message.type === 'success' ? '#065f46' : '#991b1b'
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1.5rem' }}>
                Get in Touch
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>📞</span>
                  <strong style={{ color: '#1a202c' }}>Phone</strong>
                </div>
                <p style={{ color: '#64748b', marginLeft: '2rem' }}>(555) 123-4567</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>📧</span>
                  <strong style={{ color: '#1a202c' }}>Email</strong>
                </div>
                <p style={{ color: '#64748b', marginLeft: '2rem' }}>contact@nivolo.com</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>📍</span>
                  <strong style={{ color: '#1a202c' }}>Address</strong>
                </div>
                <p style={{ color: '#64748b', marginLeft: '2rem' }}>
                  123 Marketplace Street<br />
                  Commerce City, CC 12345
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🕒</span>
                  <strong style={{ color: '#1a202c' }}>Business Hours</strong>
                </div>
                <p style={{ color: '#64748b', marginLeft: '2rem' }}>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1.5rem' }}>
                Follow Us
              </h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1rem',
                  background: '#1877f2',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                  Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                  Instagram
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1rem',
                  background: '#ff0000',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Slideshow Component
const VideoSlideshow = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  // High-quality product images for slideshow
  const slides = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop&q=80', // Watch
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&h=1080&fit=crop&q=80', // Sunglasses
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=80', // Headphones
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920&h=1080&fit=crop&q=80', // Handbag
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop&q=80', // Shoes
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop&q=80', // Guitar
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0
    }}>
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${slide})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
            animation: index === currentSlide ? 'slowZoom 4s ease-in-out' : 'none'
          }}
        />
      ))}
      
      {/* Slide Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '6rem',
        right: '2rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 1
      }}>
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Auction Page Component
const AuctionPage = () => {
  const [auctions, setAuctions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings`);
      const data = await response.json();
      
      if (response.ok) {
        // Filter and transform auction data with current bids
        const auctionItems = await Promise.all(
          data.listings
            .filter(listing => listing.listing_type === 'auction')
            .map(async (listing) => {
              let currentPrice = listing.starting_bid;
              
              // Fetch current highest bid
              try {
                const bidsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/bids/${listing.id}`);
                if (bidsResponse.ok) {
                  const bidsData = await bidsResponse.json();
                  if (bidsData.bids && bidsData.bids.length > 0) {
                    currentPrice = Math.max(...bidsData.bids.map(b => b.bid_amount));
                  }
                }
              } catch (error) {
                console.log('Failed to fetch bids for auction:', listing.id);
              }
              
              return {
                id: listing.id,
                title: listing.title,
                description: listing.description,
                price: currentPrice,
                starting_bid: listing.starting_bid,
                type: 'auction',
                timeLeft: listing.auction_end_time ? formatTimeRemaining(listing.auction_end_time) : null,
                image: listing.image_paths && listing.image_paths.length > 0 ? 
                  (listing.image_paths[0].startsWith('http') ? listing.image_paths[0] : `http://localhost:5001${listing.image_paths[0]}`) :
                  'https://via.placeholder.com/400x300?text=No+Image',
                category: 'Auction'
              };
            })
        );
        
        setAuctions(auctionItems);
      }
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Auction Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          🔨 Auctions
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '1rem', opacity: 0.9 }}>
          Bid on exclusive items and rare finds
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join the excitement of live bidding and discover unique treasures
        </p>
      </div>

      {/* Auctions Grid */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c' }}>Active Auctions</h2>
          <button 
            onClick={() => {
              setLoading(true);
              fetchAuctions();
            }}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Auctions'}
          </button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ fontSize: '1.1rem' }}>Loading auctions...</p>
          </div>
        ) : auctions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔨</div>
            <h3>No active auctions</h3>
            <p>Check back later for new auction items!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {auctions.map(auction => (
              <ProductCard key={auction.id} item={auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// HomePage Component - Integrated Marketplace
const HomePage = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Video Background Slideshow */}
        <VideoSlideshow />
        
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 50%, rgba(15, 52, 96, 0.8) 100%)',
          zIndex: 1
        }} />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Discover Extraordinary Items
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '1rem', opacity: 0.9 }}>
            From vintage treasures to modern essentials
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 3rem' }}>
            Join thousands of collectors, sellers, and smart shoppers in our curated marketplace.
          </p>
        </div>
        
        {/* Live Statistics */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 2,
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '2rem', 
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>24</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Items Available</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>12</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Live Auctions</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1,250</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Active Users</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>3,420</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Items Sold</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ padding: '2rem', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <a 
            href="/auctions"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.3s ease',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
            }}
          >
            🔨 Go to Auctions
          </a>
        </div>
      </div>

      {/* Marketplace Grid */}
      <MarketplaceGrid />

      {/* Trust Indicators */}
      <TrustSection />
    </div>
  );
};

// Marketplace Grid Component
const MarketplaceGrid = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings`);
      const data = await response.json();
      
      if (response.ok) {
        // Transform API data and show only fixed-price items on homepage
        const transformedProducts = data.listings
          .filter(listing => listing.listing_type === 'fixed_price') // Only show buy-now items
          .map(listing => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            type: 'buy-now',
            timeLeft: null,
            image: listing.image_paths && listing.image_paths.length > 0 ? 
              (listing.image_paths[0].startsWith('http') ? listing.image_paths[0] : `http://localhost:5001${listing.image_paths[0]}`) :
              'https://via.placeholder.com/400x300?text=No+Image',
            category: 'General'
          }));
        
        setProducts(transformedProducts);
      } else {
        // Fallback to sample data if API fails
        setProducts(getSampleProducts());
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      // Fallback to sample data
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getSampleProducts = () => [];

  if (loading) {
    return (
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c' }}>Buy Now Items</h2>
        <select style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <option>Sort by: Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Ending Soon</option>
        </select>
      </div>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3>No items available</h3>
          <p>Be the first to list an item on our marketplace!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button 
          onClick={() => {
            setLoading(true);
            fetchListings();
          }}
          disabled={loading}
          style={{
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 3rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh Items'}
        </button>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ item }) => {
  const handleCardClick = () => {
    window.location.href = `/product/${item.id}`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: item.type === 'auction' ? '0 8px 25px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: item.type === 'auction' ? '2px solid rgba(239, 68, 68, 0.2)' : 'none',
      position: 'relative'
    }}
    onClick={handleCardClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = item.type === 'auction' ? '0 12px 35px rgba(239, 68, 68, 0.25)' : '0 8px 25px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = item.type === 'auction' ? '0 8px 25px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}>
      {/* Auction Glow Effect */}
      {item.type === 'auction' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #f97316, #ef4444)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite'
        }} />
      )}
      
      <div style={{ position: 'relative' }}>
        <img 
          src={item.image} 
          alt={item.title}
          style={{ width: '100%', height: '220px', objectFit: 'cover' }}
        />
        
        {/* Enhanced Type Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: item.type === 'auction' ? 
            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {item.type === 'auction' ? '🔨 LIVE AUCTION' : '💰 BUY NOW'}
        </div>
        
        {/* Auction Timer */}
        {item.timeLeft && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backdropFilter: 'blur(10px)'
          }}>
            ⏰ {item.timeLeft}
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.75rem' }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.2rem', 
          fontWeight: '700', 
          color: '#1a202c',
          lineHeight: '1.3'
        }}>
          {item.title}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              fontWeight: '500'
            }}>
              {item.type === 'auction' ? 'Current bid' : 'Price'}
            </span>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold', 
              color: item.type === 'auction' ? '#ef4444' : '#10b981',
              marginBottom: '0.5rem'
            }}>
              ${item.price}
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (item.type === 'auction') {
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('Please sign in to place a bid');
                  return;
                }
                
                const bidAmount = prompt(`Current bid: $${item.price}\nEnter your bid amount:`);
                if (bidAmount && parseFloat(bidAmount) > item.price) {
                  fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/bids`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      auctionId: item.id,
                      bidAmount: parseFloat(bidAmount)
                    })
                  }).then(response => {
                    if (response.ok) {
                      alert('Bid placed successfully!');
                      window.location.reload();
                    } else {
                      response.json().then(error => {
                        alert(error.error || 'Failed to place bid');
                      });
                    }
                  }).catch(() => alert('Error placing bid'));
                } else if (bidAmount) {
                  alert(`Bid must be higher than current bid of $${item.price}`);
                }
              } else {
                window.location.href = `/checkout/${item.id}`;
              }
            }}
            style={{
              background: item.type === 'auction' ? 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            {item.type === 'auction' ? '🔨 Bid Now' : '🛒 Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Trust Section Component
const TrustSection = () => {
  return (
    <div style={{ background: 'white', padding: '4rem 2rem', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem', color: '#1a202c' }}>
          Why Choose Nivolo Refind?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Secure Payments</h3>
            <p style={{ color: '#64748b' }}>SSL encrypted transactions</p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Verified Sellers</h3>
            <p style={{ color: '#64748b' }}>All sellers are authenticated</p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Buyer Protection</h3>
            <p style={{ color: '#64748b' }}>Money-back guarantee</p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>24/7 Support</h3>
            <p style={{ color: '#64748b' }}>Always here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Page Component
const AuthPage = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  // Check if already authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/sell'; // Redirect to sell page if already logged in
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      // Store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setMessage({ type: 'success', text: `${isLogin ? 'Login' : 'Registration'} successful! Redirecting...` });
      
      // Redirect to sell page after successful auth
      setTimeout(() => {
        window.location.href = '/sell';
      }, 1500);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: 'white',
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {isLogin ? 'Sign in to your Nivolo account' : 'Join Nivolo Refind today'}
        </p>
        
        {/* Test Credentials Info */}
        <div style={{ 
          background: '#f0f4ff', 
          border: '1px solid #667eea', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          fontSize: '14px',
          color: '#374151'
        }}>
          <strong>Test Credentials:</strong><br />
          📧 admin@nivolo.com<br />
          📧 seller@example.com<br />
          🔑 Nivolo@123
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#065f46' : '#991b1b'
          }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            style={{
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            style={{
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <p style={{ marginTop: '1rem', color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#667eea', 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Sell Page Component - Full Listing Creation Form
const SellPage = () => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    listing_type: 'fixed_price',
    price: '',
    starting_bid: '',
    auction_end_time: ''
  });
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  // Check authentication on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setMessage({ type: 'error', text: 'Maximum 3 images allowed' });
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please sign in to create a listing');
      }

      // Validate form
      if (!formData.title || !formData.description) {
        throw new Error('Title and description are required');
      }

      if (formData.listing_type === 'fixed_price' && !formData.price) {
        throw new Error('Price is required for fixed-price listings');
      }

      if (formData.listing_type === 'auction' && (!formData.starting_bid || !formData.auction_end_time)) {
        throw new Error('Starting bid and end time are required for auctions');
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Call backend API
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }
      
      setMessage({ type: 'success', text: 'Listing created successfully! It will be reviewed by our team before going live.' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        listing_type: 'fixed_price',
        price: '',
        starting_bid: '',
        auction_end_time: ''
      });
      setImages([]);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          padding: '3rem', 
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
            Sign In Required
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
            You need to sign in to create listings and start selling on Nivolo Refind.
          </p>
          <a 
            href="/auth" 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'inline-block'
            }}
          >
            Sign In to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
            Create Your Listing
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
            List your items and reach thousands of buyers on Nivolo Refind
          </p>
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                Basic Information
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title for your item"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item in detail - condition, features, history, etc."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Listing Type */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                Listing Type
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div 
                  style={{
                    padding: '1.5rem',
                    border: formData.listing_type === 'fixed_price' ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.listing_type === 'fixed_price' ? '#f0f4ff' : 'white'
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, listing_type: 'fixed_price' }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="fixed_price"
                      checked={formData.listing_type === 'fixed_price'}
                      onChange={handleInputChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>💰 Fixed Price</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Set a fixed price for immediate purchase
                  </p>
                </div>

                <div 
                  style={{
                    padding: '1.5rem',
                    border: formData.listing_type === 'auction' ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.listing_type === 'auction' ? '#f0f4ff' : 'white'
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, listing_type: 'auction' }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="auction"
                      checked={formData.listing_type === 'auction'}
                      onChange={handleInputChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>🔨 Auction</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Let buyers bid on your item
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                Pricing
              </h3>
              
              {formData.listing_type === 'fixed_price' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{
                      width: '200px',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Starting Bid ($) *
                    </label>
                    <input
                      type="number"
                      name="starting_bid"
                      value={formData.starting_bid}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Auction End Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="auction_end_time"
                      value={formData.auction_end_time}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                Images
              </h3>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                background: '#f9fafb'
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Click to upload images
                  </p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    Upload up to 3 images (JPG, PNG) - Max 5MB each
                  </p>
                </label>
                {images.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
                      {images.length} image(s) selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: message.type === 'success' ? '#065f46' : '#991b1b'
              }}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div style={{ marginTop: '3rem', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
            📋 Listing Guidelines
          </h3>
          <ul style={{ color: '#64748b', lineHeight: '1.6' }}>
            <li>All listings are reviewed by our team before going live</li>
            <li>Use clear, high-quality images that show your item accurately</li>
            <li>Write detailed descriptions including condition, size, and any flaws</li>
            <li>Price competitively by researching similar items</li>
            <li>For auctions, set realistic starting bids and appropriate end times</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer style={{ background: '#1a202c', color: 'white', padding: '3rem 2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Company Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <img 
                src="/Novolologo1.svg" 
                alt="Nivolo Refind Logo" 
                style={{ 
                  height: '40px', 
                  width: 'auto', 
                  marginRight: '0.75rem',
                  borderRadius: '4px'
                }} 
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                Nivolo Refind
              </h3>
            </div>
            <p style={{ color: '#a0aec0', marginBottom: '1rem', lineHeight: '1.6' }}>
              Sell Fast. Buy Smart. Find More. Pay Less.
            </p>
            <p style={{ color: '#a0aec0', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Your trusted marketplace for unique items, vintage treasures, and modern essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Browse Items', 'Start Selling', 'How It Works', 'Success Stories'].map(link => (
                <li key={link} style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link} style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{ 
          borderTop: '1px solid #4a5568', 
          paddingTop: '2rem', 
          textAlign: 'center',
          color: '#a0aec0'
        }}>
          © 2026 Nivolo Refind. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('listings');
  const [userListings, setUserListings] = React.useState([]);
  const [userBids, setUserBids] = React.useState([]);
  const [userPurchases, setUserPurchases] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      setLoading(true);
      
      // Fetch user listings
      const listingsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings/user/my-listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        setUserListings(listingsData.listings || []);
      }

      // Fetch user purchases
      const purchasesResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/payment/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setUserPurchases(purchasesData.orders || []);
      }

      // Fetch user bids
      const bidsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/bids/user/my-bids`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        setUserBids(bidsData.bids || []);
      }
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          padding: '3rem', 
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
            Sign In Required
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
            You need to sign in to view your profile and manage your listings.
          </p>
          <a 
            href="/auth" 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'inline-block'
            }}
          >
            Sign In to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white'
            }}>
              👤
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                {user?.email}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Member since {new Date().toLocaleDateString()}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ 
                  background: user?.role === 'admin' ? '#ef4444' : '#10b981', 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '15px', 
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  USER
                </span>
                {user?.is_admin && (
                  <span style={{ 
                    background: '#f59e0b', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '15px', 
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('listings')}
              style={{
                flex: 1,
                padding: '1.5rem',
                border: 'none',
                background: activeTab === 'listings' ? '#667eea' : 'transparent',
                color: activeTab === 'listings' ? 'white' : '#64748b',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: activeTab === 'listings' ? '12px 0 0 0' : '0'
              }}
            >
              📝 My Listings ({userListings.length})
            </button>
            <button
              onClick={() => setActiveTab('bids')}
              style={{
                flex: 1,
                padding: '1.5rem',
                border: 'none',
                background: activeTab === 'bids' ? '#667eea' : 'transparent',
                color: activeTab === 'bids' ? 'white' : '#64748b',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: activeTab === 'bids' ? '0' : '0'
              }}
            >
              🔨 My Bids ({userBids.length})
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              style={{
                flex: 1,
                padding: '1.5rem',
                border: 'none',
                background: activeTab === 'purchases' ? '#667eea' : 'transparent',
                color: activeTab === 'purchases' ? 'white' : '#64748b',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: activeTab === 'purchases' ? '0 12px 0 0' : '0'
              }}
            >
              🛒 My Purchases ({userPurchases.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading your data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'listings' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>
                        My Listings
                      </h2>
                      <a 
                        href="/sell"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          textDecoration: 'none',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        + Create New Listing
                      </a>
                    </div>
                    
                    {userListings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                          No listings yet
                        </h3>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
                          Start selling by creating your first listing!
                        </p>
                        <a 
                          href="/sell"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '25px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}
                        >
                          Create Your First Listing
                        </a>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {userListings.map(listing => (
                          <ListingCard key={listing.id} listing={listing} isOwner={true} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bids' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '2rem' }}>
                  My Bids
                </h2>
                
                {userBids.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔨</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                      No bids yet
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
                      Start bidding on auction items to see them here!
                    </p>
                    <a 
                      href="/"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '25px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}
                    >
                      Browse Auctions
                    </a>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {userBids.map(bid => (
                      <BidCard key={bid.id} bid={bid} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'purchases' && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '2rem' }}>
                      My Purchases
                    </h2>
                    
                    {userPurchases.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>
                          No purchases yet
                        </h3>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
                          Browse our marketplace to find amazing items!
                        </p>
                        <a 
                          href="/"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '25px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}
                        >
                          Browse Marketplace
                        </a>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {userPurchases.map(purchase => (
                          <PurchaseCard key={purchase.id} purchase={purchase} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#065f46' : '#991b1b'
          }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

// Listing Card Component for Profile
const ListingCard = ({ listing, isOwner }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      case 'sold': return '#6366f1';
      default: return '#64748b';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return '✅ Live';
      case 'pending': return '⏳ Under Review';
      case 'rejected': return '❌ Rejected';
      case 'sold': return '🎉 Sold';
      default: return status;
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  // Parse image paths if they're stored as JSON string
  const imagePaths = typeof listing.image_paths === 'string' 
    ? JSON.parse(listing.image_paths || '[]') 
    : (listing.image_paths || []);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      <div style={{ position: 'relative' }}>
        {imagePaths && imagePaths.length > 0 ? (
          <img 
            src={getImageUrl(imagePaths[0])} 
            alt={listing.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '200px', 
            background: '#f1f5f9', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#64748b'
          }}>
            📷
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: getStatusColor(listing.status),
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {getStatusText(listing.status)}
        </div>
        
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: listing.listing_type === 'auction' ? '#ef4444' : '#10b981',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {listing.listing_type === 'auction' ? '🔨 AUCTION' : '💰 FIXED PRICE'}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1a202c' }}>
          {listing.title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
          {listing.description && listing.description.length > 100 ? listing.description.substring(0, 100) + '...' : listing.description}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {listing.listing_type === 'auction' ? 'Starting bid' : 'Price'}
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
              ${listing.listing_type === 'auction' ? parseFloat(listing.starting_bid || 0).toFixed(2) : parseFloat(listing.price || 0).toFixed(2)}
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'right' }}>
            <div>Created:</div>
            <div>{new Date(listing.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Action buttons for listing owner */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => window.location.href = `/product/${listing.id}`}
              style={{
                flex: 1,
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              View Details
            </button>
            <button 
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this listing?')) {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings/${listing.id}`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                      window.location.reload();
                    } else {
                      alert('Failed to delete listing');
                    }
                  } catch (error) {
                    alert('Error deleting listing');
                  }
                }
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Bid Card Component for Profile
const BidCard = ({ bid }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  const getStatusColor = () => {
    if (bid.auction_ended) {
      return bid.is_winning ? '#10b981' : '#ef4444';
    }
    return bid.is_winning ? '#10b981' : '#f59e0b';
  };

  const getStatusText = () => {
    if (bid.auction_ended) {
      return bid.is_winning ? '🏆 WON' : '❌ LOST';
    }
    return bid.is_winning ? '🥇 WINNING' : '⏳ OUTBID';
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      <div style={{ position: 'relative' }}>
        {bid.image_paths && bid.image_paths.length > 0 ? (
          <img 
            src={getImageUrl(bid.image_paths[0])} 
            alt={bid.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '200px', 
            background: '#f1f5f9', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#64748b'
          }}>
            🔨
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: getStatusColor(),
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {getStatusText()}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1a202c' }}>
          {bid.title}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Your Bid</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#667eea' }}>
              ${bid.bid_amount.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Current Highest</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: bid.is_winning ? '#10b981' : '#ef4444' }}>
              ${bid.current_highest_bid.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          <strong>Auction:</strong> {bid.auction_ended ? 'Ended' : 'Active'}
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          <strong>Bid placed:</strong> {new Date(bid.bid_time).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// Purchase Card Component for Profile
const PurchaseCard = ({ purchase }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      <div style={{ position: 'relative' }}>
        {purchase.image_paths && purchase.image_paths.length > 0 ? (
          <img 
            src={getImageUrl(purchase.image_paths[0])} 
            alt={purchase.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '200px', 
            background: '#f1f5f9', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#64748b'
          }}>
            📷
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: purchase.status === 'completed' ? '#10b981' : '#f59e0b',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {purchase.status === 'completed' ? '✅ COMPLETED' : '⏳ PENDING'}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1a202c' }}>
          {purchase.title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
          {purchase.description && purchase.description.length > 100 ? purchase.description.substring(0, 100) + '...' : purchase.description}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Purchase Price
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
              ${parseFloat(purchase.amount).toFixed(2)}
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'right' }}>
            <div>Purchased:</div>
            <div>{new Date(purchase.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          <strong>Seller:</strong> {purchase.seller_email ? purchase.seller_email.split('@')[0] : 'Unknown'}
        </div>
      </div>
    </div>
  );
};

// Product Details Page Component
const ProductDetailsPage = () => {
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    // Get product ID from URL
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    
    if (productId) {
      fetchProductDetails(productId);
    }
  }, []);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings/${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Fetch current highest bid for auctions
        if (data.listing.listing_type === 'auction') {
          const bidsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/bids/${productId}`);
          if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            const highestBid = bidsData.bids.length > 0 ? Math.max(...bidsData.bids.map(b => b.bid_amount)) : data.listing.starting_bid;
            data.listing.current_highest_bid = highestBid;
          }
        }
        setProduct(data.listing);
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (error) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Auction ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  const nextImage = () => {
    const images = product.image_paths && product.image_paths.length > 0 ? product.image_paths : ['https://via.placeholder.com/600x400?text=No+Image'];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = product.image_paths && product.image_paths.length > 0 ? product.image_paths : ['https://via.placeholder.com/600x400?text=No+Image'];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😞</div>
          <h2 style={{ color: '#1a202c', marginBottom: '1rem' }}>Product Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  const images = product.image_paths && product.image_paths.length > 0 ? product.image_paths : ['https://via.placeholder.com/600x400?text=No+Image'];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          {/* Image Slideshow */}
          <div>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img 
                src={getImageUrl(images[currentImageIndex])}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                  >
                    ‹
                  </button>
                  
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '15px',
                  fontSize: '0.875rem'
                }}>
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((image, index) => (
                  <img 
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${product.title} ${index + 1}`}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: currentImageIndex === index ? '3px solid #667eea' : '1px solid #e2e8f0',
                      opacity: currentImageIndex === index ? 1 : 0.7,
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div style={{
              background: product.listing_type === 'auction' ? '#ef4444' : '#10b981',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              {product.listing_type === 'auction' ? '🔨 AUCTION' : '💰 BUY NOW'}
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {product.listing_type === 'auction' ? 'Current Highest Bid' : 'Price'}
                </span>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                  ${product.listing_type === 'auction' ? 
                    (product.current_highest_bid || product.starting_bid) : 
                    product.price}
                </div>
                {product.listing_type === 'auction' && (
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                    Starting bid: ${product.starting_bid}
                  </div>
                )}
              </div>
            </div>

            {product.listing_type === 'auction' && product.auction_end_time && (
              <div style={{ 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '2rem' 
              }}>
                <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
                  ⏰ Time Remaining
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#92400e' }}>
                  {formatTimeRemaining(product.auction_end_time)}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
                Description
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '1rem' }}>
                {product.description}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
                Seller Information
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#667eea', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {product.seller_email ? product.seller_email[0].toUpperCase() : 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1a202c' }}>
                    {product.seller_email ? product.seller_email.split('@')[0] : 'Seller'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Verified Seller
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button 
                onClick={async () => {
                  if (product.listing_type === 'auction') {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      alert('Please sign in to place a bid');
                      return;
                    }
                    
                    const bidAmount = prompt('Enter your bid amount:');
                    if (bidAmount && parseFloat(bidAmount) > 0) {
                      try {
                        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/bids`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            auctionId: product.id,
                            bidAmount: parseFloat(bidAmount)
                          })
                        });
                        
                        if (response.ok) {
                          alert('Bid placed successfully!');
                          window.location.reload();
                        } else {
                          const error = await response.json();
                          alert(error.error || 'Failed to place bid');
                        }
                      } catch (error) {
                        alert('Error placing bid');
                      }
                    }
                  } else {
                    window.location.href = `/checkout/${product.id}`;
                  }
                }}
                style={{
                  background: product.listing_type === 'auction' ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                {product.listing_type === 'auction' ? 'Place Bid' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = () => {
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [billingInfo, setBillingInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentMethod, setPaymentMethod] = React.useState('card');

  React.useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/auth';
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Get product ID from URL
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    
    if (productId) {
      fetchProductDetails(productId);
    }
  }, []);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/listings/${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.listing.listing_type === 'auction') {
          setError('This item is an auction and cannot be purchased directly');
          return;
        }
        setProduct(data.listing);
        // Pre-fill email from user data
        setBillingInfo(prev => ({
          ...prev,
          email: JSON.parse(localStorage.getItem('user')).email
        }));
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (error) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const subtotal = parseFloat(product.price);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = 9.99;
    return subtotal + tax + shipping;
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Validate form
      const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
      for (const field of requiredFields) {
        if (!billingInfo[field]) {
          throw new Error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
      }

      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please sign in to complete purchase');
      }

      // Get product ID from URL
      const pathParts = window.location.pathname.split('/');
      const productId = pathParts[pathParts.length - 1];

      // Step 1: Create payment intent (mock for now)
      const paymentIntentResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/payment/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: productId,
          billingInfo: billingInfo
        })
      });

      const paymentIntentData = await paymentIntentResponse.json();
      
      if (!paymentIntentResponse.ok) {
        throw new Error(paymentIntentData.error || 'Failed to create payment intent');
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Confirm payment and create order
      const confirmResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentData.paymentIntentId,
          listingId: productId,
          billingInfo: billingInfo
        })
      });

      const confirmData = await confirmResponse.json();
      
      if (!confirmResponse.ok) {
        throw new Error(confirmData.error || 'Failed to complete purchase');
      }

      // Success! Order created in database
      setOrderComplete(true);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150x150?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  // Common styles object to ensure consistency
  const styles = {
    page: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    backButton: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#374151',
      fontSize: '14px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: '0 0 2rem 0'
    },
    gridLayout: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '3rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1a202c',
      marginBottom: '1rem'
    },
    inputGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: 'white',
      color: '#1a202c'
    },
    button: {
      width: '100%',
      padding: '1rem 2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      border: 'none'
    },
    primaryButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    disabledButton: {
      backgroundColor: '#9ca3af',
      color: 'white',
      cursor: 'not-allowed'
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ color: '#1a202c', marginBottom: '1rem' }}>Checkout Error</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
            <button 
              onClick={() => window.history.back()}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                width: 'auto'
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ 
            textAlign: 'center', 
            backgroundColor: 'white', 
            padding: '3rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            maxWidth: '500px' 
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Order Complete!</h2>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Thank you for your purchase! Your order has been confirmed.
            </p>
            <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0369a1' }}>
                Order confirmation has been sent to {billingInfo.email}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  width: 'auto'
                }}
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => window.location.href = '/profile'}
                style={{
                  ...styles.button,
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  width: 'auto'
                }}
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => window.history.back()}
            style={styles.backButton}
          >
            ← Back
          </button>
          <h1 style={styles.title}>
            Checkout
          </h1>
        </div>

        <div style={styles.gridLayout}>
          {/* Checkout Form */}
          <div style={styles.card}>
            {/* Billing Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={styles.sectionTitle}>
                Billing Information
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={billingInfo.firstName}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={billingInfo.lastName}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={billingInfo.email}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  style={styles.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={billingInfo.state}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={billingInfo.zipCode}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={styles.sectionTitle}>
                Payment Method
              </h2>
              
              <div style={{ border: '2px solid #e1e5e9', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="card" style={{ fontSize: '16px', fontWeight: '500', color: '#1a202c' }}>
                    💳 Credit/Debit Card
                  </label>
                </div>
                
                {paymentMethod === 'card' && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                      🔒 Secure payment processing powered by Stripe
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#64748b' }}>
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              style={{
                ...styles.button,
                ...(processing ? styles.disabledButton : styles.primaryButton)
              }}
            >
              {processing ? 'Processing...' : `Complete Purchase - $${calculateTotal().toFixed(2)}`}
            </button>
          </div>

          {/* Order Summary */}
          <div style={{ ...styles.card, height: 'fit-content' }}>
            <h2 style={styles.sectionTitle}>
              Order Summary
            </h2>

            {/* Product Details */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem', 
              paddingBottom: '1.5rem', 
              borderBottom: '1px solid #e2e8f0' 
            }}>
              <img 
                src={getImageUrl(product.image_paths && product.image_paths[0])}
                alt={product.title}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#1a202c' }}>
                  {product.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                  Sold by: {product.seller_email ? product.seller_email.split('@')[0] : 'Seller'}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>${parseFloat(product.price).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Shipping:</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>$9.99</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Tax (8%):</span>
                <span style={{ fontWeight: '500', color: '#1a202c' }}>${(parseFloat(product.price) * 0.08).toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a202c' }}>Total:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '8px', 
              padding: '1rem', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#0369a1', fontWeight: '500' }}>
                Secure Checkout
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#0369a1' }}>
                SSL encrypted & PCI compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;