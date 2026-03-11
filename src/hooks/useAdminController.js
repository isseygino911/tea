import { useState, useCallback } from 'react';
import { adminAPI } from '../services/adminAPI';

export const useAdminController = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getProducts(filters);
      setProducts(res.data.products || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData, imageFiles) => {
    setLoading(true);
    try {
      // 1. Get presigned URLs for images
      const uploadPromises = imageFiles.map(file => 
        adminAPI.getUploadUrl(file.name, file.type)
      );
      const uploadResponses = await Promise.all(uploadPromises);
      
      // 2. Upload to S3 directly
      await Promise.all(imageFiles.map((file, i) => 
        fetch(uploadResponses[i].data.url, { 
          method: 'PUT', 
          body: file,
          headers: { 'Content-Type': file.type }
        })
      ));
      
      // 3. Create product with image URLs
      const res = await adminAPI.createProduct({
        ...productData,
        images: uploadResponses.map(r => r.data.publicUrl)
      });
      
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const res = await adminAPI.updateProduct(id, productData);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const res = await adminAPI.deleteProduct(id);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminCategories = useCallback(async () => {
    try {
      const res = await adminAPI.getCategories();
      setCategories(res.data.categories || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      throw err;
    }
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    fetchAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAdminCategories,
  };
};
