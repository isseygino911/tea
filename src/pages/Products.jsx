import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';

export const Products = () => {
  const { addToCart } = useCart();
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductController();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when filters change
  useEffect(() => {
    const filters = {};
    if (search) filters.search = search;
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    fetchProducts(filters);
  }, [search, selectedCategory, fetchProducts]);

  return (
    <main style={styles.main}>
      <div className="container">
        <ScrollReveal>
          <div style={styles.header}>
            <p style={styles.label}>Collection</p>
            <h1 style={styles.title}>All Products</h1>
            <p style={styles.count}>{products.length} items</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <div style={styles.filters}>
            <div style={styles.searchBox}>
              <Search size={18} color="rgba(255,255,255,0.4)" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.categories}>
              <button
                onClick={() => setSelectedCategory('All')}
                style={{
                  ...styles.categoryBtn,
                  backgroundColor: selectedCategory === 'All' ? '#ffffff' : 'transparent',
                  color: selectedCategory === 'All' ? '#000000' : 'rgba(255,255,255,0.6)',
                }}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.categoryBtn,
                    backgroundColor: selectedCategory === cat ? '#ffffff' : 'transparent',
                    color: selectedCategory === cat ? '#000000' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div style={styles.loading}><LoadingBar text="Loading products..." /></div>
        ) : (
          <div style={styles.grid}>
            {products.map((product, index) => (
              <ScrollReveal key={product.uuid || product.id} delay={(index % 4) + 1}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div style={styles.empty}>
            <p>No products found</p>
          </div>
        )}
      </div>
    </main>
  );
};

const styles = {
  main: {
    paddingTop: '150px',
    minHeight: '100vh',
    paddingBottom: '8rem',
  },
  header: {
    marginBottom: '3rem',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '1rem',
  },
  count: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  filters: {
    marginBottom: '3rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
  },
  categories: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    padding: '0.625rem 1.25rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
};
