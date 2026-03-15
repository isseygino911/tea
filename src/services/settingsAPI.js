import api from './api';

export const settingsAPI = {
  // Get all settings (admin)
  getSettings: () => api.get('/settings'),
  
  // Get specific setting (admin)
  getSetting: (key) => api.get(`/settings/${key}`),
  
  // Update settings (admin)
  updateSettings: (data) => api.put('/settings', data),
  
  // Get tax rate (public)
  getTaxRate: () => api.get('/settings/tax-rate'),
};
