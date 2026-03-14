import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { Search, SlidersHorizontal, Grid2X2, LayoutList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';

export const Products = () => {
  const { addToCart } = useCart();
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductController();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      setDataLoaded(true);
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

  const showLoading = loading || !dataLoaded;

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
          <div style={s.filterToggle} onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={18} />
            <span>Filters</span>
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
          </div>

          <div style={s.viewToggles}>
            <Grid2X2 size={18} />
            <LayoutList size={18} style={{ opacity: 0.3 }} />
          </div>
        </div>

        <div style={s.layoutBody}>
          {/* Sidebar Filters */}
          <aside style={{ ...s.sidebar, display: showFilters ? 'block' : 'none' }}>
            <h3 style={s.sidebarHeading}>Categories</h3>
            <div style={s.sidebarList}>
              <button
                onClick={() => setSelectedCategory('All')}
                style={{
                  ...s.sidebarBtn,
                  color: selectedCategory === 'All' ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontWeight: selectedCategory === 'All' ? '600' : '400',
                }}
              >
                All Systems
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...s.sidebarBtn,
                    color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontWeight: selectedCategory === cat ? '600' : '400',
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
                <p>No specifications found for this filter</p>
              </div>
            ) : (
              <div style={s.grid}>
                {products.map((product, index) => (
                  <ScrollReveal key={product.uuid || product.id} delay={(index % 4) * 0.1}>
                    <div style={s.productTile}>
                      <ProductCard product={product} onAddToCart={addToCart} />
                    </div>
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
    background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.05) 0%, transparent 70%)',
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
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '4rem',
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.3,
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  viewToggles: {
    display: 'flex',
    gap: '1.5rem',
    opacity: 0.5,
  },
  layoutBody: {
    display: 'flex',
    gap: '4rem',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
  },
  sidebarHeading: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '2rem',
    fontWeight: 700,
  },
  sidebarList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sidebarBtn: {
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '0.5rem 0',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  catalogGrid: {
    flex: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '3rem',
  },
  productTile: {
    transition: 'transform 0.4s ease',
  },
  empty: {
    textAlign: 'center',
    padding: '10rem 0',
    color: 'rgba(255,255,255,0.3)',
  },
};
