import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { Search, SlidersHorizontal, Grid2X2, LayoutList, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';

export const Products = () => {
  const { addToCart } = useCart();
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductController();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const init = async () => {
      try {
        await fetchCategories();
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setDataLoaded(true);
      }
    };
    init();
  }, [fetchCategories]);

  // Fetch products when filters change
  useEffect(() => {
    const filters = {};
    if (search) filters.search = search;
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    fetchProducts(filters);
  }, [search, selectedCategory, fetchProducts]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'All';
  const showLoading = loading && products.length === 0;

  return (
    <main style={s.main}>
      {showLoading && <LoadingBar fullPage text="Luminating Products..." />}
      
      {/* Immersive Header */}
      <section style={s.headerSection}>
        <div className="container">
          <ScrollReveal>
            <div style={s.headerContent}>
              <p style={s.label}>Our Collection</p>
              <h1 style={s.title}>Precision <span style={s.titleThin}>Engineering.</span></h1>
              <p style={s.subtitle}>Distributing world-class commercial LED solutions for the modern industrial landscape.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container" style={s.catalogContainer}>
        {/* Modern Filter Bar */}
        <div style={s.controls}>
          <div 
            style={{
              ...s.filterToggle,
              color: showFilters ? '#C8922A' : '#fff'
            }} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </div>
          
          <div style={s.searchWrapper}>
            <Search size={18} style={s.searchIcon} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
            />
            {search && (
              <X 
                size={16} 
                style={s.clearSearch} 
                onClick={() => setSearch('')} 
              />
            )}
          </div>

          {hasActiveFilters && (
            <button style={s.clearAllBtn} onClick={clearFilters}>
              Clear All
            </button>
          )}

          <div style={s.viewToggles}>
            <span style={s.productCount}>
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>
            <div style={s.toggleIcons}>
              <Grid2X2 size={18} style={{ color: '#C8922A' }} />
              <LayoutList size={18} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </div>

        <div style={s.layoutBody}>
          {/* Sidebar Filters */}
          <aside style={{ 
            ...s.sidebar, 
            display: showFilters ? 'block' : 'none',
            opacity: showFilters ? 1 : 0,
            transform: showFilters ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.4s ease'
          }}>
            <h3 style={s.sidebarHeading}>Systems</h3>
            <div style={s.sidebarList}>
              <button
                onClick={() => setSelectedCategory('All')}
                style={{
                  ...s.sidebarBtn,
                  color: selectedCategory === 'All' ? '#fff' : 'rgba(255,255,255,0.4)',
                  borderLeft: selectedCategory === 'All' ? '2px solid #C8922A' : '2px solid transparent',
                  paddingLeft: selectedCategory === 'All' ? '1rem' : '0.5rem',
                }}
              >
                All Architecture
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...s.sidebarBtn,
                    color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.4)',
                    borderLeft: selectedCategory === cat ? '2px solid #C8922A' : '2px solid transparent',
                    paddingLeft: selectedCategory === cat ? '1rem' : '0.5rem',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Catalog Grid */}
          <div style={s.catalogGrid}>
            {!showLoading && products.length === 0 ? (
              <div style={s.empty}>
                <div style={s.emptyIcon}><Search size={48} /></div>
                <h3>No matches found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button style={s.emptyBtn} onClick={clearFilters}>Clear Search</button>
              </div>
            ) : (
              <div style={s.grid}>
                {products.map((product, index) => (
                  <ScrollReveal key={product.uuid || product.id} delay={(index % 4) * 0.05}>
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const s = {
  main: {
    backgroundColor: '#000',
    minHeight: '100vh',
    paddingBottom: '10rem',
  },
  headerSection: {
    padding: '12rem 0 6rem 0',
    background: 'radial-gradient(circle at 50% -20%, rgba(200,146,42,0.1) 0%, transparent 70%)',
  },
  headerContent: {
    maxWidth: '800px',
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '1.5rem',
    fontWeight: 600,
  },
  title: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.04em',
    marginBottom: '2rem',
    color: '#fff',
  },
  titleThin: {
    fontWeight: 200,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.4)',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
    maxWidth: '600px',
  },
  catalogContainer: {
    marginTop: '2rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '4rem',
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    transition: 'all 0.3s ease',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.3,
  },
  searchInput: {
    width: '100%',
    padding: '1rem 3.5rem 1rem 3.5rem',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  clearSearch: {
    position: 'absolute',
    right: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'opacity 0.2s ease',
  },
  clearAllBtn: {
    background: 'none',
    border: 'none',
    color: '#C8922A',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid #C8922A',
  },
  viewToggles: {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
  },
  productCount: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 500,
  },
  toggleIcons: {
    display: 'flex',
    gap: '1.5rem',
  },
  layoutBody: {
    display: 'flex',
    gap: '6rem',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
  },
  sidebarHeading: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.25)',
    marginBottom: '2.5rem',
    fontWeight: 800,
  },
  sidebarList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  sidebarBtn: {
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '1rem 0.5rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  catalogGrid: {
    flex: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '4rem 3rem',
  },
  empty: {
    textAlign: 'center',
    padding: '10rem 0',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyIcon: {
    marginBottom: '2rem',
    opacity: 0.2,
  },
  emptyBtn: {
    marginTop: '2rem',
    padding: '1rem 2.5rem',
    background: '#fff',
    color: '#000',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  },
};
