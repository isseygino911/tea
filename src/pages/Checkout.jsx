import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Package, MapPin, Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddressController } from '../hooks/useAddressController';
import api from '../services/api';
import { settingsAPI } from '../services/settingsAPI';
import { LoadingSpinner } from '../components/ui/LoadingBar';
import { ScrollReveal } from '../components/ScrollReveal';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addresses, loading: addressesLoading, fetchAddresses, createAddress } = useAddressController();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: shipping, 2: review
  
  // Selected address
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  // New address form
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    recipient_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Malaysia',
    phone: '',
    is_default: false,
  });

  // Shipping info (either from selected address or new address)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  
  // Tax rate from settings
  const [taxRate, setTaxRate] = useState(0.08); // Default 8%
  const [taxRateLoading, setTaxRateLoading] = useState(true);

  useEffect(() => {
    fetchAddresses().catch(() => {});
    fetchTaxRate();
  }, []);
  
  const fetchTaxRate = async () => {
    try {
      setTaxRateLoading(true);
      const res = await settingsAPI.getTaxRate();
      setTaxRate(res.data.taxRate || 0.08);
    } catch (err) {
      console.error('Failed to fetch tax rate:', err);
      // Keep default 8%
    } finally {
      setTaxRateLoading(false);
    }
  };

  // Auto-select default address if available, or show new address form if none exist
  useEffect(() => {
    if (!addressesLoading && addresses.length === 0 && !selectedAddressId) {
      // No addresses, show new address form
      setSelectedAddressId('new');
    } else if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id.toString());
      }
    }
  }, [addresses, addressesLoading, selectedAddressId]);

  // Update shipping info when address is selected
  useEffect(() => {
    if (selectedAddressId && selectedAddressId !== 'new') {
      const addr = addresses.find(a => a.id.toString() === selectedAddressId);
      if (addr) {
        setShippingInfo({
          fullName: addr.recipient_name,
          address: addr.street_address,
          city: addr.city,
          state: addr.state || '',
          zipCode: addr.postal_code,
          country: addr.country,
          phone: addr.phone || '',
        });
        setShowNewAddressForm(false);
      }
    } else if (selectedAddressId === 'new') {
      setShowNewAddressForm(true);
    }
  }, [selectedAddressId, addresses]);

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

  const handleAddressSelect = (e) => {
    setSelectedAddressId(e.target.value);
    setError('');
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    setShippingInfo({
      fullName: newAddress.recipient_name,
      address: newAddress.street_address,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.postal_code,
      country: newAddress.country,
      phone: newAddress.phone,
    });
    setStep(2);
  };

  const handleContinueToReview = () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }
    if (selectedAddressId === 'new') {
      // Validate new address
      if (!newAddress.recipient_name || !newAddress.street_address || !newAddress.city || !newAddress.postal_code) {
        setError('Please fill in all required address fields');
        return;
      }
      setShippingInfo({
        fullName: newAddress.recipient_name,
        address: newAddress.street_address,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.postal_code,
        country: newAddress.country,
        phone: newAddress.phone,
      });
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      // If using new address, save it to address book first (if user wants)
      if (selectedAddressId === 'new') {
        try {
          await createAddress({
            label: newAddress.label,
            recipient_name: newAddress.recipient_name,
            street_address: newAddress.street_address,
            city: newAddress.city,
            state: newAddress.state,
            postal_code: newAddress.postal_code,
            country: newAddress.country,
            phone: newAddress.phone,
            is_default: addresses.length === 0 ? true : newAddress.is_default, // Make default if first address
          });
        } catch (addrErr) {
          // Continue with order even if saving address fails
          console.log('Could not save address:', addrErr);
        }
      }

      const subtotal = cartTotal;
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;
      
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
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
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
          <div style={{...styles.progressLine, ...(step >= 2 ? styles.stepLineActive : {})}} />
          <div style={styles.progressStep}>
            <div style={{...styles.stepCircle, ...(step >= 2 ? styles.stepActive : {})}}>2</div>
            <span style={styles.stepLabel}>Review</span>
          </div>
        </div>

        <div style={styles.content}>
          {/* Left Column - Forms */}
          <ScrollReveal>
          <div style={styles.leftColumn}>
            {error && <div style={styles.error}>{error}</div>}

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div style={styles.form}>
                <h2 style={styles.sectionTitle}>
                  <Truck size={20} />
                  Shipping Address
                </h2>

                {/* Address Selection Dropdown - Only show if addresses exist */}
                {addresses.length > 0 && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Select Address *</label>
                    <div style={styles.selectWrapper}>
                      <select
                        value={selectedAddressId}
                        onChange={handleAddressSelect}
                        style={styles.select}
                        disabled={addressesLoading}
                      >
                        <option value="">{addressesLoading ? 'Loading...' : 'Choose an address'}</option>
                        {addresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.label}: {addr.recipient_name}, {addr.city}
                            {addr.is_default ? ' (Default)' : ''}
                          </option>
                        ))}
                        <option value="new">+ Add New Address</option>
                      </select>
                      <ChevronDown size={16} style={styles.selectIcon} />
                    </div>
                  </div>
                )}

                {/* No addresses message */}
                {!addressesLoading && addresses.length === 0 && (
                  <div style={styles.noAddressesMessage}>
                    <MapPin size={24} style={{ opacity: 0.5 }} />
                    <p>You don't have any saved addresses yet.</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      Enter your address below. It will be saved for future orders.
                    </p>
                  </div>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <form onSubmit={handleNewAddressSubmit} style={styles.newAddressForm}>
                    <div style={styles.formDivider} />
                    <h3 style={styles.subSectionTitle}>
                      <Plus size={16} /> New Address
                    </h3>
                    
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Label</label>
                        <select
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          style={styles.select}
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Recipient Name *</label>
                        <input
                          type="text"
                          value={newAddress.recipient_name}
                          onChange={(e) => setNewAddress({...newAddress, recipient_name: e.target.value})}
                          style={styles.input}
                          required
                          placeholder="Full name"
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Street Address *</label>
                      <input
                        type="text"
                        value={newAddress.street_address}
                        onChange={(e) => setNewAddress({...newAddress, street_address: e.target.value})}
                        style={styles.input}
                        required
                        placeholder="Street address"
                      />
                    </div>

                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>City *</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          style={styles.input}
                          required
                          placeholder="City"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          style={styles.input}
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Postal Code *</label>
                        <input
                          type="text"
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                          style={styles.input}
                          required
                          placeholder="Postal code"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Country</label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                          style={styles.input}
                          placeholder="Country"
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Phone</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        style={styles.input}
                        placeholder="Phone number"
                      />
                    </div>

                    <label style={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={newAddress.is_default}
                        onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                      />
                      Save as default address
                    </label>
                  </form>
                )}

                {/* Selected Address Display */}
                {selectedAddressId && selectedAddressId !== 'new' && shippingInfo.fullName && (
                  <div style={styles.selectedAddress}>
                    <div style={styles.addressIcon}>
                      <MapPin size={20} />
                    </div>
                    <div style={styles.addressDetails}>
                      <p style={styles.addressName}>{shippingInfo.fullName}</p>
                      <p style={styles.addressText}>{shippingInfo.address}</p>
                      <p style={styles.addressText}>
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p style={styles.addressText}>{shippingInfo.country}</p>
                      {shippingInfo.phone && <p style={styles.addressPhone}>{shippingInfo.phone}</p>}
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleContinueToReview} 
                  style={styles.continueButton}
                  disabled={!selectedAddressId}
                >
                  Continue to Review
                </button>
              </div>
            )}

            {/* Step 2: Review Order */}
            {step === 2 && (
              <div style={styles.form}>
                <h2 style={styles.sectionTitle}>Review Your Order</h2>
                
                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Shipping Address</h3>
                  <div style={styles.reviewContent}>
                    <p><strong>{shippingInfo.fullName}</strong></p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                    {shippingInfo.phone && <p>📞 {shippingInfo.phone}</p>}
                  </div>
                  <button onClick={() => setStep(1)} style={styles.editLink}>Change</button>
                </div>

                <div style={styles.reviewSection}>
                  <h3 style={styles.reviewTitle}>Payment</h3>
                  <div style={styles.reviewContent}>
                    <p style={styles.paymentPlaceholder}>
                      💳 Payment will be processed on the next step
                    </p>
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button type="button" onClick={() => setStep(1)} style={styles.backButton}>
                    Back to Shipping
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    style={styles.placeOrderButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LoadingSpinner size={16} thickness={2} />
                        Creating Order...
                      </span>
                    ) : (
                      `Place Order - $${formatPrice(cartTotal + (cartTotal * taxRate))}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          </ScrollReveal>

          {/* Right Column - Order Summary */}
          <ScrollReveal delay={2}>
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
                <span>Tax ({taxRateLoading ? '...' : (taxRate * 100).toFixed(0)}%)</span>
                <span>${formatPrice(cartTotal * taxRate)}</span>
              </div>

              <div style={styles.divider} />

              <div style={styles.totalRow}>
                <span>Total</span>
                <span style={styles.totalAmount}>${formatPrice(cartTotal + (cartTotal * taxRate))}</span>
              </div>
            </div>
          </div>
          </ScrollReveal>
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
  stepLineActive: {
    backgroundColor: '#ffffff',
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
  subSectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '1.5rem 0',
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
  selectWrapper: {
    position: 'relative',
  },
  select: {
    width: '100%',
    padding: '0.875rem 2.5rem 0.875rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  },
  selectIcon: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  newAddressForm: {
    marginTop: '1rem',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  selectedAddress: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
  addressIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  addressText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.25rem',
  },
  addressPhone: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '0.5rem',
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
    opacity: 1,
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
  paymentPlaceholder: {
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.5)',
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
  noAddressesMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
  },
};
