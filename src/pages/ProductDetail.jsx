import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';
import { ScrollReveal } from '../components/ScrollReveal';
import { wishlistAPI } from '../services/wishlistAPI';
import { useAuth } from '../context/AuthContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { product, productImages, loading, error, fetchProductById } = useProductController();

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  // Check wishlist status when product loads
  useEffect(() => {
    if (!user || !product?.id) return;
    wishlistAPI.checkWishlist(product.id).then(res => {
      setInWishlist(res.data.inWishlist);
    }).catch(() => {});
  }, [user, product?.id]);

  const handleWishlistToggle = async () => {
    if (!user || !product?.id) return;
    setWishlistLoading(true);
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
    } finally {
      setWishlistLoading(false);
    }
  };

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
  // Use productImages from API, fallback to product.image_url
  const images = productImages?.length > 0 
    ? productImages.map(img => img.image_url)
    : [product.image_url];
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
      <style>{responsiveStyles}</style>
      <div className="container">
        <Link to="/products" style={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to Products</span>
        </Link>

        <ScrollReveal>
          {/* Top Section: Image + Info */}
          <div style={styles.topSection} className="product-detail-top">
            {/* Image Gallery */}
            <div style={styles.imageSection}>
              <div style={styles.mainImageContainer}>
                <img src={currentImage} alt={product.name} style={styles.mainImage} />
                
                {images.length > 1 && (
                  <>
                    <button onClick={handlePrevImage} style={{ ...styles.navButton, left: '1rem' }}>
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={handleNextImage} style={{ ...styles.navButton, right: '1rem' }}>
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

            {/* Product Info + Actions */}
            <div style={styles.infoSection}>
              <p style={styles.category}>{product.category}</p>
              <h1 style={styles.name}>{product.name}</h1>
              {product.uuid && (
                <p style={styles.sku}>SKU: {product.uuid.slice(0, 8).toUpperCase()}</p>
              )}
              
              {/* Model Number */}
              {product.model_number && (
                <div style={styles.modelNumber}>
                  <span style={styles.modelLabel}>Model:</span>
                  <span style={styles.modelValue}>{product.model_number}</span>
                </div>
              )}

              {/* Price + Actions Row */}
              <div style={styles.priceActionsRow}>
                <p style={styles.price}>${price.toFixed(2)}</p>
                
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
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  {user && (
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      style={{
                        ...styles.wishlistBtn,
                        backgroundColor: inWishlist ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                        borderColor: inWishlist ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.15)',
                      }}
                      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={20}
                        fill={inWishlist ? '#ef4444' : 'none'}
                        color={inWishlist ? '#ef4444' : 'rgba(255,255,255,0.7)'}
                      />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Stock Status */}
              {!isOutOfStock ? (
                <>
                  <p style={styles.stock}>In Stock ({product.stock_quantity} available)</p>
                  {product.stock_quantity <= 10 && (
                    <p style={{ ...styles.stock, color: '#ff6b6b', fontWeight: 600 }}>
                      Only {product.stock_quantity} left - order soon!
                    </p>
                  )}
                </>
              ) : (
                <p style={{ ...styles.stock, color: '#ff6b6b' }}>Out of Stock</p>
              )}
            </div>
          </div>

          {/* Bottom Section: Full Width Description */}
          <div style={styles.bottomSection}>
            {product.description && (
              <div style={styles.descriptionSection}>
                <h2 style={styles.sectionTitle}>Description</h2>
                <p style={styles.description}>{product.description}</p>
              </div>
            )}
            
            {/* Specifications */}
            {product.specifications && (
              <div style={styles.specsSection}>
                <h2 style={styles.sectionTitle}>Specifications</h2>
                <div style={styles.specsTable}>
                  {(() => {
                    // Parse specifications if it's a string
                    const specs = typeof product.specifications === 'string' 
                      ? JSON.parse(product.specifications) 
                      : product.specifications;
                    
                    return Object.entries(specs).map(([key, value]) => (
                      <div key={key} style={styles.specRow}>
                        <span style={styles.specKey}>{key}</span>
                        <span style={styles.specValue}>{value}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
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
  topSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    marginBottom: '3rem',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  mainImageContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    aspectRatio: '1',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  navButton: {
    position: 'absolute',
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
    overflowX: 'auto',
    paddingBottom: '0.5rem',
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
    flexShrink: 0,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
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
    marginBottom: '0.75rem',
  },
  name: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: '0.75rem',
  },
  sku: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
    letterSpacing: '0.1em',
    marginBottom: '0.75rem',
  },
  modelNumber: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  modelLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  modelValue: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 500,
    fontFamily: 'monospace',
    letterSpacing: '0.05em',
  },
  priceActionsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    marginBottom: '1rem',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem 1rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: '1rem',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    minWidth: '140px',
    padding: '0.875rem 1.5rem',
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
  wishlistBtn: {
    width: '48px',
    height: '48px',
    border: '1px solid',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
  },
  stock: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '0.25rem 0',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  descriptionSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  description: {
    fontSize: '1rem',
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.7)',
    whiteSpace: 'pre-wrap',
  },
  specsSection: {
    width: '100%',
  },
  specsTable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '0.75rem',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  specKey: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.5)',
    flexShrink: 0,
    minWidth: '120px',
  },
  specValue: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    flex: 1,
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

// Responsive styles
const responsiveStyles = `
  @media (max-width: 768px) {
    .product-detail-top {
      grid-template-columns: 1fr !important;
    }
  }
`;
