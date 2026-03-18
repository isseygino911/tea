import { ArrowRight, ImageOff, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { wishlistAPI } from '../services/wishlistAPI';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    // Don't navigate if clicking the add to cart button
    if (e.target.closest('[data-quick-add]')) return;
    navigate(`/products/${product.uuid || product.id}`);
  };

  const imageUrl = product.image_url || '';

  return (
    <div 
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 30px 60px rgba(0,0,0,0.5)' : 'none',
      }} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div style={styles.imageContainer}>
        {imageError || !imageUrl ? (
          <div style={styles.fallbackImage}>
            <ImageOff size={48} color="rgba(255,255,255,0.1)" />
            <span style={styles.fallbackText}>Technical Drawing Pending</span>
          </div>
        ) : (
          <img 
            src={imageUrl}
            alt={product.name}
            style={{
              ...styles.image,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              filter: isHovered ? 'brightness(0.7)' : 'brightness(0.9)',
            }}
            onError={(e) => {
              console.error(`Failed to load image: ${imageUrl}`, e);
              setImageError(true);
            }}
          />
        )}
        
        {/* Quick Add Button — Bottom Right */}
        <button 
          style={{
            ...styles.quickAdd,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          data-quick-add
          title="Add to Cart"
        >
          <Plus size={20} />
        </button>

        {/* Info Overlay — Top Left (Badges) */}
        <div style={styles.badges}>
          {product.sku && <span style={styles.skuBadge}>{product.sku}</span>}
          {product.wattage && <span style={styles.specBadge}>{product.wattage}</span>}
        </div>

        {/* Wishlist Heart Button — Top Right */}
        {user && (
          <button
            style={{
              ...styles.wishlistBtn,
              opacity: isHovered ? 1 : 0.7,
            }}
            onClick={handleWishlistToggle}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              fill={inWishlist ? '#ef4444' : 'none'}
              color={inWishlist ? '#ef4444' : 'rgba(255,255,255,0.8)'}
            />
          </button>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.meta}>
          <span style={styles.category}>{product.category}</span>
          <div style={{ ...styles.indicator, backgroundColor: isHovered ? '#C8922A' : 'rgba(255,255,255,0.2)' }}></div>
        </div>
        <h3 style={{ 
          ...styles.name,
          color: isHovered ? '#fff' : 'rgba(255,255,255,0.9)'
        }}>
          {product.name}
        </h3>
        <div style={styles.footer}>
          <p style={styles.price}>${formatPrice(product.price)}</p>
          <ArrowRight 
            size={16} 
            style={{ 
              opacity: isHovered ? 1 : 0, 
              transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'all 0.4s ease',
              color: '#C8922A'
            }} 
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    height: '100%',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: '1/1',
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  fallbackText: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.2)',
  },
  quickAdd: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    zIndex: 5,
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  },
  badges: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    zIndex: 4,
  },
  wishlistBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 5,
    transition: 'all 0.3s ease',
  },
  skuBadge: {
    fontSize: '0.6rem',
    fontWeight: 700,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    color: 'rgba(255,255,255,0.8)',
    padding: '0.3rem 0.6rem',
    borderRadius: '2px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  specBadge: {
    fontSize: '0.6rem',
    fontWeight: 700,
    backgroundColor: '#C8922A',
    color: '#000',
    padding: '0.3rem 0.6rem',
    borderRadius: '2px',
  },
  info: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1,
    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.01))',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: 500,
  },
  indicator: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  name: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    margin: 0,
    transition: 'color 0.3s ease',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
  },
};
