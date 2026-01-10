import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/reset-password-request', { email });
    return response.data;
  },
  
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

export const listingAPI = {
  // Will be implemented in task 10.2 and 10.3
  getListings: async () => {
    const response = await api.get('/listings');
    return response.data;
  },
  
  getListing: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },
  
  createListing: async (listingData) => {
    const response = await api.post('/listings', listingData);
    return response.data;
  }
};

export const biddingAPI = {
  // Will be implemented in task 10.4
  placeBid: async (auctionId, bidAmount) => {
    const response = await api.post('/bids', { auctionId, bidAmount });
    return response.data;
  },
  
  getBids: async (auctionId) => {
    const response = await api.get(`/bids/${auctionId}`);
    return response.data;
  }
};

export const adminAPI = {
  // Will be implemented in task 10.5
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getPendingListings: async () => {
    const response = await api.get('/admin/pending-listings');
    return response.data;
  },
  
  approveListing: async (listingId) => {
    const response = await api.put(`/listings/${listingId}/approve`);
    return response.data;
  },
  
  rejectListing: async (listingId) => {
    const response = await api.put(`/listings/${listingId}/reject`);
    return response.data;
  }
};

export default api;