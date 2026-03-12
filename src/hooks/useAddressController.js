import { useState, useCallback } from 'react';
import { addressAPI } from '../services/addressAPI';

export const useAddressController = () => {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await addressAPI.getAddresses();
      setAddresses(res.data.addresses || []);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch addresses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddress = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addressAPI.getAddress(id);
      setAddress(res.data.address);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch address');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addressAPI.createAddress(data);
      setAddresses(prev => [...prev, res.data.address]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create address');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addressAPI.updateAddress(id, data);
      setAddresses(prev => prev.map(a => a.id === id ? res.data.address : a));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update address');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await addressAPI.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete address');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setDefaultAddress = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await addressAPI.setDefaultAddress(id);
      // Update local state to reflect new default
      setAddresses(prev => prev.map(a => ({
        ...a,
        is_default: a.id === id
      })));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set default address');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addresses,
    address,
    loading,
    error,
    fetchAddresses,
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
