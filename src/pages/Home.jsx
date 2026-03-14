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
            <p style={styles.label}>Our Vision</p>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <h2 style={styles.sectionTitle}>
              Revolutionizing the way we experience
              <br />
              <span style={styles.highlight}>Light</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <p style={styles.sectionBody}>
              At LumiNation, we believe high-quality LED lighting is more than just a fixture; 
              it's the core of productivity, safety, and atmosphere. Our solutions bridge 
              the gap between industrial performance and aesthetic design.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Showroom Section */}
      <section style={{ ...styles.section, backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div style={styles.showroomGrid}>
            <ScrollReveal>
              <div style={styles.showroomText}>
                <p style={styles.label}>The Experience</p>
                <h2 style={styles.sectionTitle}>Visit Our Showroom</h2>
                <p style={styles.sectionBody}>
                  LumiNation Corp is a leading distributor boasting a 30,000-square-foot warehouse in New York. 
                  Our showroom stores conveniently serve builders, contractors, designers, and business clients.
                </p>
                <div style={styles.showroomInfo}>
                  <div style={styles.infoItem}>
                    <h4 style={styles.infoTitle}>Farmingdale, NY</h4>
                    <p style={styles.infoBody}>906 Conklin Street</p>
                  </div>
                  <div style={styles.infoItem}>
                    <h4 style={styles.infoTitle}>Williston Park, NY</h4>
                    <p style={styles.infoBody}>390 Hillside Ave</p>
                  </div>
                  <div style={styles.infoItem}>
                    <h4 style={styles.infoTitle}>Coming Soon</h4>
                    <p style={styles.infoBody}>Riverhead & Smithtown, NY</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <div style={styles.showroomImageContainer}>
                <img 
                  src="https://img1.wsimg.com/isteam/ip/448778c0-66aa-410c-a0d5-c72ae2640cf7/blob-a7c4339.png" 
                  alt="Showroom" 
                  style={styles.showroomImage} 
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <div className="container">
          <ScrollReveal>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Featured Products</h2>
              <Link to="/products" style={styles.viewAll}>
                Explore All <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={1}>
            <ProductCarousel products={products} loading={loading} />
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ ...styles.section, backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={styles.contactGrid}>
            <ScrollReveal>
              <div>
                <p style={styles.label}>Get In Touch</p>
                <h2 style={styles.sectionTitle}>Contact Us</h2>
                <div style={styles.contactInfo}>
                  <p style={styles.contactText}>Call/Text: <a href="tel:5167747415" style={styles.contactLink}>516-774-7415</a></p>
                  <p style={styles.contactText}>Email: <a href="mailto:LumiNationCorp@gmail.com" style={styles.contactLink}>LumiNationCorp@gmail.com</a></p>
                  <div style={styles.hours}>
                    <h4 style={styles.infoTitle}>Hours</h4>
                    <p style={styles.infoBody}>Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p style={styles.infoBody}>Sat - Sun: By Appointment</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <form style={styles.form}>
                <input type="text" placeholder="Name" style={styles.input} />
                <input type="email" placeholder="Email*" style={styles.input} required />
                <input type="tel" placeholder="Phone*" style={styles.input} required />
                <textarea placeholder="Message" style={styles.textarea}></textarea>
                <button type="submit" style={styles.ctaButton}>Send Message</button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.section}>
        <div className="container" style={styles.ctaContainer}>
          <ScrollReveal>
            <h2 style={styles.ctaTitle}>
              Ready to upgrade your
              <br />
              lighting experience?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <Link to="/products" style={styles.ctaButton}>
              Explore Catalog <ArrowRight size={20} />
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
  showroomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  showroomInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  infoTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#fff',
  },
  infoBody: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.5)',
  },
  showroomImageContainer: {
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  showroomImage: {
    width: '100%',
    display: 'block',
    filter: 'grayscale(0.2)',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '6rem',
  },
  contactInfo: {
    marginTop: '2rem',
  },
  contactText: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: 'rgba(255,255,255,0.7)',
  },
  contactLink: {
    color: '#fff',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  hours: {
    marginTop: '3rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  input: {
    padding: '1.25rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    padding: '1.25rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '1rem',
    minHeight: '150px',
    outline: 'none',
    resize: 'vertical',
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
    border: 'none',
    cursor: 'pointer',
  },
};
