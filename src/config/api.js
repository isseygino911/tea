// API Configuration
// Uses environment variables for production builds

const ENVIRONMENTS = {
  // Local development
  development: {
    baseURL: 'http://localhost:5002/api',
  },
  
  // Production
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-domain.com/api',
  },
};

// Determine active config from environment variable or default to development
const activeConfig = import.meta.env.VITE_API_ENV === 'production' ? 'production' : 'development';

// Export the configuration
export const API_CONFIG = ENVIRONMENTS[activeConfig];
export const API_BASE_URL = API_CONFIG.baseURL;

// Default export
export default API_CONFIG;
