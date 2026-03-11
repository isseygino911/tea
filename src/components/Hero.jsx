
export const Hero = () => {
  return (
    <section style={styles.hero}>
      <div style={styles.content}>
        <h1 style={styles.headline}>
          <span style={styles.line}>The future is built on</span>
          <br />
          <span style={styles.line}>Artificial Intelligence.</span>
        </h1>
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
  },
  content: {
    maxWidth: '1200px',
    animation: 'fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  headline: {
    fontSize: 'clamp(2.5rem, 8vw, 7rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.04em',
  },
  line: {
    display: 'inline-block',
  },
};
