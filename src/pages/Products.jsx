import { useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import mockCatalog from '../mock_catalog.json';

export const Products = () => {
  const { addToCart } = useCart();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState('ASC'); // ASC or DESC
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  const categories = ['All', 'Coffee', 'Tea'];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredProducts = mockCatalog
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.origin_location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'ASC') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'All';
  const gridCols = isMobile ? 2 : (hasActiveFilters ? 3 : 4);

  return (
    <main className="bg-surface min-h-screen pt-24 pb-32">
      {/* Header */}
      <section className="bg-surface-container py-16 md:py-24 border-b border-primary/5 mb-12">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">Our Collection · 产品系列</p>
              <h1 className="font-headline text-4xl md:text-7xl font-bold mb-6 italic leading-tight text-primary">
                Single-origin coffee<br />
                <span className="opacity-40 not-italic font-light">and specialty tea.</span>
              </h1>
              <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg font-light">
                Yunnan Arabica and Hubei loose-leaf — direct-trade pricing, producer-verified origins.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-12 border-b border-primary/5 mb-16">
          {/* Category Dropdown */}
          <div ref={dropdownRef} className="relative w-full md:w-auto">
            <button
              className={`flex items-center gap-3 px-6 py-3 border transition-all text-xs uppercase tracking-widest font-medium w-full md:min-w-[180px] ${selectedCategory !== 'All' ? 'border-primary text-primary bg-surface' : 'border-primary/10 text-primary/60 bg-surface-container-low'}`}
              onClick={() => setShowCategoryDropdown(v => !v)}
            >
              <SlidersHorizontal size={14} />
              <span>{selectedCategory === 'All' ? 'Category' : selectedCategory}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full md:min-w-[200px] bg-surface border border-primary/10 p-2 z-50 shadow-xl">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`block w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest transition-colors ${selectedCategory === cat ? 'bg-primary/5 text-primary font-bold' : 'hover:bg-primary/5 text-primary/60'}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat === 'All' ? 'All Collections' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-surface-container-low border border-primary/10 text-primary text-xs uppercase tracking-widest placeholder:text-primary/20 focus:outline-none focus:border-primary/30 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort + count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-8 ml-auto">
            <button
              onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary/60 hover:text-primary transition-colors"
            >
              <ArrowUpDown size={12} />
              <span>Name {sortOrder === 'ASC' ? 'A–Z' : 'Z–A'}</span>
            </button>
            <span className="text-[10px] uppercase tracking-widest text-primary/30 font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[400px]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <Search size={48} className="mx-auto mb-6 text-primary/10" />
              <h3 className="font-headline italic text-2xl text-primary/60 mb-2">No matches found</h3>
              <p className="text-sm text-primary/40 mb-8 uppercase tracking-widest">Try adjusting your filters</p>
              <button onClick={clearFilters} className="px-8 py-3 border border-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-on-primary transition-all">Clear All Filters</button>
            </div>
          ) : (
            <div className={`grid gap-x-8 gap-y-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
              {filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={(index % 4) * 0.05}>
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
