import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import PasswordResetForm from '../components/auth/PasswordResetForm';
import PasswordResetConfirm from '../components/auth/PasswordResetConfirm';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, requestPasswordReset, resetPassword } = useAuth();
  
  // Determine initial mode based on URL path
  const getInitialMode = () => {
    const path = location.pathname;
    if (path.includes('register')) return 'register';
    if (path.includes('reset-password')) return 'reset-password';
    if (path.includes('reset-confirm')) return 'reset-confirm';
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

  const handlePasswordResetRequest = async (email) => {
    try {
      await requestPasswordReset(email);
    } catch (error) {
      throw error; // Re-throw to be handled by the form
    }
  };

  const handlePasswordReset = async (token, newPassword) => {
    try {
      await resetPassword(token, newPassword);
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

  const switchToPasswordReset = () => {
    setMode('reset-password');
    navigate('/auth/reset-password', { replace: true });
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
      case 'reset-password':
        return (
          <PasswordResetForm
            onPasswordResetRequest={handlePasswordResetRequest}
            onSwitchToLogin={switchToLogin}
          />
        );
      case 'reset-confirm':
        return (
          <PasswordResetConfirm
            onPasswordReset={handlePasswordReset}
            onSwitchToLogin={switchToLogin}
          />
        );
      default:
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={switchToRegister}
            onSwitchToPasswordReset={switchToPasswordReset}
          />
        );
    }
  };

  return renderAuthForm();
};

export default AuthPage;