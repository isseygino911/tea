import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`${scrolled ? 'bg-[#F4EDE0]/95' : 'bg-[#F4EDE0]/85'} backdrop-blur-md text-[#082719] font-headline italic tracking-wide fixed w-full top-0 z-50 transition-all duration-300`}>
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-xl md:text-2xl font-headline not-italic text-[#082719]">
          Yún & Leaf 云叶
        </Link>
        
        <div className="hidden md:flex gap-8 lg:gap-12 items-center">
          <Link className="text-[#082719]/70 hover:text-[#082719] transition-colors text-sm lg:text-base" to="/products">Coffee / 咖啡</Link>
          <Link className="text-[#082719]/70 hover:text-[#082719] transition-colors text-sm lg:text-base" to="/tea">Tea / 茶</Link>
          <Link className="text-[#082719]/70 hover:text-[#082719] transition-colors text-sm lg:text-base" to="/flight">Flights / 品鉴</Link>
          <Link className="text-[#082719]/70 hover:text-[#082719] transition-colors text-sm lg:text-base" to="/regions">Regions / 产地</Link>
          <Link className="text-[#082719]/70 hover:text-[#082719] transition-colors text-sm lg:text-base" to="/journal">Journal / 刊物</Link>
        </div>

        <div className="flex gap-4 md:gap-6 items-center">
          {user ? (
            <Link to="/dashboard" className="text-[#082719]/70 hover:text-[#082719] transition-colors text-xs uppercase tracking-widest hidden sm:block">Account</Link>
          ) : (
            <Link to="/login" className="text-[#082719]/70 hover:text-[#082719] transition-colors text-xs uppercase tracking-widest hidden sm:block">Login</Link>
          )}
          <button className="hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>language</span>
          </button>
          <button onClick={toggleCart} className="hover:opacity-80 transition-opacity relative">
            <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full italic font-headline">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
