import { useState, useCallback } from 'react';
import api from '../services/api';
import { settingsAPI } from '../services/settingsAPI';

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
      let taxRate = 0.08;
      try {
        const taxRes = await settingsAPI.getTaxRate();
        taxRate = parseFloat(taxRes.data.taxRate) || 0.08;
      } catch {
        // use default 0.08
      }

      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax_amount = parseFloat((subtotal * taxRate).toFixed(2));
      const total_amount = parseFloat((subtotal + tax_amount).toFixed(2));

      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        tax_amount,
        total_amount,
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
