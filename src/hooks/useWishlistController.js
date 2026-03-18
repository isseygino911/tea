import { useState, useCallback } from 'react';
import { wishlistAPI } from '../services/wishlistAPI';

export const useWishlistController = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wishlistAPI.getWishlist();
      setWishlist(res.data.items || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId) => {
    await wishlistAPI.addToWishlist(productId);
    await fetchWishlist();
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    await wishlistAPI.removeFromWishlist(productId);
    setWishlist(prev => prev.filter(item => item.product_id !== productId));
  }, []);

  return { wishlist, loading, fetchWishlist, addToWishlist, removeFromWishlist };
};
