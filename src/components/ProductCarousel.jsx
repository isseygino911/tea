import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { LoadingBar } from './ui/LoadingBar';

// Component for individual product image with error handling
const ProductImage = ({ src, alt }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div style={styles.fallbackImage}>
        <ImageOff size={32} color="rgba(255,255,255,0.3)" />
        <span style={styles.fallbackText}>No Image</span>
      </div>
    );
  }
  
  return (
    <img 
      src={src}
      alt={alt}
      style={styles.image}
      onError={() => setError(true)}
    />
  );
};

export const ProductCarousel = ({ products, loading }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth <= 768);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return Number.isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3));
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingBar size="large" text="Loading products..." />
      </div>
    );
  }

  // Mobile: 2x2 Grid
  if (isMobile) {
    return (
      <div style={styles.mobileGrid}>
        {products.slice(0, 4).map((product) => (
          <div 
            key={product.id} 
            style={styles.mobileCard}
            className="glass-card"
            onClick={() => handleCardClick(product.id)}
          >
            <div style={styles.mobileImageContainer}>
              <ProductImage src={product.image_url} alt={product.name} />
            </div>
            <div style={styles.mobileInfo}>
              <span style={styles.mobileCategory}>{product.category}</span>
              <h3 style={styles.mobileName}>{product.name}</h3>
              <div style={styles.mobileFooter}>
                <p style={styles.mobilePrice}>${formatPrice(product.price)}</p>
                <button 
                  style={styles.mobileAddBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Carousel
  return (
    <div style={styles.container}>
      <button 
        onClick={prevSlide}
        style={{...styles.navButton, ...styles.prevButton}}
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={24} />
      </button>

      <div ref={carouselRef} style={styles.carousel}>
        <div 
          style={{
            ...styles.track,
            transform: `translateX(-${currentIndex * (280 + 24)}px)`,
          }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              style={styles.card}
              className="glass-card"
              onClick={() => handleCardClick(product.id)}
            >
              <div style={styles.imageContainer}>
                <ProductImage src={product.image_url} alt={product.name} />
                <div style={styles.overlay}>
                  <button 
                    style={styles.addButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div style={styles.info}>
                <span style={styles.category}>{product.category}</span>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.price}>${formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={nextSlide}
        style={{...styles.navButton, ...styles.nextButton}}
        disabled={currentIndex >= products.length - 4}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div style={styles.dots}>
        {Array.from({ length: Math.max(1, products.length - 3) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              ...styles.dot,
              backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
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
  container: {
    position: 'relative',
    padding: '0 60px',
  },
  carousel: {
    overflow: 'hidden',
  },
  track: {
    display: 'flex',
    gap: '24px',
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  card: {
    flexShrink: 0,
    width: '280px',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    height: '350px',
    overflow: 'hidden',
    borderRadius: '12px 12px 0 0',
    backgroundColor: '#111',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '1.5rem',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  addButton: {
    padding: '0.875rem 2rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease',
  },
  info: {
    padding: '1.25rem',
  },
  category: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  name: {
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  price: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.3s ease',
  },
  prevButton: {
    left: 0,
  },
  nextButton: {
    right: 0,
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  mobileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  mobileCard: {
    cursor: 'pointer',
  },
  mobileImageContainer: {
    height: '180px',
    overflow: 'hidden',
    borderRadius: '12px 12px 0 0',
    backgroundColor: '#111',
  },
  mobileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mobileInfo: {
    padding: '1rem',
  },
  mobileCategory: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  mobileName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginTop: '0.25rem',
    marginBottom: '0.5rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mobileFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobilePrice: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mobileAddBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
