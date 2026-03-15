import { useState, useCallback } from 'react';
import api from '../services/api';

export const useCartController = () => {
  const [orderStatus, setOrderStatus] = useState('idle'); // idle | submitting | success | error
  const [orderError, setOrderError] = useState(null);

  const createOrder = useCallback(async (cartItems, shippingAddress) => {
    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }

    setOrderStatus('submitting');
    setOrderError(null);

    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: total,
        shipping_address: shippingAddress,
      };

      await api.post('/orders', orderData);
      setOrderStatus('success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      setOrderError(message);
      setOrderStatus('error');
      throw new Error(message);
    }
  }, []);

  const resetOrderStatus = useCallback(() => {
    setOrderStatus('idle');
    setOrderError(null);
  }, []);

  return {
    orderStatus,
    orderError,
    createOrder,
    resetOrderStatus,
    isSubmitting: orderStatus === 'submitting',
  };
};
