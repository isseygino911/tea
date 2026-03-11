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
        backgroundColor: '#0a0a0a',
      }}>
        <ImageOff size={24} color="rgba(255,255,255,0.3)" />
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
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Calculated at checkout</span>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
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
    backgroundColor: '#0a0a0a',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
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
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
  },
  closeBtn: {
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ffffff',
    },
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
  },
  continueBtn: {
    marginTop: '1rem',
    padding: '0.875rem 1.5rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    marginBottom: '0.75rem',
  },
  itemImage: {
    width: '80px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  itemCategory: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.4)',
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  itemPrice: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
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
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '0.25rem',
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ffffff',
    },
  },
  qtyValue: {
    width: '24px',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  removeBtn: {
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ef4444',
    },
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: '#0a0a0a',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.875rem',
  },
  footerLabel: {
    color: 'rgba(255,255,255,0.5)',
  },
  footerValue: {
    color: '#ffffff',
  },
  footerTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    marginTop: '0.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  checkoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
    marginBottom: '0.75rem',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.9,
    },
  },
  clearBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ef4444',
    },
  },
};
