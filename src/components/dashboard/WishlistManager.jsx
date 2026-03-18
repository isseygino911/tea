import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import { LoadingBar } from '../ui/LoadingBar';
import { SortableHeader } from './SortableHeader';

export const WishlistManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('wish_count');
  const [sortOrder, setSortOrder] = useState('DESC');

  const loadWishlistStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getWishlistStats();
      setItems(res.data.items || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlistStats();
  }, [loadWishlistStats]);

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const sortedItems = [...items].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (aVal < bVal) return sortOrder === 'ASC' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Wishlist</h2>
        <div style={styles.totalBadge}>
          <Heart size={14} />
          <span>{items.reduce((s, i) => s + (i.wish_count || 0), 0)} total wishes</span>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}><LoadingBar text="Loading wishlist stats..." /></div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <SortableHeader label="Product" sortKey="name" currentSort={sortField} currentOrder={sortOrder} onSort={handleSort} style={{ width: '40%' }} />
                <SortableHeader label="Category" sortKey="category" currentSort={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Price" sortKey="price" currentSort={sortField} currentOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Wishes" sortKey="wish_count" currentSort={sortField} currentOrder={sortOrder} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.product_id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      <div style={styles.productImage}>
                        <img
                          src={item.image_url || `https://via.placeholder.com/50x65/111/333?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={styles.productName}>{item.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>${parseFloat(item.price).toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={styles.wishBadge}>
                      <Heart size={12} />
                      {item.wish_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedItems.length === 0 && (
            <div style={styles.empty}>No wishlist data yet</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '1.5rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: { fontSize: '1.25rem', fontWeight: 600 },
  totalBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '20px',
    color: '#ef4444',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  loading: { textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' },
  tableContainer: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 300px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  tr: {},
  td: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    whiteSpace: 'nowrap',
  },
  productCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  productImage: {
    width: '40px',
    height: '52px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#111',
    flexShrink: 0,
  },
  productName: { fontSize: '0.875rem', fontWeight: 500 },
  wishBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  empty: { textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' },
};
