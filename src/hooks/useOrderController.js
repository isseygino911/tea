import { useState, useCallback } from 'react';
import { adminAPI } from '../services/adminAPI';
import api from '../services/api';

export const useOrderController = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User methods
  const fetchUserOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
      return res.data;
    } catch (err) {
      // Handle 401 - not authenticated
      if (err.response?.status === 401) {
        setOrders([]);
        setError('Please login to view your orders');
      } else {
        setOrders([]);
        setError(err.message || 'Failed to fetch orders');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (items, shippingAddress) => {
    setLoading(true);
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: total,
        shipping_address: shippingAddress,
      };

      const res = await api.post('/orders', orderData);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin methods
  const fetchAdminOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getOrders(filters);
      setOrders(res.data.orders || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const res = await adminAPI.getOrder(orderId);
      return {
        order: res.data.order,
        items: res.data.items,
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const res = await adminAPI.updateOrderStatus(orderId, { status });
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchUserOrders,
    createOrder,
    fetchAdminOrders,
    getOrderDetails,
    updateOrderStatus,
  };
};
