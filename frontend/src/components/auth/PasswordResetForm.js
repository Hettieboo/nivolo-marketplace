import React, { useState } from 'react';
import './AuthForms.css';

const PasswordResetForm = ({ onPasswordResetRequest, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onPasswordResetRequest(formData.email);
      setIsSuccess(true);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-header">
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to {formData.email}</p>
          </div>
          
          <div className="success-message">
            <p>Please check your email and click the reset link to create a new password.</p>
            <p>If you don't see the email, check your spam folder.</p>
          </div>
          
          <div className="auth-switch">
            <button 
              type="button" 
              className="auth-button secondary"
              onClick={onSwitchToLogin}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email address and we'll send you a reset link</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}
          
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            Remember your password?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;