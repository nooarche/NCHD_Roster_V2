import { API_BASE } from '../utils/constants';

/**
 * API service layer for backend communication
 */

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Posts API
export const postsApi = {
  getAll: () => apiCall('/posts'),
  
  getById: (id) => apiCall(`/posts/${id}`),
  
  create: (data) => apiCall('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/posts/${id}`, {
    method: 'DELETE',
  }),
};

// Groups API
export const groupsApi = {
  getAll: () => apiCall('/groups'),
  
  getById: (id) => apiCall(`/groups/${id}`),
  
  create: (data) => apiCall('/groups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/groups/${id}`, {
    method: 'DELETE',
  }),
};

// Roster API
export const rosterApi = {
  getShifts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/roster/shifts${queryString ? '?' + queryString : ''}`);
  },
  
  createShift: (data) => apiCall('/roster/shifts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateShift: (id, data) => apiCall(`/roster/shifts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteShift: (id) => apiCall(`/roster/shifts/${id}`, {
    method: 'DELETE',
  }),
  
  generateRoster: (params) => apiCall('/roster/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  }),
  
  validateEWTD: (userId) => apiCall(`/roster/validate/${userId}`),
};

// Health check
export const healthApi = {
  check: () => apiCall('/health'),
};

// ============================================
// frontend/src/ErrorBoundary.jsx
// ============================================
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { colors } from './utils/constants';
import { Button } from './components/atoms/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center" 
          style={{ backgroundColor: colors.background }}
        >
          <div 
            className="bg-white rounded-lg border p-8 max-w-md" 
            style={{ borderColor: colors.grey200 }}
          >
            <AlertCircle 
              size={48} 
              style={{ color: colors.error }} 
              className="mx-auto mb-4" 
            />
            <h2 
              className="text-xl font-semibold mb-2 text-center" 
              style={{ color: colors.text }}
            >
              Something went wrong
            </h2>
            <p 
              className="text-sm text-center mb-4" 
              style={{ color: colors.grey600 }}
            >
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              style={{ width: '100%' }}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
