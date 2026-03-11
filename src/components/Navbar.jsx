import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial checks
    setScrolled(window.scrollY > 50);
    setIsMobile(window.innerWidth <= 768);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textDecoration: 'none',
          }}>
            STORE
          </Link>

          {/* Desktop Nav */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}>
            <Link to="/products" style={navLinkStyle}>Products</Link>
            {user ? (
              <>
                <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
                <button onClick={handleLogout} style={navLinkStyle}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={navLinkStyle}>Login</Link>
                <Link to="/register" style={navLinkStyle}>Register</Link>
              </>
            )}
            
            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>{cartCount}</span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={toggleCart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    marginLeft: '0.25rem',
                  }}>{cartCount}</span>
                )}
              </button>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <Link to="/products" style={mobileLinkStyle} onClick={closeMobileMenu}>Products</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={mobileLinkStyle} onClick={closeMobileMenu}>Dashboard</Link>
              <button onClick={handleLogout} style={mobileButtonStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={mobileLinkStyle} onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" style={mobileLinkStyle} onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

const navLinkStyle = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
};

const mobileLinkStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#ffffff',
  textDecoration: 'none',
  padding: '0.5rem 0',
};

const mobileButtonStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#ffffff',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  padding: '0.5rem 0',
  cursor: 'pointer',
};
