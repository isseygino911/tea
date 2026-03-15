// API Configuration

const ENVIRONMENTS = {
  // Local development
  development: {
    baseURL: 'http://localhost:5002/api',
  },
  
  // Production
  production: {
    baseURL: 'https://api.ophieliu.com/api',
  },
};

// Determine active config from environment variable or default to development
const activeConfig = 'development'
// import.meta.env.VITE_API_ENV === 'production' ? 'production' : 'development';

// Export the configuration
export const API_CONFIG = ENVIRONMENTS[activeConfig];
export const API_BASE_URL = API_CONFIG.baseURL;

// Default export
export default API_CONFIG;
