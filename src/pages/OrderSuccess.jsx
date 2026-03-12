import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { LoadingBar } from '../components/ui/LoadingBar';

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
        setItems(res.data.items || []);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <LoadingBar text="Loading order details..." />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="container" style={styles.content}>
        <div style={styles.successIcon}>
          <CheckCircle size={64} color="#22c55e" />
        </div>
        
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.subtitle}>
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {order && (
          <div style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <Package size={24} />
              <span style={styles.orderNumber}>Order #{order.order_number || order.id}</span>
              <span style={styles.orderStatus}>{order.status}</span>
            </div>
            
            <div style={styles.orderDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Order Date</span>
                <span style={styles.detailValue}>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Total Amount</span>
                <span style={styles.detailValue}>${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Order Items */}
            {items.length > 0 && (
              <div style={styles.itemsSection}>
                <h3 style={styles.itemsTitle}>Order Items</h3>
                <div style={styles.itemsList}>
                  {items.map((item) => (
                    <div key={item.id} style={styles.item}>
                      <div style={styles.itemImage}>
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            style={styles.itemImg}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div style={styles.noImage}>No Image</div>
                        )}
                      </div>
                      <div style={styles.itemInfo}>
                        <p style={styles.itemName}>{item.name}</p>
                        <p style={styles.itemMeta}>
                          Qty: {item.quantity} × ${parseFloat(item.price_at_time).toFixed(2)}
                        </p>
                      </div>
                      <p style={styles.itemTotal}>
                        ${(item.quantity * parseFloat(item.price_at_time)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.actions}>
          <Link to="/products" style={styles.continueButton}>
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '120px',
    minHeight: '100vh',
    paddingBottom: '4rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  successIcon: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '2.5rem',
    lineHeight: 1.6,
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '1rem',
  },
  orderNumber: {
    fontSize: '1.125rem',
    fontWeight: 600,
    flex: 1,
  },
  orderStatus: {
    padding: '0.375rem 0.75rem',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  orderDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  detailValue: {
    fontWeight: 500,
  },
  itemsSection: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '1.5rem',
  },
  itemsTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '1rem',
    textAlign: 'left',
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
  },
  itemImage: {
    width: '50px',
    height: '50px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0,
  },
  itemImg: {
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
  itemInfo: {
    flex: 1,
    textAlign: 'left',
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  itemTotal: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  continueButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'opacity 0.2s',
  },
};
