import api from './api';

export const addressAPI = {
  // Get all addresses
  getAddresses: () => api.get('/addresses'),
  
  // Get single address
  getAddress: (id) => api.get(`/addresses/${id}`),
  
  // Create new address
  createAddress: (data) => api.post('/addresses', data),
  
  // Update address
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  
  // Delete address
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  
  // Set as default
  setDefaultAddress: (id) => api.patch(`/addresses/${id}/default`),
};
