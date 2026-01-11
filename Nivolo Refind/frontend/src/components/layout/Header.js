import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img 
              src="/Nivolologo.jpeg" 
              alt="Nivolo Logo" 
              className="logo-image"
            />
            <div className="logo-text">
              <h1>Nivolo Refind</h1>
              <p>Sell Fast. Buy Smart. Find More. Pay Less.</p>
            </div>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/marketplace" className="nav-link">
            Marketplace
          </Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">
                Hello, {user?.email}
              </span>
              
              <Link to="/sell" className="nav-link">
                Sell Item
              </Link>
              
              {user?.is_admin && (
                <Link to="/admin" className="nav-link admin-link">
                  Admin
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth/login" className="auth-button login">
                Sign In
              </Link>
              <Link to="/auth/register" className="auth-button register">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;