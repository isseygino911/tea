import { X, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import { useState } from 'react';

// Helper to safely format prices
const formatPrice = (price) => {
  const num = parseFloat(price);
  return Number.isNaN(num) ? '0.00' : num.toFixed(2);
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];

export const OrderDetailsModal = ({ order, items, isOpen, onClose, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const StatusIcon = statusIcons[order.status] || Clock;
  const statusColor = statusColors[order.status] || '#ffffff';

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(order.id, newStatus);
      onUpdate();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Order {order.order_number}</h3>
            <p style={styles.date}>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          {/* Status Section */}
          <div style={styles.statusSection}>
            <div style={{...styles.statusBadge, backgroundColor: `${statusColor}20`, color: statusColor}}>
              <StatusIcon size={16} />
              <span>{order.status}</span>
            </div>
            
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div style={styles.statusActions}>
                <span style={styles.updateLabel}>Update to:</span>
                <div style={styles.statusButtons}>
                  {statusFlow
                    .filter(s => statusFlow.indexOf(s) > statusFlow.indexOf(order.status))
                    .map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={updating}
                        style={{
                          ...styles.statusBtn,
                          borderColor: statusColors[status],
                          color: statusColors[status],
                        }}
                      >
                        {updating ? '...' : status}
                      </button>
                    ))}
                </div>
              </div>
            )}
            
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={updating}
                style={styles.cancelBtn}
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Customer Info */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Customer</h4>
            <p style={styles.info}>{order.customer_email}</p>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Shipping Address</h4>
              <p style={styles.info}>{order.shipping_address}</p>
            </div>
          )}

          {/* Order Items */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Order Items ({items?.length || 0})</h4>
            <div style={styles.itemsList}>
              {items?.map((item) => (
                <div key={item.id} style={styles.item}>
                  <div style={styles.itemImage}>
                    <img 
                      src={item.image_url || `https://via.placeholder.com/60x80/111/333?text=${encodeURIComponent(item.product_name)}`}
                      alt={item.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{item.product_name}</p>
                    <p style={styles.itemMeta}>Qty: {item.quantity} × ${item.price_at_time}</p>
                  </div>
                  <p style={styles.itemTotal}>${formatPrice(item.quantity * item.price_at_time)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${order.total_amount}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: '#22c55e' }}>Free</span>
            </div>
            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>${order.total_amount}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div style={styles.paymentStatus}>
            <span>Payment:</span>
            <span style={{
              color: order.payment_status === 'paid' ? '#22c55e' : 
                     order.payment_status === 'failed' ? '#ef4444' : '#eab308'
            }}>
              {order.payment_status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  date: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
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
  content: {
    padding: '1.5rem',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
  },
  statusActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  updateLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  statusButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  statusBtn: {
    padding: '0.375rem 0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  cancelBtn: {
    padding: '0.5rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '6px',
    color: '#ef4444',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'rgba(239,68,68,0.2)',
    },
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.5rem',
  },
  info: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
  },
  itemImage: {
    width: '50px',
    height: '65px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  itemTotal: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  summary: {
    padding: '1rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.375rem 0',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.6)',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    marginTop: '0.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '1rem',
    fontWeight: 600,
  },
  paymentStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    textTransform: 'capitalize',
  },
};
