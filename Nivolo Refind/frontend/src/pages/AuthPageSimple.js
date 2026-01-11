import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPageSimple = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  // Determine initial mode based on URL path
  const getInitialMode = () => {
    const path = location.pathname;
    if (path.includes('register')) return 'register';
    return 'login';
  };
  
  const [mode, setMode] = useState(getInitialMode());

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      throw error; // Re-throw to be handled by the form
    }
  };

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      throw error; // Re-throw to be handled by the form
    }
  };

  const switchToLogin = () => {
    setMode('login');
    navigate('/auth/login', { replace: true });
  };

  const switchToRegister = () => {
    setMode('register');
    navigate('/auth/register', { replace: true });
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'register':
        return (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={switchToLogin}
          />
        );
      default:
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={switchToRegister}
            onSwitchToPasswordReset={() => {}} // Simplified for now
          />
        );
    }
  };

  return renderAuthForm();
};

export default AuthPageSimple;