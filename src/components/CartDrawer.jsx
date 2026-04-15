import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

// Helper to safely format prices
const formatPrice = (price) => {
  const num = parseFloat(price);
  return Number.isNaN(num) ? '0.00' : num.toFixed(2);
};
import { Link } from 'react-router-dom';

// Cart item image component with error handling
const CartItemImage = ({ src, alt }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4EDE0',
      }}>
        <ImageOff size={24} color="rgba(31,61,46,0.2)" />
      </div>
    );
  }
  
  return (
    <img 
      src={src}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={() => setError(true)}
    />
  );
};

export const CartDrawer = () => {
  const { 
    cart, 
    cartCount, 
    cartTotal, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart,
    clearCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={styles.backdrop}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div style={styles.drawer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <ShoppingBag size={20} />
            <span>Your Cart ({cartCount})</span>
          </div>
          <button onClick={closeCart} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div style={styles.empty}>
            <ShoppingBag size={64} strokeWidth={1} style={{ opacity: 0.3 }} />
            <p style={styles.emptyText}>Your cart is empty</p>
            <button onClick={closeCart} style={styles.continueBtn}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div style={styles.items}>
              {cart.map((item) => (
                <div key={item.id} style={styles.item}>
                  <div style={styles.itemImage}>
                    <CartItemImage 
                      src={item.image_url || item.image}
                      alt={item.name}
                    />
                  </div>
                  <div style={styles.itemDetails}>
                    <span style={styles.itemCategory}>{item.category}</span>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <p style={styles.itemPrice}>${formatPrice(item.price)}</p>
                    <div style={styles.itemActions}>
                      <div style={styles.quantity}>
                        <button 
                          style={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          style={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        style={styles.removeBtn}
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={styles.footer}>
              <div style={styles.footerRow}>
                <span style={styles.footerLabel}>Subtotal</span>
                <span style={styles.footerValue}>${formatPrice(cartTotal)}</span>
              </div>
              <div style={styles.footerRow}>
                <span style={styles.footerLabel}>Shipping</span>
                <span style={{ color: 'rgba(26,26,26,0.45)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>Calculated at checkout</span>
              </div>
              <div style={styles.footerTotal}>
                <span>Total</span>
                <span>${formatPrice(cartTotal)}</span>
              </div>
              <Link to="/checkout" onClick={closeCart} style={styles.checkoutBtn}>
                Checkout <ArrowRight size={18} />
              </Link>
              <button onClick={clearCart} style={styles.clearBtn}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(26,26,26,0.5)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#FBF8F1',
    borderLeft: '1px solid rgba(31,61,46,0.12)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(31,61,46,0.1)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    fontWeight: 400,
    color: '#1F3D2E',
  },
  closeBtn: {
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'rgba(26,26,26,0.5)',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem',
    color: '#1F3D2E',
  },
  emptyText: {
    fontFamily: 'Inter, sans-serif',
    color: 'rgba(26,26,26,0.5)',
    fontSize: '0.95rem',
  },
  continueBtn: {
    marginTop: '1rem',
    padding: '0.8rem 2rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(31,61,46,0.25)',
    color: '#1F3D2E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.76rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  },
  items: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  },
  item: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#F4EDE0',
    border: '1px solid rgba(31,61,46,0.07)',
    marginBottom: '0.75rem',
  },
  itemImage: {
    width: '72px',
    height: '90px',
    overflow: 'hidden',
    backgroundColor: '#FBF8F1',
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  itemCategory: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.62rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#8FA3A8',
  },
  itemName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.05rem',
    fontWeight: 400,
    color: '#1F3D2E',
  },
  itemPrice: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.88rem',
    color: 'rgba(26,26,26,0.6)',
  },
  itemActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid rgba(31,61,46,0.15)',
    padding: '0.2rem 0.5rem',
  },
  qtyBtn: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: '#1F3D2E',
    cursor: 'pointer',
  },
  qtyValue: {
    width: '20px',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#1A1A1A',
  },
  removeBtn: {
    padding: '0.4rem',
    background: 'none',
    border: 'none',
    color: 'rgba(26,26,26,0.35)',
    cursor: 'pointer',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(31,61,46,0.1)',
    backgroundColor: '#FBF8F1',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
  },
  footerLabel: {
    color: 'rgba(26,26,26,0.5)',
  },
  footerValue: {
    color: '#1A1A1A',
    fontWeight: 500,
  },
  footerTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    marginTop: '0.5rem',
    borderTop: '1px solid rgba(31,61,46,0.1)',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    fontWeight: 400,
    color: '#1F3D2E',
  },
  checkoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#1F3D2E',
    color: '#F4EDE0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.76rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    textDecoration: 'none',
    marginBottom: '0.75rem',
  },
  clearBtn: {
    width: '100%',
    padding: '0.65rem',
    background: 'none',
    border: 'none',
    color: 'rgba(26,26,26,0.4)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};
