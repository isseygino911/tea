import { useState } from 'react';
import { Minus, Plus, Trash2, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCartController } from '../hooks/useCartController';

// Helper to safely format prices
const formatPrice = (price) => {
  const num = parseFloat(price);
  return Number.isNaN(num) ? '0.00' : num.toFixed(2);
};

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { createOrder, isSubmitting, orderStatus, resetOrderStatus } = useCartController();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const handleCheckout = async () => {
    if (!address.street || !address.city) return;

    const shippingAddress = `${address.name}\n${address.street}\n${address.city} ${address.postalCode}`;
    
    try {
      await createOrder(items, shippingAddress);
      clearCart();
    } catch (error) {
      // Error handled by controller
    }
  };

  if (items.length === 0 && orderStatus !== 'success') {
    return (
      <div style={styles.container}>
        <div className="container" style={styles.emptyState}>
          <h1 style={styles.title}>Your Cart</h1>
          <p style={styles.emptyText}>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="container" style={styles.content}>
        {orderStatus === 'success' ? (
          <div style={styles.successState}>
            <div style={styles.successIcon}>
              <Check size={48} />
            </div>
            <h2 style={styles.successTitle}>Order Placed!</h2>
            <p style={styles.successText}>
              Thank you for your purchase. Your order has been received.
            </p>
            <button 
              onClick={resetOrderStatus}
              style={styles.continueBtn}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <h1 style={styles.title}>Your Cart</h1>
            
            <div style={styles.grid}>
              <div style={styles.items}>
                {items.map(item => (
                  <div key={item.id} style={styles.item}>
                    <img src={item.image} alt={item.name} style={styles.itemImage} />
                    <div style={styles.itemInfo}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemPrice}>${formatPrice(item.price)}</p>
                    </div>
                    <div style={styles.itemActions}>
                      <div style={styles.quantity}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={styles.qtyBtn}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={styles.qtyBtn}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={styles.removeBtn}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.summary}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>
                
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${formatPrice(total)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                  <span>Total</span>
                  <span style={styles.totalValue}>${formatPrice(total)}</span>
                </div>

                {showCheckout ? (
                  <div style={styles.checkoutForm}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      style={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      style={styles.input}
                    />
                    <div style={styles.inputRow}>
                      <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        style={{ ...styles.input, width: '120px' }}
                      />
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      disabled={isSubmitting || !address.street || !address.city}
                      style={{
                        ...styles.checkoutBtn,
                        opacity: isSubmitting || !address.street || !address.city ? 0.5 : 1,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => setShowCheckout(false)}
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowCheckout(true)}
                    style={styles.checkoutBtn}
                  >
                    Checkout <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
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
  content: {
    maxWidth: '1200px',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    marginBottom: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    paddingTop: '8rem',
  },
  emptyText: {
    fontSize: '1.25rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  successState: {
    textAlign: 'center',
    paddingTop: '6rem',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  successText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '2rem',
  },
  continueBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '3rem',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    backgroundColor: '#0a0a0a',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  itemPrice: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
  },
  removeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    position: 'sticky',
    top: '120px',
    height: 'fit-content',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  totalRow: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '0.75rem',
    paddingTop: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  totalValue: {
    fontSize: '1.5rem',
  },
  checkoutForm: {
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.875rem 1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  inputRow: {
    display: 'flex',
    gap: '0.75rem',
  },
  checkoutBtn: {
    width: '100%',
    marginTop: '0.75rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  cancelBtn: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
};
