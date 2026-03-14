
export const Hero = () => {
  return (
    <section style={styles.hero}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <p style={styles.subtitle}>Premium LED Lighting Solutions</p>
        <h1 style={styles.headline}>
          <span style={styles.line}>Illuminate Your Space</span>
          <br />
          <span style={styles.line}>With <span style={{ color: '#fff' }}>Excellence.</span></span>
        </h1>
        <p style={styles.description}>
          LumiNation Corp is a leading distributor of high-quality commercial and industrial LED lighting fixtures.
        </p>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    textAlign: 'center',
    padding: '2rem',
    backgroundImage: 'url("https://img1.wsimg.com/isteam/ip/448778c0-66aa-410c-a0d5-c72ae2640cf7/IMG_0276.jpg/:/rs=w:1920,h:1080")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  content: {
    maxWidth: '1200px',
    position: 'relative',
    zIndex: 2,
    animation: 'fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  subtitle: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '1.5rem',
  },
  headline: {
    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.04em',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '2rem',
  },
  line: {
    display: 'inline-block',
  },
  description: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
};
