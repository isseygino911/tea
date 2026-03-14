import { useState, useCallback } from 'react';
import { adminAPI } from '../services/adminAPI';

export const useAdminProductController = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products (admin view - includes inactive)
  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getProducts(filters);
      setProducts(res.data.products);
      return res.data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single product
  const fetchProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getProduct(id);
      setProduct(res.data.product);
      return res.data.product;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.createProduct(data);
      setProducts(prev => [res.data.product, ...prev]);
      return res.data.product;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.updateProduct(id, data);
      setProducts(prev => 
        prev.map(p => p.id === id ? res.data.product : p)
      );
      if (product && product.id === id) {
        setProduct(res.data.product);
      }
      return res.data.product;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product]);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      await adminAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      throw err;
    }
  }, []);

  // Fetch categories and suggestions
  const fetchCategories = useCallback(async () => {
    try {
      const res = await adminAPI.getCategories();
      setCategories(res.data.categories);
      // Note: suggestions not currently returned by backend API
      // setSuggestions(res.data.suggestions || []);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return { categories: [], suggestions: [] };
    }
  }, []);

  // Get upload URL for image
  const getUploadUrl = useCallback(async (filename, contentType) => {
    try {
      const res = await adminAPI.getUploadUrl(filename, contentType);
      return res.data;
    } catch (err) {
      console.error('Failed to get upload URL:', err);
      throw err;
    }
  }, []);

  // Upload image to S3
  const uploadImage = useCallback(async (file, uploadUrl) => {
    try {
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      return true;
    } catch (err) {
      console.error('Failed to upload image:', err);
      throw err;
    }
  }, []);

  // Clear states
  const clearProducts = useCallback(() => {
    setProducts([]);
  }, []);

  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    products,
    product,
    categories,
    suggestions,
    loading,
    error,
    
    // Actions
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    getUploadUrl,
    uploadImage,
    clearProducts,
    clearProduct,
    clearError,
  };
};
