import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return { user: data.user, token: data.token };
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return { user: data.user, token: data.token };
    } catch (error) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      // For now, simulate API call - will be replaced with actual API in task 3.1
      console.log('Password reset request for:', email);
      
      // Simulate successful request
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new Error('Failed to send password reset email.');
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      // For now, simulate API call - will be replaced with actual API in task 3.2
      console.log('Password reset with token:', token, 'New password length:', newPassword.length);
      
      // Simulate successful reset
      return { message: 'Password reset successful' };
    } catch (error) {
      throw new Error('Failed to reset password.');
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (optional since JWT is stateless)
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    }
    
    // Remove from localStorage and state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    requestPasswordReset,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};