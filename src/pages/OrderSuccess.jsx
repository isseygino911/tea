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
          <CheckCircle size={56} color="#1F3D2E" />
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
    backgroundColor: '#F4EDE0',
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
    width: '90px',
    height: '90px',
    border: '1px solid rgba(31,61,46,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    color: '#1F3D2E',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2.5rem',
    fontWeight: 300,
    color: '#1A1A1A',
    marginBottom: '1rem',
  },
  subtitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.95rem',
    color: 'rgba(26,26,26,0.6)',
    marginBottom: '2.5rem',
    lineHeight: 1.7,
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#FBF8F1',
    border: '1px solid rgba(31,61,46,0.1)',
    padding: '1.75rem',
    marginBottom: '2rem',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(31,61,46,0.08)',
    marginBottom: '1rem',
    color: '#1F3D2E',
  },
  orderNumber: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    fontWeight: 400,
    color: '#1F3D2E',
    flex: 1,
  },
  orderStatus: {
    padding: '0.3rem 0.75rem',
    backgroundColor: 'rgba(31,61,46,0.08)',
    color: '#1F3D2E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.62rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
  orderDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginBottom: '1.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.88rem',
  },
  detailLabel: {
    color: 'rgba(26,26,26,0.5)',
  },
  detailValue: {
    fontWeight: 500,
    color: '#1A1A1A',
  },
  itemsSection: {
    borderTop: '1px solid rgba(31,61,46,0.08)',
    paddingTop: '1.5rem',
  },
  itemsTitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#8FA3A8',
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
    backgroundColor: '#F4EDE0',
    border: '1px solid rgba(31,61,46,0.06)',
  },
  itemImage: {
    width: '48px',
    height: '48px',
    overflow: 'hidden',
    backgroundColor: '#FBF8F1',
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
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.6rem',
    color: 'rgba(31,61,46,0.3)',
  },
  itemInfo: {
    flex: 1,
    textAlign: 'left',
  },
  itemName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1rem',
    fontWeight: 400,
    color: '#1F3D2E',
    marginBottom: '0.2rem',
  },
  itemMeta: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.72rem',
    color: 'rgba(26,26,26,0.45)',
  },
  itemTotal: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: '#1A1A1A',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  continueButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.9rem 2.2rem',
    backgroundColor: '#1F3D2E',
    color: '#F4EDE0',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.76rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
};
