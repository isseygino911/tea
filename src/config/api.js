// API Configuration
// Toggle between environments by changing the activeConfig

const ENVIRONMENTS = {
  // Local development
  development: {
    baseURL: 'http://localhost:5002/api',
  },
  
  // Production
  production: {
    baseURL: 'https://your-domain.com/api',
  },
};

// Change this to switch environments: 'development' | 'production'
const activeConfig = 'development';

// Export the configuration
export const API_CONFIG = ENVIRONMENTS[activeConfig];
export const API_BASE_URL = API_CONFIG.baseURL;

// Default export
export default API_CONFIG;
