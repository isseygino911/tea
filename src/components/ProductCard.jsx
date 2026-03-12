import { ArrowRight, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

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
  const placeholderUrl = `https://via.placeholder.com/400x500/111/333?text=${encodeURIComponent(product.name || 'Product')}`;

  return (
    <div style={styles.card} data-product-card onClick={handleCardClick}>
      <div style={styles.imageContainer}>
        {imageError || !imageUrl ? (
          <div style={styles.fallbackImage}>
            <ImageOff size={48} color="rgba(255,255,255,0.3)" />
            <span style={styles.fallbackText}>No Image</span>
          </div>
        ) : (
          <img 
            src={imageUrl}
            alt={product.name}
            style={styles.image}
            onError={(e) => {
              console.error(`Failed to load image: ${imageUrl}`, e);
              setImageError(true);
            }}
          />
        )}
        <div style={styles.overlay} data-overlay>
          <button 
            style={styles.addButton}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            data-quick-add
          >
            Add to Cart <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div style={styles.info}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.price}>${formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: '4/5',
    backgroundColor: '#111',
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
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#0a0a0a',
  },
  fallbackText: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: '#ffffff',
    color: '#000000',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transform: 'translateY(20px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  category: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#ffffff',
  },
  price: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
};
