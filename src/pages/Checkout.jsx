import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingBar';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: review
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <Package size={64} color="rgba(255,255,255,0.3)" />
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Add some products to proceed to checkout</p>
          <Link to="/products" style={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
        shipping_address: {
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
        },
        total_amount: cartTotal,
      };
      
      const res = await api.post('/orders', orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      navigate(`/order-success/${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return (parseFloat(price) || 0).toFixed(2);
  };

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <Link to="/products" style={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </Link>
          <h1 style={styles.title}>Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressBar}>
          <div style={styles.progressStep}>
            <div style={{...styles.stepCircle, ...(step >= 1 ? styles.stepActive : {})}}>1</div>
            <span style={styles.stepLabel}>Shipping</span>
          </div>
          <div style={styles.progressLine} />
          <div style={styles.progressStep}>
            <div style={{...styles.stepCircle, ...(step >= 2 ? styles.stepActive : {})}}>2</div>
            <span style={styles.stepLabel}>Payment</span>
          </div>
          <div style={styles.progressLine} />
          <div style={styles.progressStep}>
            <div style={{...styles.stepCircle, ...(step >= 3 ? styles.stepActive : {})}}>3</div>
            <span style={styles.stepLabel}>Review</span>
          </div>
        </div>

        <div style={styles.content}>
          {/* Left Column - Forms */}
          <div style={styles.leftColumn}>
            {error && <div style={styles.error}>{error}</div>}

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} style={styles.form}>
                <h2 style={styles.sectionTitle}>
                  <Truck size={20} />
                  Shipping Information
                </h2>
                
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      style={styles.input}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Street Address *</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      style={styles.input}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>State *</label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>ZIP Code *</label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      style={styles.input}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Country *</label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      style={styles.select}
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                <button type="submit" style={styles.continueButton}>
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} style={styles.form}>
                <h2 style={styles.sectionTitle}>
                  <CreditCard size={20} />
                  Payment Information
                </h2>
                
                <div style={styles.paymentMethods}>
                  <div style={styles.paymentMethod}>
                    <input 
                      type="radio" 
                      name="payment" 
                      id="card" 
                      defaultChecked 
                      style={styles.radio}
                    />
                    <label htmlFor="card" style={styles.paymentLabel}>
                      Credit / Debit Card
                    </label>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Card Number *</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    style={styles.input}
                    maxLength={19}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Cardholder Name *</label>
                  <input
                    type="text"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Expiry Date *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                      style={styles.input}
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>CVV *</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      style={styles.input}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button type="button" onClick={() => setStep(1)} style={styles.backButton}>
                    Back to Shipping
                  </button>
                  <button type="submit" style={styles.continueButton}>
                    Review Order
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div style={styles.form}>
                <h2 style={styles.sectionTitle}>Review Your Order</h2>
                
                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Shipping Address</h3>
                  <div style={styles.reviewContent}>
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                  <button onClick={() => setStep(1)} style={styles.editLink}>Edit</button>
                </div>

                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Payment Method</h3>
                  <div style={styles.reviewContent}>
                    <p>Card ending in {paymentInfo.cardNumber.slice(-4) || '****'}</p>
                    <p>{paymentInfo.cardName}</p>
                  </div>
                  <button onClick={() => setStep(2)} style={styles.editLink}>Edit</button>
                </div>

                <div style={styles.buttonGroup}>
                  <button type="button" onClick={() => setStep(2)} style={styles.backButton}>
                    Back to Payment
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    style={styles.placeOrderButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LoadingSpinner size={16} thickness={2} />
                        Placing Order...
                      </span>
                    ) : (
                      `Place Order - $${formatPrice(cartTotal)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div style={styles.rightColumn}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              
              <div style={styles.itemsList}>
                {cart.map((item) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <div style={styles.itemImage}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={styles.thumbnail} />
                      ) : (
                        <div style={styles.noImage}>No Image</div>
                      )}
                    </div>
                    <div style={styles.itemDetails}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemQuantity}>Qty: {item.quantity}</p>
                    </div>
                    <p style={styles.itemPrice}>${formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div style={styles.divider} />

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${formatPrice(cartTotal)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={styles.free}>FREE</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax</span>
                <span>${formatPrice(cartTotal * 0.08)}</span>
              </div>

              <div style={styles.divider} />

              <div style={styles.totalRow}>
                <span>Total</span>
                <span style={styles.totalAmount}>${formatPrice(cartTotal * 1.08)}</span>
              </div>
            </div>
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
    paddingBottom: '4rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '3rem',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  stepActive: {
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  stepLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  progressLine: {
    width: '60px',
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '3rem',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  rightColumn: {
    position: 'sticky',
    top: '120px',
    height: 'fit-content',
  },
  form: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2rem',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
  },
  continueButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '1rem',
  },
  backButton: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  placeOrderButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#22c55e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  paymentMethods: {
    marginBottom: '1.5rem',
  },
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  radio: {
    width: '20px',
    height: '20px',
    accentColor: '#ffffff',
  },
  paymentLabel: {
    fontSize: '0.9rem',
  },
  reviewSection: {
    position: 'relative',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  reviewTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  reviewContent: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editLink: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    color: '#22c55e',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  summaryCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  summaryTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  itemQuantity: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  itemPrice: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '1rem 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  free: {
    color: '#22c55e',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  totalAmount: {
    fontSize: '1.5rem',
  },
  error: {
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#ef4444',
    marginBottom: '1rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '2rem',
  },
  continueShopping: {
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
  },
};
