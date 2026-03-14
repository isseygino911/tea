import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setScrolled(window.scrollY > 20);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
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
      {/* ── Main nav bar ── */}
      <nav style={{
        ...navStyles.bar,
        backgroundColor: scrolled ? 'rgba(0,0,0,0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
      }}>
        <div className="container" style={navStyles.inner}>

          {/* Logo */}
          <Link to="/" style={navStyles.logoLink}>
            <img
              src="/brand.png"
              alt="LumiNation Corp"
              style={navStyles.logoImg}
            />
          </Link>

          {/* Desktop center links */}
          {!isMobile && (
            <div style={navStyles.centerLinks}>
              <Link to="/products" className="nav-link-item" style={navStyles.link}>Products</Link>
              <span style={navStyles.divider}>|</span>
              <Link to="/tools" className="nav-link-item" style={navStyles.link}>Tools</Link>
            </div>
          )}

          {/* Desktop right cluster */}
          {!isMobile && (
            <div style={navStyles.rightCluster}>
              {user ? (
                <>
                  {/* User dot indicator */}
                  <Link to="/dashboard" className="nav-link-item" style={navStyles.link}>
                    <span style={navStyles.userDot}></span>
                    Account
                  </Link>
                  <button onClick={handleLogout} className="nav-link-item" style={navStyles.linkBtn}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link-item" style={navStyles.link}>Login</Link>
                  <Link to="/register" className="nav-link-item" style={navStyles.link}>Register</Link>
                </>
              )}

              {/* Cart — raw count number */}
              <button onClick={toggleCart} style={navStyles.cartBtn} aria-label="Open cart">
                <ShoppingBag size={16} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span style={navStyles.cartCount}>{cartCount}</span>
                )}
              </button>
            </div>
          )}

          {/* Mobile right cluster */}
          {isMobile && (
            <div style={navStyles.mobileRight}>
              <button onClick={toggleCart} style={navStyles.cartBtn} aria-label="Open cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span style={navStyles.cartCount}>{cartCount}</span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={navStyles.hamburger}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Full-screen mobile overlay ── */}
      {isMobile && (
        <div
          style={{
            ...navStyles.mobileOverlay,
            pointerEvents: mobileMenuOpen ? 'all' : 'none',
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(4px)',
          }}
        >
          {/* Close button top-right */}
          <button
            onClick={closeMobileMenu}
            style={navStyles.mobileClose}
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <nav style={navStyles.mobileLinks}>
            <Link to="/products" style={navStyles.mobileLink} onClick={closeMobileMenu}>Products</Link>
            <Link to="/tools" style={navStyles.mobileLink} onClick={closeMobileMenu}>Tools</Link>

            {user ? (
              <>
                <Link to="/dashboard" style={navStyles.mobileLink} onClick={closeMobileMenu}>Account</Link>
                <button onClick={handleLogout} style={navStyles.mobileLinkBtn}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={navStyles.mobileLink} onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" style={navStyles.mobileLink} onClick={closeMobileMenu}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

const navStyles = {
  bar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    zIndex: 1000,
    backgroundColor: 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoImg: {
    height: '22px',
    width: 'auto',
    objectFit: 'contain',
  },
  centerLinks: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.4rem',
  },
  link: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  linkBtn: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.5)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
  },
  divider: {
    color: 'rgba(255,255,255,0.12)',
    fontSize: '0.7rem',
    userSelect: 'none',
  },
  rightCluster: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.6rem',
    flexShrink: 0,
  },
  userDot: {
    display: 'inline-block',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#C8922A',
    flexShrink: 0,
  },
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
  },
  cartCount: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#ffffff',
    lineHeight: 1,
  },
  mobileRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#000000',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem 2.5rem',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
  },
  mobileClose: {
    position: 'absolute',
    top: '1.4rem',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  mobileLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  mobileLink: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#ffffff',
    textDecoration: 'none',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    display: 'block',
  },
  mobileLinkBtn: {
    fontSize: '3rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    padding: 0,
    fontFamily: 'inherit',
    display: 'block',
  },
};
