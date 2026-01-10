import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !user?.is_admin) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>Access Denied</h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          You don't have permission to access this page. Admin privileges are required.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;