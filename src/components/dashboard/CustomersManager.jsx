import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { LoadingBar } from '../ui/LoadingBar';
import { Users, ArrowLeft, ShoppingBag, DollarSign, Package, Calendar, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const sortOptions = [
  { key: 'created_at', label: 'Join Date', order: 'DESC' },
  { key: 'email', label: 'Email', order: 'ASC' },
  { key: 'order_count', label: 'Order Count', order: 'DESC' },
  { key: 'total_spent', label: 'Total Spent', order: 'DESC' },
];

export const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [animationState, setAnimationState] = useState('list'); // 'list' | 'transitioning' | 'detail'
  const [isMobile, setIsMobile] = useState(false);
  
  // Sort state
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCustomers();
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setAnimationState('transitioning');
    
    // Small delay to allow transition animation
    setTimeout(() => {
      setAnimationState('detail');
    }, 50);
  };

  const handleBack = () => {
    setAnimationState('transitioning');
    setTimeout(() => {
      setSelectedCustomer(null);
      setAnimationState('list');
    }, 300);
  };

  const handleSort = (key, defaultOrder) => {
    if (sortField === key) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(key);
      setSortOrder(defaultOrder);
    }
    setShowSortMenu(false);
  };

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (aVal < bVal) return sortOrder === 'ASC' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });
  }, [customers, sortField, sortOrder]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortField);
    return option ? option.label : 'Sort By';
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <LoadingBar text="Loading customers..." />
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <div style={styles.container}>
        {selectedCustomer ? (
          <MobileCustomerDetail 
            customer={selectedCustomer} 
            onBack={handleBack}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        ) : (
          <CustomerList 
            customers={customers}
            onCustomerClick={handleCustomerClick}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            animationState="list"
            sortField={sortField}
            sortOrder={sortOrder}
            showSortMenu={showSortMenu}
            setShowSortMenu={setShowSortMenu}
            onSort={handleSort}
            getCurrentSortLabel={getCurrentSortLabel}
          />
        )}
      </div>
    );
  }

  // Desktop View with Animations
  return (
    <div style={styles.container}>
      {/* Customer List */}
      <div 
        style={{
          ...styles.listContainer,
          transform: animationState === 'list' ? 'translateX(0)' : 'translateX(-100%)',
          opacity: animationState === 'list' ? 1 : 0,
        }}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Customers</h2>
          <div style={styles.headerActions}>
            {/* Sort Dropdown */}
            <div style={styles.sortWrapper}>
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                style={styles.sortBtn}
              >
                <ArrowUpDown size={14} />
                <span>{getCurrentSortLabel()}</span>
                {sortOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              </button>
              
              {showSortMenu && (
                <div style={styles.sortMenu}>
                  {sortOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key, option.order)}
                      style={{
                        ...styles.sortOption,
                        backgroundColor: sortField === option.key ? 'rgba(200,146,42,0.2)' : 'transparent',
                        color: sortField === option.key ? '#C8922A' : 'rgba(255,255,255,0.8)',
                      }}
                    >
                      <span>{option.label}</span>
                      {sortField === option.key && (
                        sortOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <span style={styles.count}>{customers.length} total</span>
          </div>
        </div>

        <div style={styles.list}>
          {sortedCustomers.map((customer, index) => (
            <div
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              style={{
                ...styles.customerCard,
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div style={styles.customerInfo}>
                <div style={styles.avatar}>
                  {customer.email.charAt(0).toUpperCase()}
                </div>
                <div style={styles.customerDetails}>
                  <p style={styles.email}>{customer.email}</p>
                  <p style={styles.joinDate}>Joined {formatDate(customer.created_at)}</p>
                </div>
              </div>
              <div style={styles.customerStats}>
                <div style={styles.stat}>
                  <ShoppingBag size={14} />
                  <span>{customer.order_count}</span>
                </div>
                <div style={styles.stat}>
                  <DollarSign size={14} />
                  <span>{formatCurrency(customer.total_spent)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      {selectedCustomer && (
        <div 
          style={{
            ...styles.detailContainer,
            transform: animationState === 'detail' ? 'translateX(0)' : 'translateX(100%)',
            opacity: animationState === 'detail' ? 1 : 0,
          }}
        >
          {/* Back Button & Customer Name Header */}
          <div style={styles.detailHeader}>
            <button onClick={handleBack} style={styles.backButton}>
              <ArrowLeft size={20} />
              <span>Back to List</span>
            </button>
            
            <div 
              style={{
                ...styles.customerNameHeader,
                transform: animationState === 'detail' ? 'translateY(0)' : 'translateY(-20px)',
                opacity: animationState === 'detail' ? 1 : 0,
              }}
            >
              <div style={styles.largeAvatar}>
                {selectedCustomer.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={styles.detailEmail}>{selectedCustomer.email}</h3>
                <p style={styles.detailJoinDate}>
                  Customer since {formatDate(selectedCustomer.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={selectedCustomer.order_count.toString()}
              color="#3b82f6"
              delay={0}
              animationState={animationState}
            />
            <StatCard
              icon={DollarSign}
              label="Total Spent"
              value={formatCurrency(selectedCustomer.total_spent)}
              color="#22c55e"
              delay={1}
              animationState={animationState}
            />
            <StatCard
              icon={Package}
              label="Top Product"
              value={selectedCustomer.top_product_name || 'N/A'}
              subvalue={selectedCustomer.top_product_count > 0 ? `${selectedCustomer.top_product_count} purchased` : ''}
              color="#8b5cf6"
              delay={2}
              animationState={animationState}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Order Value"
              value={selectedCustomer.order_count > 0 
                ? formatCurrency(selectedCustomer.total_spent / selectedCustomer.order_count)
                : '$0.00'
              }
              color="#f59e0b"
              delay={3}
              animationState={animationState}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component with Animation
const StatCard = ({ icon: Icon, label, value, subvalue, color, delay, animationState }) => (
  <div
    style={{
      ...styles.statCard,
      borderLeftColor: color,
      transform: animationState === 'detail' ? 'translateX(0)' : 'translateX(50px)',
      opacity: animationState === 'detail' ? 1 : 0,
      transitionDelay: `${delay * 100}ms`,
    }}
  >
    <div style={{...styles.statIcon, backgroundColor: `${color}20`, color}}>
      <Icon size={24} />
    </div>
    <div style={styles.statContent}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
      {subvalue && <p style={styles.statSubvalue}>{subvalue}</p>}
    </div>
  </div>
);

// Customer List Component
const CustomerList = ({ 
  customers, 
  onCustomerClick, 
  formatDate, 
  formatCurrency, 
  animationState,
  sortField,
  sortOrder,
  showSortMenu,
  setShowSortMenu,
  onSort,
  getCurrentSortLabel
}) => (
  <div style={styles.listContainerMobile}>
    <div style={styles.header}>
      <h2 style={styles.title}>Customers</h2>
      <div style={styles.headerActions}>
        {/* Sort Dropdown */}
        <div style={styles.sortWrapper}>
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            style={styles.sortBtn}
          >
            <ArrowUpDown size={14} />
            <span>{getCurrentSortLabel()}</span>
            {sortOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          </button>
          
          {showSortMenu && (
            <div style={styles.sortMenu}>
              {sortOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => onSort(option.key, option.order)}
                  style={{
                    ...styles.sortOption,
                    backgroundColor: sortField === option.key ? 'rgba(200,146,42,0.2)' : 'transparent',
                    color: sortField === option.key ? '#C8922A' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <span>{option.label}</span>
                  {sortField === option.key && (
                    sortOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <span style={styles.count}>{customers.length} total</span>
      </div>
    </div>

    <div style={styles.list}>
      {sortedCustomers.map((customer, index) => (
        <div
          key={customer.id}
          onClick={() => onCustomerClick(customer)}
          style={{
            ...styles.customerCard,
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div style={styles.customerInfo}>
            <div style={styles.avatar}>
              {customer.email.charAt(0).toUpperCase()}
            </div>
            <div style={styles.customerDetails}>
              <p style={styles.email}>{customer.email}</p>
              <p style={styles.joinDate}>Joined {formatDate(customer.created_at)}</p>
            </div>
          </div>
          <div style={styles.customerStats}>
            <div style={styles.stat}>
              <ShoppingBag size={14} />
              <span>{customer.order_count}</span>
            </div>
            <div style={styles.stat}>
              <DollarSign size={14} />
              <span>{formatCurrency(customer.total_spent)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Mobile Customer Detail
const MobileCustomerDetail = ({ customer, onBack, formatDate, formatCurrency }) => (
  <div style={styles.mobileDetail}>
    <div style={styles.mobileHeader}>
      <button onClick={onBack} style={styles.mobileBackButton}>
        <ArrowLeft size={20} />
      </button>
      <div style={styles.mobileTitle}>
        <div style={styles.smallAvatar}>
          {customer.email.charAt(0).toUpperCase()}
        </div>
        <span style={styles.mobileEmail}>{customer.email}</span>
      </div>
    </div>

    <div style={styles.mobileStats}>
      <div style={styles.mobileStatCard}>
        <ShoppingBag size={20} color="#3b82f6" />
        <span style={styles.mobileStatValue}>{customer.order_count}</span>
        <span style={styles.mobileStatLabel}>Orders</span>
      </div>
      <div style={styles.mobileStatCard}>
        <DollarSign size={20} color="#22c55e" />
        <span style={styles.mobileStatValue}>{formatCurrency(customer.total_spent)}</span>
        <span style={styles.mobileStatLabel}>Spent</span>
      </div>
      <div style={styles.mobileStatCard}>
        <Package size={20} color="#8b5cf6" />
        <span style={styles.mobileStatValue}>{customer.top_product_name || 'N/A'}</span>
        <span style={styles.mobileStatLabel}>
          {customer.top_product_count > 0 ? `${customer.top_product_count} bought` : 'No purchases'}
        </span>
      </div>
      <div style={styles.mobileStatCard}>
        <TrendingUp size={20} color="#f59e0b" />
        <span style={styles.mobileStatValue}>
          {customer.order_count > 0 
            ? formatCurrency(customer.total_spent / customer.order_count)
            : '$0.00'
          }
        </span>
        <span style={styles.mobileStatLabel}>Avg Order</span>
      </div>
    </div>

    <div style={styles.mobileInfo}>
      <p style={styles.mobileInfoLabel}>
        <Calendar size={14} />
        Customer since {formatDate(customer.created_at)}
      </p>
    </div>
  </div>
);

const styles = {
  container: {
    padding: '1.5rem',
    position: 'relative',
    minHeight: 'calc(100vh - 200px)',
    overflow: 'hidden',
  },
  loading: {
    padding: '4rem',
  },
  // Desktop List View
  listContainer: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    right: '1.5rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Mobile List View
  listContainerMobile: {
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  count: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  // Sort Dropdown Styles
  sortWrapper: {
    position: 'relative',
  },
  sortBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sortMenu: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    minWidth: '180px',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.5rem',
    zIndex: 100,
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  },
  sortOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  customerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'slideIn 0.3s ease forwards',
    ':hover': {
      borderColor: 'rgba(255,255,255,0.2)',
      transform: 'translateX(4px)',
    },
  },
  customerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  largeAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  smallAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  customerDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  email: {
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  joinDate: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
  },
  customerStats: {
    display: 'flex',
    gap: '1rem',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
  },
  // Desktop Detail View
  detailContainer: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    right: '1.5rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  detailHeader: {
    marginBottom: '2rem',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ffffff',
    },
  },
  customerNameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: '100ms',
  },
  detailEmail: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  detailJoinDate: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.5)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderLeftWidth: '4px',
    borderRadius: '12px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  statSubvalue: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '0.25rem',
  },
  // Mobile Styles
  mobileDetail: {
    padding: '1rem',
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  mobileBackButton: {
    padding: '0.5rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
  },
  mobileTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  mobileEmail: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  mobileStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  mobileStatCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  mobileStatValue: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  mobileStatLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  mobileInfo: {
    padding: '1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
  },
  mobileInfoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
  },
};

// Add CSS animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);
