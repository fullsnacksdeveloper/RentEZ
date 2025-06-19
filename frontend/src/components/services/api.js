// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';



// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
{/*const apiRequest = async (endpoint, options = {}, useAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: useAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
    ...options
  };

  try {
    const response = await fetch(url, config);
    //const data = await response.json();
    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = {}; // fallback when response has no body
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};*/}

const apiRequest = async (endpoint, options = {}, useAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get base headers
  const token = localStorage.getItem('token');
  const baseHeaders = {
    'Content-Type': 'application/json',
    ...(useAuth && token ? { Authorization: `Bearer ${token}` } : {})
  };

  // Properly merge headers to avoid duplication
  const config = {
    ...options,
    headers: {
      ...baseHeaders,
      ...(options.headers || {}) // Allow options to override base headers
    }
  };

  console.log('Request config:', {
    url,
    method: config.method,
    headers: config.headers,
    bodyLength: config.body ? config.body.length : 0
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', {
      endpoint,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};



// Authentication API
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    },false),


  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    },false),

  verifyToken: () => 
    apiRequest('/auth/verify-token'),

  forgotPassword: (email) => 
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (token, password) => 
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    }),

  updateProfile: (profileData) => 
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
};

// Properties API
export const propertiesAPI = {
  getProperties: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/properties?${queryString}`);
  },

  getProperty: (id) => 
    apiRequest(`/properties/${id}`),

  createProperty: (propertyData) => 
    apiRequest('/listing', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    }),

  updateProperty: (id, propertyData) => 
    apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData)
    }),

  deleteProperty: (id) => 
    apiRequest(`/properties/${id}`, {
      method: 'DELETE'
    }),

  uploadImages: (id, formData) => 
    apiRequest(`/properties/${id}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    }),

  searchProperties: (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    return apiRequest(`/properties/search?${queryString}`);
  },

  getRecommendations: (userId) => 
    apiRequest(`/properties/recommendations/${userId}`),

  rateProperty: (propertyId, rating) => 
    apiRequest(`/properties/${propertyId}/rate`, {
      method: 'POST',
      body: JSON.stringify(rating)
    })
};

// Applications API
export const applicationsAPI = {
  submitApplication: (applicationData) => 
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    }),

  getApplications: (userId, userType) => 
    apiRequest(`/applications?userId=${userId}&userType=${userType}`),

  getApplication: (id) => 
    apiRequest(`/applications/${id}`),

  updateApplicationStatus: (id, status, feedback = '') => 
    apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback })
    }),

  getBackgroundCheck: (applicationId) => 
    apiRequest(`/applications/${applicationId}/background-check`),

  getReliabilityScore: (userId) => 
    apiRequest(`/users/${userId}/reliability-score`)
};

// Messages API
export const messagesAPI = {
  getConversations: (userId) => 
    apiRequest(`/messages/conversations/${userId}`),

  getMessages: (conversationId) => 
    apiRequest(`/messages/conversation/${conversationId}`),

  sendMessage: (messageData) => 
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    }),

  markAsRead: (messageId) => 
    apiRequest(`/messages/${messageId}/read`, {
      method: 'PUT'
    })
};

// Premium API
export const premiumAPI = {
  getSubscriptionPlans: () => 
    apiRequest('/premium/plans'),

  subscribe: (planId, paymentData) => 
    apiRequest('/premium/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId, ...paymentData })
    }),

  cancelSubscription: (subscriptionId) => 
    apiRequest(`/premium/cancel/${subscriptionId}`, {
      method: 'DELETE'
    }),

  getSubscriptionStatus: (userId) => 
    apiRequest(`/premium/status/${userId}`)
};

// Admin API
export const adminAPI = {
  getPendingListings: () => 
    apiRequest('/admin/listings/pending'),

  verifyListing: (listingId, status, feedback = '') => 
    apiRequest(`/admin/listings/${listingId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback })
    }),

  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users?${queryString}`);
  },

  updateUserStatus: (userId, status) => 
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  getDashboardStats: () => 
    apiRequest('/admin/dashboard/stats')
};

// Analytics API
export const analyticsAPI = {
  getMarketTrends: (location) => 
    apiRequest(`/analytics/market-trends?location=${location}`),

  getPricingRecommendations: (propertyData) => 
    apiRequest('/analytics/pricing-recommendations', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    }),

  getSearchInsights: (userId) => 
    apiRequest(`/analytics/search-insights/${userId}`)
};