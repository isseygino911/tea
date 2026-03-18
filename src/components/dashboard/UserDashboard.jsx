import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut,
  Package,
  Clock,
  ChevronRight,
  User,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  Check,
  Truck,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderController } from '../../hooks/useOrderController';
import api from '../../services/api';
import { useAddressController } from '../../hooks/useAddressController';
import { useWishlistController } from '../../hooks/useWishlistController';
import { LoadingBar } from '../ui/LoadingBar';

const menuItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Status style mapping
const statusStyles = {
  pending: { backgroundColor: 'rgba(234,179,8,0.1)', color: '#eab308' },
  processing: { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  shipped: { backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  delivered: { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  cancelled: { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' },
};

// Address Form Component
const AddressForm = ({ address, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    label: address?.label || 'Home',
    recipient_name: address?.recipient_name || '',
    street_address: address?.street_address || '',
    city: address?.city || '',
    state: address?.state || '',
    postal_code: address?.postal_code || '',
    country: address?.country || 'Malaysia',
    phone: address?.phone || '',
    is_default: address?.is_default || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Label</label>
          <select
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
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
            required
            value={formData.recipient_name}
            onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
            style={styles.input}
            placeholder="Full name"
          />
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Street Address *</label>
        <input
          type="text"
          required
          value={formData.street_address}
          onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
          style={styles.input}
          placeholder="Street address"
        />
      </div>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>City *</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            style={styles.input}
            placeholder="City"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
            required
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            style={styles.input}
            placeholder="Postal code"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            style={styles.input}
            placeholder="Country"
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
          placeholder="Phone number"
        />
      </div>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          checked={formData.is_default}
          onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
        />
        Set as default address
      </label>

      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" style={styles.saveBtn}>
          <Check size={16} /> Save Address
        </button>
      </div>
    </form>
  );
};

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { orders, loading: ordersLoading, fetchUserOrders } = useOrderController();
  const { 
    addresses, 
    loading: addressesLoading, 
    fetchAddresses, 
    createAddress, 
    updateAddress, 
    deleteAddress,
    setDefaultAddress 
  } = useAddressController();
  const { wishlist, loading: wishlistLoading, fetchWishlist, removeFromWishlist } = useWishlistController();
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Order accordion state
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderItemsMap, setOrderItemsMap] = useState({});

  useEffect(() => {
    fetchUserOrders().catch(() => {});
    fetchAddresses().catch(() => {});
    fetchWishlist().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveAddress = async (formData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await createAddress(formData);
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      // Error handled in controller
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
      } catch (err) {
        // Error handled in controller
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      // Error handled in controller
    }
  };

  const toggleOrderAccordion = async (orderId) => {
    // If already expanded, collapse it
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    
    // Expand this order
    setExpandedOrderId(orderId);
    
    // Fetch items if not already cached
    if (!orderItemsMap[orderId]) {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrderItemsMap(prev => ({
          ...prev,
          [orderId]: res.data.items || []
        }));
      } catch (err) {
        console.error('Failed to fetch order items:', err);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>My Orders</h3>
            {ordersLoading ? (
              <div style={styles.loadingState}>
                <LoadingBar size="medium" text="Loading orders..." />
              </div>
            ) : orders.length === 0 ? (
              <div style={styles.emptyState}>
                <Package size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                <p style={styles.emptyText}>No orders yet</p>
                <Link to="/products" style={styles.actionBtn}>Start Shopping</Link>
              </div>
            ) : (
              <div style={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} style={styles.orderAccordion}>
                    <div 
                      style={{
                        ...styles.orderCard,
                        ...(expandedOrderId === order.id ? styles.orderCardActive : {})
                      }}
                      onClick={() => toggleOrderAccordion(order.id)}
                    >
                      <div style={styles.orderImage}>
                        {order.image_url ? (
                          <img 
                            src={order.image_url}
                            alt={order.product_name || 'Product'}
                            style={styles.orderImg}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div style={styles.orderPlaceholder}>
                            <Package size={24} opacity={0.3} />
                          </div>
                        )}
                      </div>
                      <div style={styles.orderInfo}>
                        <div style={styles.orderHeader}>
                          <span style={styles.orderId}>{order.order_number || `#ORD-${order.id}`}</span>
                          <span style={{
                            ...styles.status,
                            backgroundColor: statusStyles[order.status]?.backgroundColor,
                            color: statusStyles[order.status]?.color,
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <h4 style={styles.orderProduct}>{order.product_name || `Order #${order.id}`}</h4>
                        <p style={styles.orderPrice}>${parseFloat(order.total_amount).toFixed(2)}</p>
                        <p style={styles.orderDate}>
                          <Clock size={14} /> Ordered on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight 
                        size={20} 
                        style={{
                          opacity: 0.5,
                          transform: expandedOrderId === order.id ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    </div>
                    
                    {/* Accordion Content */}
                    {expandedOrderId === order.id && (
                      <div style={styles.orderDetails}>
                        <div style={styles.orderDetailsHeader}>
                          <h4 style={styles.orderDetailsTitle}>Order Items</h4>
                          <span style={styles.orderItemCount}>
                            {orderItemsMap[order.id]?.length || 0} items
                          </span>
                        </div>
                        
                        {orderItemsMap[order.id] ? (
                          <div style={styles.orderItemsList}>
                            {orderItemsMap[order.id].map((item) => (
                              <div key={item.id} style={styles.orderItem}>
                                <div style={styles.orderItemImage}>
                                  {item.image_url ? (
                                    <img 
                                      src={item.image_url}
                                      alt={item.name}
                                      style={styles.orderItemImg}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div style={styles.orderItemNoImage}>
                                      <Package size={16} opacity={0.3} />
                                    </div>
                                  )}
                                </div>
                                <div style={styles.orderItemInfo}>
                                  <p style={styles.orderItemName}>{item.name}</p>
                                  <p style={styles.orderItemMeta}>
                                    Qty: {item.quantity} × ${parseFloat(item.price_at_time).toFixed(2)}
                                  </p>
                                </div>
                                <p style={styles.orderItemTotal}>
                                  ${(item.quantity * parseFloat(item.price_at_time)).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={styles.loadingItems}>
                            <Loader2 size={20} className="spin" />
                            <span>Loading items...</span>
                          </div>
                        )}
                        
                        {/* Order Price Breakdown */}
                        <div style={styles.priceBreakdown}>
                          <div style={styles.priceRow}>
                            <span style={styles.priceLabel}>Subtotal</span>
                            <span style={styles.priceValue}>${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                          </div>
                          <div style={styles.priceRow}>
                            <span style={styles.priceLabel}>Tax</span>
                            <span style={styles.priceValue}>${parseFloat(order.tax_amount || 0).toFixed(2)}</span>
                          </div>
                          <div style={{...styles.priceRow, ...styles.priceTotalRow}}>
                            <span style={styles.priceTotalLabel}>Total</span>
                            <span style={styles.priceTotalValue}>${parseFloat(order.total_amount || 0).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shipping_address && (
                          <div style={styles.shippingSection}>
                            <h4 style={styles.shippingTitle}>
                              <Truck size={14} /> Shipping Address
                            </h4>
                            <div style={styles.shippingAddress}>
                              <p><strong>{order.shipping_address.fullName}</strong></p>
                              <p>{order.shipping_address.address}</p>
                              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                              <p>{order.shipping_address.country}</p>
                              {order.shipping_address.phone && (
                                <p style={styles.shippingPhone}>📞 {order.shipping_address.phone}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'wishlist':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>My Wishlist</h3>
            {wishlistLoading ? (
              <div style={styles.loadingState}>
                <LoadingBar size="medium" text="Loading wishlist..." />
              </div>
            ) : wishlist.length === 0 ? (
              <div style={styles.emptyState}>
                <Heart size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                <p style={styles.emptyText}>No items in wishlist</p>
                <Link to="/products" style={styles.actionBtn}>Browse Products</Link>
              </div>
            ) : (
              <div style={styles.wishlistGrid}>
                {wishlist.map((item) => (
                  <div key={item.id} style={styles.wishlistCard}>
                    <div style={styles.wishlistImage}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={styles.wishlistImg} onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <Package size={24} opacity={0.3} />
                      )}
                    </div>
                    <div style={styles.wishlistInfo}>
                      <p style={styles.wishlistName}>{item.name}</p>
                      <p style={styles.wishlistCategory}>{item.category}</p>
                      <p style={styles.wishlistPrice}>${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      style={styles.wishlistRemoveBtn}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'addresses':
        return (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Saved Addresses</h3>
              {!showAddressForm && (
                <button 
                  style={styles.addBtn}
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                >
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            {showAddressForm && (
              <div style={styles.formCard}>
                <div style={styles.formHeader}>
                  <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                  <button 
                    style={styles.closeBtn}
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <AddressForm 
                  address={editingAddress}
                  onSave={handleSaveAddress}
                  onCancel={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                />
              </div>
            )}

            {addressesLoading ? (
              <div style={styles.loadingState}>
                <LoadingBar size="medium" text="Loading addresses..." />
              </div>
            ) : addresses.length === 0 ? (
              <div style={styles.emptyState}>
                <MapPin size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                <p style={styles.emptyText}>No saved addresses</p>
                <button 
                  style={styles.actionBtn}
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div style={styles.addressesList}>
                {addresses.map((addr) => (
                  <div key={addr.id} style={styles.addressCard}>
                    <div style={styles.addressHeader}>
                      <div style={styles.addressTitle}>
                        <span style={styles.addressType}>{addr.label}</span>
                        {addr.is_default && <span style={styles.defaultBadge}>Default</span>}
                      </div>
                      <div style={styles.addressActions}>
                        {!addr.is_default && (
                          <button 
                            style={styles.iconBtn}
                            onClick={() => handleSetDefault(addr.id)}
                            title="Set as default"
                          >
                            <Star size={16} />
                          </button>
                        )}
                        <button 
                          style={styles.iconBtn}
                          onClick={() => handleEditAddress(addr)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          style={{ ...styles.iconBtn, color: '#ef4444' }}
                          onClick={() => handleDeleteAddress(addr.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p style={styles.addressText}>{addr.recipient_name}</p>
                    <p style={styles.addressText}>{addr.street_address}</p>
                    <p style={styles.addressCity}>
                      {addr.city}, {addr.state} {addr.postal_code}
                    </p>
                    <p style={styles.addressCity}>{addr.country}</p>
                    {addr.phone && <p style={styles.addressPhone}>📞 {addr.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Account Settings</h3>
            <div style={styles.settingsList}>
              <div style={styles.settingItem}>
                <span>Email</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{user?.email}</span>
              </div>
              <div style={styles.settingItem}>
                <span>Password</span>
                <button style={styles.changeBtn}>Change</button>
              </div>
              <div style={styles.settingItem}>
                <span>Newsletter</span>
                <button style={styles.changeBtn}>Subscribed</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div className="container" style={styles.content}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            <User size={32} />
          </div>
          <div>
            <h1 style={styles.name}>{user?.email?.split('@')[0]}</h1>
            <p style={styles.email}>{user?.email}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statValue}>{orders.length}</span>
            <span style={styles.statLabel}>Orders</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>{wishlist.length}</span>
            <span style={styles.statLabel}>Wishlist</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>{addresses.length}</span>
            <span style={styles.statLabel}>Addresses</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabs}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.tab,
                  borderBottomColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button onClick={logout} style={styles.logoutTab}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    paddingTop: '100px',
    paddingBottom: '4rem',
    backgroundColor: '#000000',
  },
  content: {
    maxWidth: '800px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  email: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  statsRow: {
    display: 'flex',
    gap: '3rem',
    padding: '1.5rem 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '2rem',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  statLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  logoutTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginLeft: 'auto',
  },
  section: {},
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#000000',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '4rem',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '4rem',
    border: '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '12px',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
  },
  actionBtn: {
    padding: '0.875rem 1.5rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    marginTop: '0.5rem',
    cursor: 'pointer',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  orderAccordion: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  orderCardActive: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  orderCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  orderImage: {
    width: '70px',
    height: '90px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  orderPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: {
    flex: 1,
    minWidth: 0,
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  orderId: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  orderProduct: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  orderPrice: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '0.5rem',
  },
  orderDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
  },
  orderDetails: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  orderDetailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  orderDetailsTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  orderItemCount: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  orderItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
  },
  orderItemImage: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0,
  },
  orderItemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  orderItemNoImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  orderItemMeta: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  orderItemTotal: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  loadingItems: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1.5rem',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
  },
  priceBreakdown: {
    padding: '1rem 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
  },
  priceValue: {},
  priceLabel: {},
  priceTotalRow: {
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '0.25rem',
  },
  priceTotalLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  priceTotalValue: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  shippingSection: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  shippingTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.75rem',
  },
  shippingAddress: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
  },
  shippingPhone: {
    marginTop: '0.5rem',
    color: 'rgba(255,255,255,0.6)',
  },
  addressesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  addressCard: {
    padding: '1.25rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
  },
  addressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  addressTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  addressType: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  defaultBadge: {
    fontSize: '0.65rem',
    padding: '0.125rem 0.5rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  addressActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconBtn: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addressText: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '0.25rem',
  },
  addressCity: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
  },
  addressPhone: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '0.5rem',
  },
  formCard: {
    padding: '1.5rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  closeBtn: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
  },
  input: {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  select: {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
    cursor: 'pointer',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#000000',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
  },
  changeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  wishlistGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  wishlistCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
  },
  wishlistImage: {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  wishlistInfo: {
    flex: 1,
    minWidth: 0,
  },
  wishlistName: {
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: '0.2rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wishlistCategory: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  wishlistPrice: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  wishlistRemoveBtn: {
    padding: '0.5rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: 'none',
    borderRadius: '6px',
    color: '#ef4444',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

