import api from './api';

export const productAPI = {
  // Public product endpoints (no auth required)
  getProducts: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductImages: (id) => api.get(`/products/${id}/images`),
};
