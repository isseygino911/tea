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
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderController } from '../../hooks/useOrderController';
import { LoadingBar } from '../ui/LoadingBar';

const menuItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const savedAddresses = [
  { id: 1, type: 'Home', address: '123 Main Street, Apt 4B', city: 'New York', zip: '10001', default: true },
  { id: 2, type: 'Work', address: '456 Office Blvd, Floor 12', city: 'New York', zip: '10002', default: false },
];

// Status style mapping
const statusStyles = {
  pending: { backgroundColor: 'rgba(234,179,8,0.1)', color: '#eab308' },
  processing: { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  shipped: { backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  delivered: { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  cancelled: { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' },
};

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { orders, loading, fetchUserOrders } = useOrderController();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    // Fetch orders silently - errors handled internally
    fetchUserOrders().catch(() => {
      // Error already handled in controller, just prevent unhandled rejection
    });
    // Only fetch once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>My Orders</h3>
            {loading ? (
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
                  <div key={order.id} style={styles.orderCard}>
                    <div style={styles.orderImage}>
                      <img 
                        src={order.image_url || `https://via.placeholder.com/80x100/111/333?text=Order`}
                        alt={order.product_name || 'Product'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
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
                      <p style={styles.orderPrice}>${order.total_amount}</p>
                      <p style={styles.orderDate}>
                        <Clock size={14} /> Ordered on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight size={20} style={{ opacity: 0.5 }} />
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
            <div style={styles.emptyState}>
              <Heart size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
              <p style={styles.emptyText}>No items in wishlist</p>
              <Link to="/products" style={styles.actionBtn}>Browse Products</Link>
            </div>
          </div>
        );
      
      case 'addresses':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Saved Addresses</h3>
            <div style={styles.addressesList}>
              {savedAddresses.map((addr) => (
                <div key={addr.id} style={styles.addressCard}>
                  <div style={styles.addressHeader}>
                    <span style={styles.addressType}>{addr.type}</span>
                    {addr.default && <span style={styles.defaultBadge}>Default</span>}
                  </div>
                  <p style={styles.addressText}>{addr.address}</p>
                  <p style={styles.addressCity}>{addr.city}, {addr.zip}</p>
                </div>
              ))}
              <button style={styles.addAddressBtn}>+ Add New Address</button>
            </div>
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
            <span style={styles.statValue}>0</span>
            <span style={styles.statLabel}>Wishlist</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>2</span>
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
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
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
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
    gap: '0.75rem',
    marginBottom: '0.75rem',
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
  addressText: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '0.25rem',
  },
  addressCity: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
  },
  addAddressBtn: {
    padding: '1.25rem',
    backgroundColor: 'transparent',
    border: '1px dashed rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
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
};
