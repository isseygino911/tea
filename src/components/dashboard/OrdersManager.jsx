import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useOrderController } from '../../hooks/useOrderController';
import { OrderDetailsModal } from './OrderDetailsModal';
import { LoadingBar } from '../ui/LoadingBar';

const statuses = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

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

export const OrdersManager = () => {
  const { orders, loading, fetchAdminOrders, getOrderDetails } = useOrderController();
  const [localLoading, setLocalLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const loadOrders = useCallback(async () => {
    setLocalLoading(true);
    const filters = {};
    if (search) filters.search = search;
    if (selectedStatus !== 'All') filters.status = selectedStatus;
    await fetchAdminOrders(filters);
    setLocalLoading(false);
  }, [search, selectedStatus, fetchAdminOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleViewOrder = async (order) => {
    try {
      const { order: orderData, items } = await getOrderDetails(order.id);
      setSelectedOrder(orderData);
      setOrderItems(items);
      setModalOpen(true);
    } catch (err) {
      // Error handled by controller
    }
  };

  const handleRefresh = () => {
    loadOrders();
    setModalOpen(false);
  };

  const isLoading = loading || localLoading;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Orders</h2>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statValue}>{orders.length}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <Search size={18} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.statuses}>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                ...styles.statusBtn,
                backgroundColor: selectedStatus === status ? '#ffffff' : 'transparent',
                color: selectedStatus === status ? '#000000' : 'rgba(255,255,255,0.6)',
              }}
            >
              {status === 'All' ? status : (
                <>
                  {(() => {
                    const Icon = statusIcons[status];
                    return <Icon size={14} style={{ marginRight: '0.5rem' }} />;
                  })()}
                  {status}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div style={styles.loading}><LoadingBar text="Loading orders..." /></div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                const statusColor = statusColors[order.status] || '#ffffff';
                
                return (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.orderNumber}>{order.order_number}</span>
                    </td>
                    <td style={styles.td}>{order.customer_email}</td>
                    <td style={styles.td}>{order.item_count} items</td>
                    <td style={styles.td}>${order.total_amount}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        backgroundColor: `${statusColor}20`,
                        color: statusColor,
                      }}>
                        <StatusIcon size={14} />
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleViewOrder(order)} 
                        style={styles.viewBtn}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div style={styles.empty}>No orders found</div>
          )}
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        items={orderItems}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleRefresh}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  filters: {
    marginBottom: '1.5rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  statuses: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  statusBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    textTransform: 'capitalize',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255,255,255,0.5)',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap',
  },
  tr: {},
  td: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    whiteSpace: 'nowrap',
  },
  orderNumber: {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  viewBtn: {
    padding: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255,255,255,0.5)',
  },
};
