import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';

export const Products = () => {
  const { addToCart } = useCart();
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductController();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [isSorting, setIsSorting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch categories on mount + mobile detection
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

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [fetchCategories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleNameSort = () => {
    setIsSorting(true);
    if (sortField === 'name') {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField('name');
      setSortOrder('ASC');
    }
  };

  // Fetch products when filters or sort changes
  useEffect(() => {
    const filters = { sort: sortField, order: sortOrder };
    if (search) filters.search = search;
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    fetchProducts(filters).finally(() => setIsSorting(false));
  }, [search, selectedCategory, sortField, sortOrder, fetchProducts]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'All';
  const showLoading = loading && products.length === 0;

  // Grid columns: 4 default desktop, 3 when filter active, 2 on mobile
  const gridCols = isMobile ? 2 : (hasActiveFilters ? 3 : 4);

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
        {/* Filter / Search Bar */}
        <div style={s.controls}>
          {/* Category Dropdown */}
          <div ref={dropdownRef} style={s.dropdownWrapper}>
            <button
              style={{
                ...s.dropdownTrigger,
                color: selectedCategory !== 'All' ? '#C8922A' : 'rgba(255,255,255,0.8)',
                borderColor: selectedCategory !== 'All' ? 'rgba(200,146,42,0.4)' : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => setShowCategoryDropdown(v => !v)}
            >
              <SlidersHorizontal size={15} />
              <span>{selectedCategory === 'All' ? 'Category' : selectedCategory}</span>
              <ChevronDown
                size={14}
                style={{
                  marginLeft: 'auto',
                  transition: 'transform 0.2s',
                  transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {showCategoryDropdown && (
              <div style={s.dropdown}>
                {['All', ...categories].map(cat => (
                  <button
                    key={cat}
                    style={{
                      ...s.dropdownItem,
                      color: selectedCategory === cat ? '#C8922A' : 'rgba(255,255,255,0.7)',
                      backgroundColor: selectedCategory === cat ? 'rgba(200,146,42,0.08)' : 'transparent',
                    }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat === 'All' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={s.searchWrapper}>
            <Search size={16} style={s.searchIcon} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
            />
            {search && (
              <X size={14} style={s.clearSearch} onClick={() => setSearch('')} />
            )}
          </div>

          {/* Sort + meta */}
          <div style={s.rightControls}>
            {hasActiveFilters && (
              <button style={s.clearAllBtn} onClick={clearFilters}>
                Clear All
              </button>
            )}
            <button
              onClick={toggleNameSort}
              style={{
                ...s.sortBtn,
                color: sortField === 'name' ? '#C8922A' : 'rgba(255,255,255,0.4)',
              }}
            >
              <ArrowUpDown size={13} />
              {isMobile ? '' : 'Name '}
              {sortField === 'name' ? (sortOrder === 'ASC' ? 'A–Z' : 'Z–A') : (isMobile ? 'A–Z' : '')}
            </button>
            <span style={s.productCount}>
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Catalog Grid — full width, no sidebar */}
        <div style={s.catalogGrid}>
          {isSorting && (
            <div style={s.inlineLoading}>
              <LoadingBar text="Sorting products..." size="medium" color="#C8922A" />
            </div>
          )}
          {!showLoading && products.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}><Search size={48} /></div>
              <h3>No matches found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button style={s.emptyBtn} onClick={clearFilters}>Clear Search</button>
            </div>
          ) : (
            <div style={{
              ...s.grid,
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            }}>
              {products.map((product, index) => (
                <ScrollReveal key={product.uuid || product.id} delay={(index % gridCols) * 0.04}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </ScrollReveal>
              ))}
            </div>
          )}
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
    gap: '1rem',
    padding: '2rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '3rem',
    flexWrap: 'wrap',
  },
  dropdownWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  dropdownTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    minWidth: '150px',
    transition: 'all 0.2s ease',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    left: 0,
    minWidth: '180px',
    backgroundColor: '#0d0d0d',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.5rem',
    zIndex: 100,
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '0.6rem 0.875rem',
    background: 'none',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    letterSpacing: '0.05em',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    minWidth: '160px',
    maxWidth: '360px',
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
    padding: '0.75rem 2.5rem 0.75rem 2.75rem',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  clearSearch: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    opacity: 0.5,
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  clearAllBtn: {
    background: 'none',
    border: 'none',
    color: '#C8922A',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.4rem 0.75rem',
    borderBottom: '1px solid #C8922A',
  },
  sortBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'none',
    border: 'none',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.2s ease',
    whiteSpace: 'nowrap',
  },
  productCount: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  catalogGrid: {
    width: '100%',
  },
  inlineLoading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem 0',
  },
  grid: {
    display: 'grid',
    gap: '2.5rem 2rem',
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
