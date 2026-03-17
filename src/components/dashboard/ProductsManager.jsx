import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAdminController } from '../../hooks/useAdminController';
import { adminAPI } from '../../services/adminAPI';
import { ProductFormModal } from './ProductFormModal';
import { LoadingBar } from '../ui/LoadingBar';

const categories = ['All', 'Accessories', 'Bags', 'Electronics', 'Home', 'Lighting', 'Stationery', 'Kitchen'];

export const ProductsManager = () => {
  const { products, loading, fetchAdminProducts, deleteProduct } = useAdminController();
  const [localLoading, setLocalLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setLocalLoading(true);
    const filters = {};
    if (search) filters.search = search;
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    await fetchAdminProducts(filters);
    setLocalLoading(false);
  }, [search, selectedCategory, fetchAdminProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      // Error handled by controller
    }
  };

  const handleEdit = async (product) => {
    // Fetch full product details with all images
    try {
      const res = await adminAPI.getProduct(product.id);
      setEditingProduct({
        ...res.data.product,
        images: res.data.images || []
      });
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      // Fallback to basic product data
      setEditingProduct(product);
      setModalOpen(true);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleSaveSuccess = () => {
    loadProducts();
    setModalOpen(false);
  };

  const isLoading = loading || localLoading;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Products</h2>
        <button onClick={handleAdd} style={styles.addBtn}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
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

      {/* Products Table */}
      {isLoading ? (
        <div style={styles.loading}><LoadingBar text="Loading products..." /></div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      <div style={styles.productImage}>
                        <img 
                          src={product.image_url || `https://via.placeholder.com/50x65/111/333?text=${encodeURIComponent(product.name)}`}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <p style={styles.productName}>{product.name}</p>
                        <p style={styles.productId}>{product.uuid ? product.uuid.slice(0, 8).toUpperCase() : `#${product.id}`}</p>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{product.category}</td>
                  <td style={styles.td}>${product.price}</td>
                  <td style={styles.td}>{product.stock_quantity}</td>
                  <td style={styles.td}>
                    <span style={{...styles.status, ...styles[product.status]}}>
                      {product.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => handleEdit(product)} style={styles.actionBtn}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div style={styles.empty}>No products found</div>
          )}
        </div>
      )}

      <ProductFormModal
        product={editingProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSuccess}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#000000',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  filters: {
    marginBottom: '1.5rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
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
    fontSize: '0.9rem',
    outline: 'none',
  },
  categories: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255,255,255,0.5)',
  },
  tableContainer: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 300px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px',
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap',
    backgroundColor: '#0a0a0a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  tr: {},
  td: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    whiteSpace: 'nowrap',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  productImage: {
    width: '50px',
    height: '65px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  productName: {
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  productId: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'monospace',
  },
  status: {
    display: 'inline-flex',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  active: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    color: '#22c55e',
  },
  inactive: {
    backgroundColor: 'rgba(156,163,175,0.1)',
    color: '#9ca3af',
  },
  out_of_stock: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '0.5rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: 'none',
    borderRadius: '6px',
    color: '#ef4444',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255,255,255,0.5)',
  },
};
