import { ArrowRight, ImageOff, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { wishlistAPI } from '../services/wishlistAPI';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await wishlistAPI.addToWishlist(product.id);
        setInWishlist(true);
      }
    } catch (err) {
      // silent
    }
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return Number.isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('[data-quick-add]')) return;
    navigate(`/products/${product.uuid || product.id}`);
  };

  const imageUrl = product.image_url || '';

  return (
    <div
      className="group cursor-pointer flex flex-col bg-surface-container-low border border-primary/5 h-full overflow-hidden transition-all duration-500 hover:border-primary/20 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/5] bg-surface-variant overflow-hidden flex items-center justify-center">
        {imageError || !imageUrl ? (
          <div className="flex flex-col items-center gap-3 opacity-20">
            <ImageOff size={32} />
            <span className="text-[10px] uppercase tracking-widest">Image Pending</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}

        {/* Quick Add Button */}
        <button
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          data-quick-add
        >
          <Plus size={14} />
          <span className="text-[10px] uppercase tracking-widest font-medium">Add</span>
        </button>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          {product.category && (
            <span className="text-[9px] uppercase tracking-[0.2em] bg-primary text-on-primary px-3 py-1 backdrop-blur-sm bg-opacity-90">
              {product.category}
            </span>
          )}
        </div>

        {/* Wishlist */}
        {user && (
          <button
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm border border-primary/10 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-surface z-10"
            onClick={handleWishlistToggle}
          >
            <Heart
              size={14}
              fill={inWishlist ? '#895125' : 'none'}
              color={inWishlist ? '#895125' : '#082719'}
            />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col gap-2 flex-1">
        <p className="text-[9px] text-secondary font-label uppercase tracking-[0.2em] mb-1">
          {product.origin_location || 'Single Origin'}
        </p>
        <h3 className="font-headline italic text-lg md:text-xl text-primary leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-primary/5">
          <p className="font-body text-sm font-medium text-primary/80">${formatPrice(product.price)}</p>
          <ArrowRight
            size={14}
            className="text-secondary opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0"
          />
        </div>
      </div>
    </div>
  );
};
