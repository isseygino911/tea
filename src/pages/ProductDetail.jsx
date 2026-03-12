import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { product, loading, error, fetchProductById } = useProductController();
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <LoadingBar text="Loading product..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Product not found</div>
      </div>
    );
  }

  // All hooks must be called before this point
  const images = product.images?.length > 0 ? product.images : [product.image_url];
  const currentImage = images[currentImageIndex];
  const isOutOfStock = !product.stock_quantity || product.stock_quantity === 0;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  // Ensure price is a number
  const price = parseFloat(product.price) || 0;

  return (
    <div style={styles.container}>
      <div className="container">
        <Link to="/products" style={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to Products</span>
        </Link>

        <div style={styles.content}>
          <div style={styles.imageSection}>
            <div style={styles.mainImageContainer}>
              <img src={currentImage} alt={product.name} style={styles.mainImage} />
              
              {images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} style={styles.navButtonLeft}>
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={handleNextImage} style={styles.navButtonRight}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div style={styles.thumbnails}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      ...styles.thumbnail,
                      borderColor: currentImageIndex === idx ? '#ffffff' : 'transparent',
                    }}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} style={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.infoSection}>
            <p style={styles.category}>{product.category}</p>
            <h1 style={styles.name}>{product.name}</h1>
            {product.uuid && (
              <p style={styles.sku}>SKU: {product.uuid.slice(0, 8).toUpperCase()}</p>
            )}
            <p style={styles.price}>${price.toFixed(2)}</p>
            
            <div style={styles.divider} />
            
            <p style={styles.description}>{product.description}</p>
            
            <div style={styles.actions}>
              <div style={styles.quantity}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={styles.qtyBtn}
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={styles.qtyBtn}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                style={{
                  ...styles.addButton,
                  ...(isOutOfStock ? styles.addButtonDisabled : {}),
                }}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Out of Stock' : `Add to Cart 
               `
                }
              </button>
            </div>
            
            {!isOutOfStock ? (
              <p style={styles.stock}>In Stock ({product.stock_quantity} available)</p>
            ) : (
              <p style={{ ...styles.stock, color: '#ff6b6b' }}>Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '100px',
    minHeight: '100vh',
    paddingBottom: '8rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  mainImageContainer: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  mainImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'contain',
  },
  navButtonLeft: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonRight: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnails: {
    display: 'flex',
    gap: '0.75rem',
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid transparent',
    padding: 0,
    cursor: 'pointer',
    backgroundColor: '#0a0a0a',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '1rem',
  },
  name: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
  },
  price: {
    fontSize: '1.75rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  sku: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '1.5rem 0',
  },
  description: {
    fontSize: '1rem',
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    fontSize: '1.25rem',
    cursor: 'pointer',
  },
  qtyValue: {
    fontSize: '1rem',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'not-allowed',
  },
  stock: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    color: '#ff6b6b',
  },
};
