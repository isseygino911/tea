import { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { ScrollReveal } from '../components/ScrollReveal';
import { ProductCarousel } from '../components/ProductCarousel';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductController } from '../hooks/useProductController';

export const Home = () => {
  const { products, loading, fetchFeatured } = useProductController();

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <main style={styles.main}>
      <Hero />

      {/* Philosophy Section */}
      <section style={styles.section}>
        <div className="container">
          <ScrollReveal>
            <p style={styles.label}>Our Approach</p>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <h2 style={styles.sectionTitle}>
              AI is changing the way we approach
              <br />
              <span style={styles.highlight}>E-commerce</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <p style={styles.sectionBody}>
              We transform the traditional shopping experience into a seamless, 
              intelligent journey. This compresses timelines, eliminates friction, 
              and drives exceptional user experiences.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ ...styles.section, backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Featured</h2>
              <Link to="/products" style={styles.viewAll}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={1}>
            <ProductCarousel products={products} loading={loading} />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.section}>
        <div className="container" style={styles.ctaContainer}>
          <ScrollReveal>
            <h2 style={styles.ctaTitle}>
              Ready to experience
              <br />
              the future?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <Link to="/products" style={styles.ctaButton}>
              Shop Now <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

const styles = {
  main: {
    minHeight: '100vh',
  },
  section: {
    padding: '10rem 0',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 5vw, 4rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    marginBottom: '2rem',
  },
  highlight: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  sectionBody: {
    fontSize: '1.25rem',
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '600px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  viewAll: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
  },
  ctaContainer: {
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 6vw, 5rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    marginBottom: '3rem',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 3rem',
    background: '#ffffff',
    color: '#000000',
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textDecoration: 'none',
  },
};
