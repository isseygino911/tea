import api from './api';

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Products
  getProducts: (params) => api.get('/admin/products', { params }),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getCategories: () => api.get('/admin/products/categories'),
  getUploadUrl: (filename, contentType) => api.post('/admin/products/upload-url', { filename, contentType }),
  
  // Public products (for storefront)
  getStoreProducts: (params) => api.get('/products', { params }),
  getStoreFeaturedProducts: () => api.get('/products/featured'),
  getStoreProduct: (id) => api.get(`/products/${id}`),
  getStoreCategories: () => api.get('/products/categories'),
  
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  
  // Customers
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getCustomer: (id) => api.get(`/admin/customers/${id}`),
};
