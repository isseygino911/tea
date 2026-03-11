import { ProductCard } from './ProductCard';

const sampleProducts = [
  { id: 1, name: 'Minimal Watch', category: 'Accessories', price: 299, image: '' },
  { id: 2, name: 'Leather Backpack', category: 'Bags', price: 189, image: '' },
  { id: 3, name: 'Wireless Earbuds', category: 'Electronics', price: 159, image: '' },
  { id: 4, name: 'Ceramic Vase', category: 'Home', price: 89, image: '' },
  { id: 5, name: 'Desk Lamp', category: 'Lighting', price: 129, image: '' },
  { id: 6, name: 'Notebook Set', category: 'Stationery', price: 45, image: '' },
  { id: 7, name: 'Coffee Maker', category: 'Kitchen', price: 249, image: '' },
  { id: 8, name: 'Bluetooth Speaker', category: 'Electronics', price: 199, image: '' },
];

export const ProductGrid = ({ onAddToCart }) => {
  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.header}>
          <h2 style={styles.title}>Featured Products</h2>
          <a href="/products" style={styles.link}>View All →</a>
        </div>
        <div style={styles.grid}>
          {sampleProducts.map((product) => (
            <div key={product.uuid || product.id} data-product-card>
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '6rem 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'color 0.2s',
    ':hover': {
      color: 'var(--text-primary)',
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
};
