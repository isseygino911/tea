import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package,
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  FileText,
  MoreVertical
} from 'lucide-react';
import { Overview } from './Overview';
import { ProductsManager } from './ProductsManager';
import { OrdersManager } from './OrdersManager';
import { DocumentsManager } from './DocumentsManager';
import { SettingsManager } from './SettingsManager';
import { CustomersManager } from './CustomersManager';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Debounce helper
const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const tabsRef = useRef(null);

  // Handle responsive detection with debounce - only run on client
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
    };
    
    // Initial check
    checkMobile();
    
    const debouncedCheck = debounce(checkMobile, 100);
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  // Scroll active tab into view
  useEffect(() => {
    if (isMobile && tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab, isMobile]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowUserMenu(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'products':
        return <ProductsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'documents':
        return <DocumentsManager />;
      case 'customers':
        return <CustomersManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <Overview />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.logo}>ADMIN</div>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>

          <nav style={styles.nav}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  style={{
                    ...styles.navItem,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div style={styles.sidebarFooter}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Horizontal Tab Navigation */}
      {isMobile && (
        <div style={styles.mobileNav}>
          <div style={styles.mobileNavHeader}>
            <span style={styles.mobileNavTitle}>Admin</span>
            <div style={styles.mobileUserSection}>
              <span style={styles.mobileUserEmail}>{user?.email}</span>
              <div style={{ position: 'relative' }}>
                <button 
                  style={styles.mobileMenuBtn}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <MoreVertical size={20} />
                </button>
                {showUserMenu && (
                  <>
                    <div 
                      style={styles.mobileMenuOverlay}
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div style={styles.mobileMenuDropdown}>
                      <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div style={styles.tabsContainer}>
            <div ref={tabsRef} style={styles.tabs} data-tabs>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    data-tab={item.id}
                    onClick={() => handleTabChange(item.id)}
                    style={{
                      ...styles.tab,
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#000000' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main 
        style={{
          ...styles.main,
          marginLeft: isMobile ? 0 : '280px',
          paddingTop: isMobile ? '140px' : '2rem',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    paddingTop: '80px',
    backgroundColor: '#000000',
  },
  // Desktop Sidebar
  sidebar: {
    width: '280px',
    backgroundColor: '#0a0a0a',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: '80px',
    bottom: 0,
    zIndex: 1050,
  },
  // Mobile Navigation
  mobileNav: {
    position: 'fixed',
    top: '80px',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  mobileNavHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  mobileNavTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  mobileUserSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  mobileUserEmail: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  mobileMenuBtn: {
    padding: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenuOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  mobileMenuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.5rem',
    minWidth: '150px',
    zIndex: 1001,
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#ef4444',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
  },
  tabsContainer: {
    padding: '0.75rem',
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: '4px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  userEmail: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '0.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nav: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    textAlign: 'left',
  },
  sidebarFooter: {
    padding: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    padding: '2rem',
    transition: 'margin-left 0.3s ease',
    willChange: 'margin-left',
    overflowY: 'auto',
    height: 'calc(100vh - 80px)',
  },
  header: {
    marginBottom: '1.5rem',
  },
  pageTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
  },
  comingSoon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    color: 'rgba(255,255,255,0.5)',
  },
};

// Inject CSS for scrollbar hiding
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  /* Hide scrollbar for mobile tabs */
  [data-tabs]::-webkit-scrollbar {
    display: none !important;
  }
  [data-tabs] {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }
`;
document.head.appendChild(styleSheet);
