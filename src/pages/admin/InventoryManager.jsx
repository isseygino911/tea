import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  AlertTriangle,
  Calendar,
  RefreshCw,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Check,
  Loader2,
  ArrowRightLeft,
  ShoppingCart,
  RotateCcw,
  Trash2,
  Clock,
} from 'lucide-react';
import { useInventoryController } from '../../hooks/useInventoryController';
import { useProductController } from '../../hooks/useProductController';
import { ScrollReveal } from '../../components/ScrollReveal';

// Status indicator component
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'in_stock':
        return { color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.15)', label: 'In Stock' };
      case 'low':
        return { color: '#FFC107', bg: 'rgba(255, 193, 7, 0.15)', label: 'Low Stock' };
      case 'critical':
        return { color: '#F44336', bg: 'rgba(244, 67, 54, 0.15)', label: 'Critical' };
      case 'out_of_stock':
        return { color: '#9E9E9E', bg: 'rgba(158, 158, 158, 0.15)', label: 'Out of Stock' };
      default:
        return { color: '#9E9E9E', bg: 'rgba(158, 158, 158, 0.15)', label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
        }}
      />
      {config.label}
    </span>
  );
};

// Transaction type badge
const TransactionBadge = ({ type }) => {
  const getConfig = () => {
    switch (type) {
      case 'sale':
        return { icon: ShoppingCart, color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.15)', label: 'Sale' };
      case 'restock':
        return { icon: Plus, color: '#2196F3', bg: 'rgba(33, 150, 243, 0.15)', label: 'Restock' };
      case 'adjustment':
        return { icon: ArrowRightLeft, color: '#FF9800', bg: 'rgba(255, 152, 0, 0.15)', label: 'Adjustment' };
      case 'cancellation':
        return { icon: X, color: '#F44336', bg: 'rgba(244, 67, 54, 0.15)', label: 'Cancellation' };
      case 'return':
        return { icon: RotateCcw, color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.15)', label: 'Return' };
      default:
        return { icon: ArrowRightLeft, color: '#9E9E9E', bg: 'rgba(158, 158, 158, 0.15)', label: type };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <ScrollReveal>
    <div style={styles.summaryCard}>
      <div style={{ ...styles.summaryIcon, backgroundColor: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      <div style={styles.summaryContent}>
        <p style={styles.summaryTitle}>{title}</p>
        <p style={styles.summaryValue}>{value}</p>
        {subtitle && <p style={styles.summarySubtitle}>{subtitle}</p>}
      </div>
    </div>
  </ScrollReveal>
);

// Stock Adjustment Modal
const AdjustStockModal = ({ product, onClose, onAdjust, loading }) => {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty !== 0 && reason.trim()) {
      onAdjust(product.id, qty, reason.trim());
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Adjust Stock</h3>
          <button style={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.modalProduct}>
            <img src={product.image_url} alt={product.name} style={styles.modalProductImage} />
            <div>
              <p style={styles.modalProductName}>{product.name}</p>
              <p style={styles.modalProductSku}>{product.model || product.sku || 'No SKU'}</p>
            </div>
          </div>
          <div style={styles.currentStock}>
            <span>Current Stock:</span>
            <span style={styles.currentStockValue}>{product.stock_quantity || 0}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Adjustment Quantity (+/-)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., +10 or -5"
                style={styles.formInput}
                autoFocus
              />
              <p style={styles.formHint}>Use positive numbers to add stock, negative to remove</p>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={styles.formSelect}
              >
                <option value="">Select a reason...</option>
                <option value="restock">Restock - New shipment received</option>
                <option value="damaged">Damaged goods</option>
                <option value="return">Customer return</option>
                <option value="correction">Inventory correction</option>
                <option value="other">Other</option>
              </select>
            </div>
            {reason === 'other' && (
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Custom Reason</label>
                <input
                  type="text"
                  value={reason === 'other' ? '' : reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter custom reason..."
                  style={styles.formInput}
                />
              </div>
            )}
            <div style={styles.modalActions}>
              <button type="button" style={styles.modalCancel} onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...styles.modalSubmit,
                  opacity: !quantity || !reason || loading ? 0.5 : 1,
                }}
                disabled={!quantity || !reason || loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Confirm Adjustment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const InventoryManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState({
    type: '',
    product_id: '',
    page: 1,
  });
  const [isMobile, setIsMobile] = useState(false);

  const {
    transactions,
    lowStockProducts,
    reservations,
    loading,
    error,
    fetchTransactions,
    adjustStock,
    fetchLowStockProducts,
    fetchReservations,
    clearError,
  } = useInventoryController();

  const { products, fetchProducts } = useProductController();

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchLowStockProducts(),
          fetchReservations(true),
          fetchTransactions({ page: 1 }),
        ]);
      } catch (err) {
        console.error('Failed to load inventory data:', err);
      }
    };
    loadData();
  }, [fetchProducts, fetchLowStockProducts, fetchReservations, fetchTransactions]);

  // Refresh transactions when filters change
  useEffect(() => {
    fetchTransactions(transactionFilters);
  }, [transactionFilters, fetchTransactions]);

  // Calculate inventory stats
  const getInventoryStats = useCallback(() => {
    const totalProducts = products.length;
    const lowStockCount = lowStockProducts.length;
    const activeReservations = reservations.length;
    const todaysTransactions = transactions.filter((t) => {
      const today = new Date().toISOString().split('T')[0];
      return t.created_at?.startsWith(today);
    }).length;

    return {
      totalProducts,
      lowStockCount,
      activeReservations,
      todaysTransactions,
    };
  }, [products, lowStockProducts, reservations, transactions]);

  const stats = getInventoryStats();

  // Filter products by search term
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get stock status for a product
  const getStockStatus = (product) => {
    const qty = product.stock_quantity || 0;
    const threshold = product.low_stock_threshold || 10;
    if (qty === 0) return 'out_of_stock';
    if (qty <= threshold * 0.3) return 'critical';
    if (qty <= threshold) return 'low';
    return 'in_stock';
  };

  // Handle stock adjustment
  const handleAdjustStock = async (productId, quantity, reason) => {
    try {
      await adjustStock(productId, quantity, reason);
      setShowAdjustModal(false);
      setSelectedProduct(null);
      // Refresh data
      await Promise.all([fetchProducts(), fetchLowStockProducts(), fetchTransactions({ page: 1 })]);
    } catch (err) {
      // Error is handled by the controller
    }
  };

  // Handle reservation release
  const handleReleaseReservation = async (reservationId) => {
    // This would call an API endpoint to release the reservation
    // For now, we'll just refresh the reservations
    await fetchReservations(true);
  };

  // Export to CSV placeholder
  const handleExportCSV = () => {
    alert('Export to CSV feature coming soon!');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const renderOverviewTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <div style={styles.searchWrapper}>
          <Search size={16} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by product name, SKU, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <X size={14} style={styles.clearSearch} onClick={() => setSearchTerm('')} />
          )}
        </div>
        <button style={styles.exportBtn} onClick={handleExportCSV}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Product</th>
              <th style={styles.tableHeader}>SKU/Model</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Physical Stock</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Reserved</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Available</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              const reserved = reservations
                .filter((r) => r.product_id === product.id)
                .reduce((sum, r) => sum + (r.quantity || 0), 0);
              const available = (product.stock_quantity || 0) - reserved;

              return (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.productCell}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={styles.productImage}
                      />
                      <span style={styles.productName}>{product.name}</span>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.skuText}>{product.model || product.sku || '-'}</span>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <span style={styles.stockValue}>{product.stock_quantity || 0}</span>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <span style={{ ...styles.stockValue, color: reserved > 0 ? '#FFC107' : 'inherit' }}>
                      {reserved}
                    </span>
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <span
                      style={{
                        ...styles.stockValue,
                        color: available <= 0 ? '#F44336' : available <= 5 ? '#FFC107' : '#4CAF50',
                        fontWeight: 700,
                      }}
                    >
                      {available}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <StatusBadge status={status} />
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                    <button
                      style={styles.adjustBtn}
                      onClick={() => {
                        setSelectedProduct({ ...product, reserved });
                        setShowAdjustModal(true);
                      }}
                    >
                      <RefreshCw size={14} />
                      Adjust
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div style={styles.emptyState}>
            <Package size={48} style={styles.emptyIcon} />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <div style={styles.filterGroup}>
          <select
            value={transactionFilters.type}
            onChange={(e) =>
              setTransactionFilters((prev) => ({ ...prev, type: e.target.value, page: 1 }))
            }
            style={styles.filterSelect}
          >
            <option value="">All Types</option>
            <option value="sale">Sale</option>
            <option value="restock">Restock</option>
            <option value="adjustment">Adjustment</option>
            <option value="cancellation">Cancellation</option>
            <option value="return">Return</option>
          </select>
        </div>
        <button style={styles.exportBtn} onClick={handleExportCSV}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Product</th>
              <th style={styles.tableHeader}>Type</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Qty</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Stock Change</th>
              <th style={styles.tableHeader}>Reason</th>
              <th style={styles.tableHeader}>User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <span style={styles.dateText}>{formatDate(transaction.created_at)}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.productNameSmall}>
                    {transaction.product_name || `Product #${transaction.product_id}`}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <TransactionBadge type={transaction.transaction_type} />
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                  <span
                    style={{
                      ...styles.quantityText,
                      color: transaction.quantity > 0 ? '#4CAF50' : '#F44336',
                    }}
                  >
                    {transaction.quantity > 0 ? '+' : ''}
                    {transaction.quantity}
                  </span>
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                  <span style={styles.stockChangeText}>
                    {transaction.previous_quantity} → {transaction.new_quantity}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.reasonText}>{transaction.reason || '-'}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.userText}>{transaction.user_name || 'System'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div style={styles.emptyState}>
            <RotateCcw size={48} style={styles.emptyIcon} />
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={styles.paginationBtn}
          disabled={transactionFilters.page <= 1}
          onClick={() =>
            setTransactionFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
        >
          <ChevronLeft size={16} />
        </button>
        <span style={styles.paginationText}>Page {transactionFilters.page}</span>
        <button
          style={styles.paginationBtn}
          onClick={() =>
            setTransactionFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderReservationsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <p style={styles.tabDescription}>
          Active stock reservations for pending orders. These quantities are held and unavailable for other orders.
        </p>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Order #</th>
              <th style={styles.tableHeader}>Product</th>
              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Quantity</th>
              <th style={styles.tableHeader}>Reserved At</th>
              <th style={styles.tableHeader}>Expires At</th>
              <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <span style={styles.orderNumber}>#{reservation.order_id}</span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.productCell}>
                    <img
                      src={reservation.product_image}
                      alt={reservation.product_name}
                      style={styles.productImageSmall}
                    />
                    <span style={styles.productNameSmall}>{reservation.product_name}</span>
                  </div>
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                  <span style={styles.reservationQty}>{reservation.quantity}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.dateText}>{formatDate(reservation.reserved_at)}</span>
                </td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.dateText,
                      color: new Date(reservation.expires_at) < new Date() ? '#F44336' : 'inherit',
                    }}
                  >
                    {formatDate(reservation.expires_at)}
                  </span>
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                  <button
                    style={styles.releaseBtn}
                    onClick={() => handleReleaseReservation(reservation.id)}
                    title="Release reservation"
                  >
                    <Trash2 size={14} />
                    Release
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && (
          <div style={styles.emptyState}>
            <Calendar size={48} style={styles.emptyIcon} />
            <p>No active reservations</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLowStockTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <p style={styles.tabDescription}>
          Products that have fallen below their low stock threshold. Consider restocking these items soon.
        </p>
      </div>

      <div style={styles.lowStockGrid}>
        {lowStockProducts.map((product) => {
          const status = getStockStatus(product);
          const isCritical = status === 'critical' || status === 'out_of_stock';

          return (
            <ScrollReveal key={product.id}>
              <div
                style={{
                  ...styles.lowStockCard,
                  borderColor: isCritical ? '#F44336' : '#FFC107',
                  backgroundColor: isCritical ? 'rgba(244, 67, 54, 0.05)' : 'rgba(255, 193, 7, 0.05)',
                }}
              >
                <div style={styles.lowStockHeader}>
                  <StatusBadge status={status} />
                  {isCritical && (
                    <span style={styles.urgentBadge}>
                      <AlertTriangle size={12} />
                      Urgent
                    </span>
                  )}
                </div>
                <div style={styles.lowStockProduct}>
                  <img src={product.image_url} alt={product.name} style={styles.lowStockImage} />
                  <div style={styles.lowStockInfo}>
                    <h4 style={styles.lowStockName}>{product.name}</h4>
                    <p style={styles.lowStockSku}>{product.model || product.sku || 'No SKU'}</p>
                  </div>
                </div>
                <div style={styles.lowStockStats}>
                  <div style={styles.lowStockStat}>
                    <span style={styles.lowStockStatLabel}>Current Stock</span>
                    <span
                      style={{
                        ...styles.lowStockStatValue,
                        color: isCritical ? '#F44336' : '#FFC107',
                      }}
                    >
                      {product.stock_quantity || 0}
                    </span>
                  </div>
                  <div style={styles.lowStockStat}>
                    <span style={styles.lowStockStatLabel}>Threshold</span>
                    <span style={styles.lowStockStatValue}>{product.low_stock_threshold || 10}</span>
                  </div>
                </div>
                <button
                  style={{
                    ...styles.restockBtn,
                    backgroundColor: isCritical ? '#F44336' : '#FFC107',
                    color: isCritical ? '#fff' : '#000',
                  }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowAdjustModal(true);
                  }}
                >
                  <Plus size={16} />
                  Restock Now
                </button>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {lowStockProducts.length === 0 && (
        <div style={styles.emptyState}>
          <Check size={48} style={{ ...styles.emptyIcon, color: '#4CAF50' }} />
          <p>All products are well stocked!</p>
          <p style={styles.emptySubtext}>No items below threshold</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div className="container" style={styles.content}>
        {/* Page Header */}
        <ScrollReveal>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Inventory Management</h1>
            <p style={styles.pageSubtitle}>
              Manage stock levels, track transactions, and monitor inventory health
            </p>
          </div>
        </ScrollReveal>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <SummaryCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="#2196F3"
            subtitle="Active in catalog"
          />
          <SummaryCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            icon={AlertTriangle}
            color="#FFC107"
            subtitle="Need attention"
          />
          <SummaryCard
            title="Active Reservations"
            value={stats.activeReservations}
            icon={Clock}
            color="#9C27B0"
            subtitle="Pending orders"
          />
          <SummaryCard
            title="Today's Transactions"
            value={stats.todaysTransactions}
            icon={RotateCcw}
            color="#4CAF50"
            subtitle="Stock movements"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBanner}>
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button style={styles.errorClose} onClick={clearError}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsList}>
            {[
              { id: 'overview', label: 'Overview', icon: Package },
              { id: 'transactions', label: 'Transactions', icon: RotateCcw },
              { id: 'reservations', label: 'Reservations', icon: Calendar },
              { id: 'lowstock', label: 'Low Stock Alerts', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  style={{
                    ...styles.tabButton,
                    backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                    borderColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {!isMobile && tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={styles.tabPanel}>
            {loading && !showAdjustModal ? (
              <div style={styles.loadingState}>
                <Loader2 size={32} className="spin" />
                <p>Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'transactions' && renderTransactionsTab()}
                {activeTab === 'reservations' && renderReservationsTab()}
                {activeTab === 'lowstock' && renderLowStockTab()}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedProduct && (
        <AdjustStockModal
          product={selectedProduct}
          onClose={() => {
            setShowAdjustModal(false);
            setSelectedProduct(null);
          }}
          onAdjust={handleAdjustStock}
          loading={loading}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '100px',
    minHeight: '100vh',
    paddingBottom: '8rem',
    backgroundColor: '#000',
  },
  content: {
    maxWidth: '1400px',
  },
  pageHeader: {
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#fff',
  },
  pageSubtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  summaryIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.25rem',
  },
  summaryValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.25rem',
  },
  summarySubtitle: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    color: '#F44336',
  },
  errorClose: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#F44336',
    cursor: 'pointer',
  },
  tabsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  tabsList: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    overflowX: 'auto',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  tabPanel: {
    padding: '1.5rem',
  },
  tabContent: {
    minHeight: '400px',
  },
  tabHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  tabDescription: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    minWidth: '200px',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 2.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  clearSearch: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  filterGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.875rem',
    cursor: 'pointer',
    minWidth: '140px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tableHeader: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  productImage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  productImageSmall: {
    width: '32px',
    height: '32px',
    objectFit: 'cover',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  productName: {
    fontWeight: 600,
    color: '#fff',
  },
  productNameSmall: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  skuText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace',
  },
  stockValue: {
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  adjustBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.875rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  dateText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  quantityText: {
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  stockChangeText: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'monospace',
  },
  reasonText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  orderNumber: {
    fontSize: '0.875rem',
    color: '#C8922A',
    fontWeight: 600,
    fontFamily: 'monospace',
  },
  reservationQty: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#9C27B0',
  },
  releaseBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.875rem',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid rgba(244, 67, 54, 0.2)',
    borderRadius: '6px',
    color: '#F44336',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  paginationBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
  },
  paginationText: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  lowStockGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  lowStockCard: {
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid',
  },
  lowStockHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  urgentBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderRadius: '4px',
    color: '#F44336',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  lowStockProduct: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    marginBottom: '1rem',
  },
  lowStockImage: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  lowStockInfo: {
    flex: 1,
  },
  lowStockName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: '0.25rem',
  },
  lowStockSku: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontFamily: 'monospace',
  },
  lowStockStats: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  lowStockStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  lowStockStatLabel: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  lowStockStatValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  restockBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  emptyIcon: {
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptySubtext: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    color: 'rgba(255, 255, 255, 0.5)',
    gap: '1rem',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#0d0d0d',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  modalBody: {
    padding: '1.5rem',
  },
  modalProduct: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    marginBottom: '1rem',
  },
  modalProductImage: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalProductName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: '0.25rem',
  },
  modalProductSku: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  currentStock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: '8px',
    marginBottom: '1.25rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  currentStockValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#2196F3',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  formLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  formInput: {
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formSelect: {
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  formHint: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '0.5rem',
    marginBottom: 0,
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  modalCancel: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalSubmit: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
