import { useState, useCallback } from 'react';
import api from '../services/api.js';

export const useInventoryController = () => {
  const [transactions, setTransactions] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [productInventory, setProductInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inventory transactions with optional filters
  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.product_id) params.append('product_id', filters.product_id);
      if (filters.type) params.append('type', filters.type);
      if (filters.page) params.append('page', filters.page);

      const url = `/api/admin/inventory/transactions${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await api.get(url);
      setTransactions(res.data.transactions || []);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Adjust stock for a product (quantity can be positive or negative)
  const adjustStock = useCallback(async (productId, quantity, reason) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/admin/inventory/adjust', {
        product_id: productId,
        quantity,
        reason,
      });
      return res.data.product;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to adjust stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products with low stock
  const fetchLowStockProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/inventory/low-stock');
      setLowStockProducts(res.data.products || []);
      return res.data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch low stock products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inventory reservations
  const fetchReservations = useCallback(async (activeOnly = true) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/admin/inventory/reservations?active_only=${activeOnly}`);
      setReservations(res.data.reservations || []);
      return res.data.reservations;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reservations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch detailed inventory info for a specific product
  const fetchProductInventory = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/admin/inventory/product/${productId}`);
      setProductInventory(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    transactions,
    lowStockProducts,
    reservations,
    productInventory,
    loading,
    error,

    // Actions
    fetchTransactions,
    adjustStock,
    fetchLowStockProducts,
    fetchReservations,
    fetchProductInventory,
    clearError,
  };
};
