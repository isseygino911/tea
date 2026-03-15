import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package,
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { Overview } from './Overview';
import { ProductsManager } from './ProductsManager';
import { OrdersManager } from './OrdersManager';
import { DocumentsManager } from './DocumentsManager';
import { SettingsManager } from './SettingsManager';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection with debounce - only run on client
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      // Close sidebar when switching to desktop
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    checkMobile();
    
    const debouncedCheck = debounce(checkMobile, 100);
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
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
        return (
          <div style={styles.comingSoon}>
            <h3>Customers Management</h3>
            <p>Coming soon...</p>
          </div>
        );
      case 'settings':
        return <SettingsManager />;
      default:
        return <Overview />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button 
          style={styles.menuToggle}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside 
        style={{
          ...styles.sidebar,
          transform: isMobile 
            ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
            : 'translateX(0)',
        }}
      >
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
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
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

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        style={{
          ...styles.main,
          marginLeft: isMobile ? 0 : '280px',
        }}
      >
        {/* <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </header> */}
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
  menuToggle: {
    position: 'fixed',
    top: '95px',
    left: '20px',
    zIndex: 1100,
    padding: '0.75rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'block',
  },
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
    transition: 'transform 0.3s ease',
    willChange: 'transform',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1040,
    animation: 'fadeIn 0.2s ease',
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
