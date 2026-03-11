import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, Users, ChevronRight } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import { LoadingBar } from '../ui/LoadingBar';

const statsConfig = [
  { label: 'Total Revenue', icon: DollarSign, color: '#22c55e' },
  { label: 'Total Orders', icon: ShoppingBag, color: '#3b82f6' },
  { label: 'Products', icon: Package, color: '#8b5cf6' },
  { label: 'Customers', icon: Users, color: '#f59e0b' },
];

export const Overview = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getDashboardStats();
        // Ensure stats has default values if API response is incomplete
        setStats({
          totalRevenue: res.data.stats?.totalRevenue || 0,
          totalOrders: res.data.stats?.totalOrders || 0,
          totalProducts: res.data.stats?.totalProducts || 0,
          totalCustomers: res.data.stats?.totalCustomers || 0,
        });
        setRecentOrders(res.data.recentOrders || []);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statValues = [
    { value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, change: '+12.5%', trend: 'up' },
    { value: (stats?.totalOrders || 0).toString(), change: '+8.2%', trend: 'up' },
    { value: (stats?.totalProducts || 0).toString(), change: '0', trend: 'neutral' },
    { value: (stats?.totalCustomers || 0).toString(), change: '+18.7%', trend: 'up' },
  ];

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loading}><LoadingBar text="Loading dashboard..." /></div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {statsConfig.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = statValues[index].trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <div key={index} style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div style={{...styles.statIcon, backgroundColor: `${stat.color}20`, color: stat.color}}>
                      <Icon size={20} />
                    </div>
                    <div style={{...styles.trend, color: statValues[index].trend === 'up' ? '#22c55e' : '#ef4444'}}>
                      <TrendIcon size={14} />
                      <span>{statValues[index].change}</span>
                    </div>
                  </div>
                  <div style={styles.statValue}>{statValues[index].value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Orders */}
          <div style={styles.tableCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Recent Orders</h3>
              <button style={styles.viewAllBtn}>
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.order_number}</span>
                      </td>
                      <td style={styles.td}>{order.customer_email}</td>
                      <td style={styles.td}>${order.total_amount}</td>
                      <td style={styles.td}>
                        <span style={{...styles.status, ...styles[order.status]}}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {recentOrders.length === 0 && (
                <div style={styles.empty}>No recent orders</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255,255,255,0.5)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  tableCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.6)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ffffff',
    },
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
    padding: '1rem 1.5rem',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tr: {
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.02)',
    },
  },
  td: {
    padding: '1rem 1.5rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  orderId: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
  },
  status: {
    display: 'inline-flex',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  pending: {
    backgroundColor: 'rgba(234,179,8,0.1)',
    color: '#eab308',
  },
  processing: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    color: '#3b82f6',
  },
  shipped: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    color: '#8b5cf6',
  },
  delivered: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    color: '#22c55e',
  },
  cancelled: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: 'rgba(255,255,255,0.5)',
  },
};
