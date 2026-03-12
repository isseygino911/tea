import { useState, useCallback } from 'react';
import { adminAPI } from '../services/adminAPI';

export const useProductController = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getStoreProducts(filters);
      setProducts(res.data.products || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getStoreProducts({ featured: true });
      setProducts(res.data.products || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch featured products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await adminAPI.getStoreCategories();
      setCategories(res.data.categories || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      throw err;
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getStoreProduct(id);
      setProduct(res.data.product || null);
      setProductImages(res.data.images || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    categories,
    product,
    productImages,
    loading,
    error,
    fetchProducts,
    fetchFeatured,
    fetchCategories,
    fetchProductById,
  };
};
