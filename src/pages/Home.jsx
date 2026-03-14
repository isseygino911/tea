import { Hero } from '../components/Hero'
import { ScrollReveal } from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

// ─── ticker content (duplicated for seamless loop) ────────────────────────────
const TICKER_TEXT =
  'Farmingdale · Williston Park · New York · Commercial · Industrial · Residential · '

export const Home = () => {
  return (
    <main style={s.main}>
      <Hero />
        {/* ══════════════════════════════════════════════
          SHOWROOM — overlapping images + sharp badge + ticker
          ══════════════════════════════════════════════ */}
      <section style={{ ...s.section, backgroundColor: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
        <div style={s.prism}></div>

        <div className="container">
          <div style={s.showroomGrid}>
            <ScrollReveal>
              <div style={s.showroomText}>
                <p style={s.label}>Showroom Experience</p>
                <h2 style={s.sectionTitle}>
                  Where <span style={{ color: '#fff' }}>Innovation</span>
                  <br />
                  Meets Application
                </h2>
                <p style={s.sectionBody}>
                  Step into our 30,000-square-foot New York warehouse. More than
                  just a store, it&apos;s a living catalog where designers and
                  contractors witness the true power of professional-grade LED
                  technology.
                </p>

                <div style={s.locationCards}>
                  <div style={s.locationCard}>
                    <h4 style={s.locationCity}>Farmingdale</h4>
                    <p style={s.locationAddr}>906 Conklin Street, NY</p>
                    <div style={s.locationStatus}>Flagship Store</div>
                  </div>
                  <div style={s.locationCard}>
                    <h4 style={s.locationCity}>Williston Park</h4>
                    <p style={s.locationAddr}>390 Hillside Ave, NY</p>
                    <div style={s.locationStatus}>Boutique Gallery</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div style={s.visualStack}>
                <div style={s.mainImageWrapper}>
                  <img src="/hero/IMG_0276.jpg" alt="Showroom Main" style={s.mainImage} />
                  <div style={s.imageOverlay}></div>
                </div>
                <div style={s.secondaryImageWrapper}>
                  <img src="/hero/IMG_0274.jpg" alt="Showroom Detail" style={s.secondaryImage} />
                </div>
                {/* Sharp-corner badge (no border-radius) */}
                <div style={s.floatingBadge}>
                  <span style={s.badgeNumber}>30K</span>
                  <span style={s.badgeText}>SQ FT Warehouse</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Horizontal scrolling ticker */}
        <div style={s.tickerWrapper}>
          <div className="ticker-track">
            {[...Array(4)].map((_, i) => (
              <span className="ticker-item" key={i}>{TICKER_TEXT}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          THE LIGHTING MOSAIC
          ══════════════════════════════════════════════ */}
      <section style={s.mosaicSection}>

        {/* Heading */}
        <div className="container">
          <ScrollReveal>
            <div style={s.mosaicHeader}>
              <p style={s.label}>Visual Architecture</p>
              <h2 style={s.mosaicTitle}>
                The Lighting <em style={s.mosaicTitleEm}>Mosaic</em>
              </h2>
            </div>
          </ScrollReveal>
        </div>

        {/* Grid — contained with side padding */}
        <div className="container">
        <div className="mosaic-grid">

          {/* 1 — hero: large left anchor, spans rows 1+2 */}
          <div className="mosaic-cell">
            <img src="/hero/IMG_0276.jpg" alt="Project Alpha" />
            <span className="mosaic-label">Project Alpha · Farmingdale</span>
          </div>

          {/* 2 — top-right wide */}
          <div className="mosaic-cell">
            <img src="/hero/IMG_0275.jpg" alt="Warehouse Flux" />
            <span className="mosaic-label">Warehouse Flux · 30K</span>
          </div>

          {/* 3 — mid right top */}
          <div className="mosaic-cell">
            <img src="/hero/TL_RGBIC.jpg" alt="Neon Pulse" />
            <span className="mosaic-label">Neon Pulse · RGBIC</span>
          </div>

          {/* 4 — mid right bottom */}
          <div className="mosaic-cell">
            <img src="/hero/IMG_0274.jpg" alt="Interior Glow" />
            <span className="mosaic-label">Interior Glow</span>
          </div>

          {/* 5 — bottom left */}
          <div className="mosaic-cell">
            <img src="/hero/FCOB2.jpg" alt="Continuous Linear" />
            <span className="mosaic-label">Continuous Linear</span>
          </div>

          {/* 6 — bottom mid */}
          <div className="mosaic-cell">
            <img src="/hero/IMG_0287.jpg" alt="Retail Precision" />
            <span className="mosaic-label">Retail Precision</span>
          </div>

          {/* 7 — bottom right */}
          <div className="mosaic-cell">
            <img src="/hero/IMG_0292.jpg" alt="Linear Excellence" />
            <span className="mosaic-label">Linear Excellence</span>
          </div>

        </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════
          PHILOSOPHY — two-column, number watermark
          ══════════════════════════════════════════════ */}
      <section style={{ ...s.section, position: 'relative', overflow: 'hidden' }}>
        <span style={s.sectionWatermark}>01</span>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={s.philosophyGrid} className="philosophy-grid">
            {/* Left: amber line */}
            <ScrollReveal>
              <div style={s.philosophyLeft}>
                <div style={s.amberLine}></div>
              </div>
            </ScrollReveal>

            {/* Right: copy */}
            <ScrollReveal delay={1}>
              <div style={s.philosophyRight}>
                <p style={s.label}>Our Vision</p>
                <h2 style={s.philosophyHeading}>
                  Revolutionizing the way we experience{' '}
                  <em style={s.philosophyLight}>Light</em>
                </h2>
                <p style={s.sectionBody}>
                  At LumiNation, we believe high-quality LED lighting is more than
                  just a fixture; it&apos;s the core of productivity, safety, and
                  atmosphere. Our solutions bridge the gap between industrial
                  performance and aesthetic design.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          JOURNAL — section number watermark + taller video
          ══════════════════════════════════════════════ */}
      <section style={{ ...s.section, backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
        {/* Section number watermark */}
        <span style={s.sectionWatermark}>02</span>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <div style={s.journalHeader}>
              <p style={s.label}>The Journal</p>
              <h2 style={s.sectionTitle}>Luminous Impact</h2>
            </div>
          </ScrollReveal>

          <div style={s.journalGrid} className="journal-grid">
            <ScrollReveal delay={1}>
              {/* Amber bottom border on the main story card */}
              <div style={s.mainStory}>
                <div style={s.videoWrapper}>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/GFDUJ924nAc"
                    title="A Trip To A Client Jobsite"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={s.videoIframe}
                  ></iframe>
                </div>
                <div style={s.storyContent}>
                  <span style={s.storyTag}>Project Spotlight</span>
                  <h3 style={s.storyTitle}>A Trip To A Client Jobsite</h3>
                  <p style={s.storyExcerpt}>
                    Witness how we transform commercial spaces. From initial
                    consultation to final delivery, see our team in action as we
                    bring professional lighting solutions to life.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div style={s.sidebarStories}>
              <ScrollReveal delay={2}>
                <div style={s.videoSidebarItem}>
                  <iframe
                    width="100%"
                    height="180px"
                    src="https://www.youtube.com/embed/_h1lN8ijR_c"
                    title="Real Customer Real Experience"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  ></iframe>
                  <div style={{ marginTop: '1rem' }}>
                    <h4 style={s.sidebarTitle}>Real Customer Experience</h4>
                    <p style={s.sidebarText}>
                      Hear from the builders and contractors who rely on LumiNation
                      Corp for their high-stakes projects.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={3}>
                <div style={s.sidebarItem}>
                  <h4 style={s.sidebarTitle}>More Than Just Lighting</h4>
                  <p style={s.sidebarText}>
                    At LuminaCity stores, we don&apos;t just sell lights — we help
                    build successful projects through dedicated onsite consultation
                    and delivery.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT — section number "03", bottom-only inputs
          ══════════════════════════════════════════════ */}
      <section style={{ ...s.section, backgroundColor: 'rgba(255,255,255,0.01)', position: 'relative', overflow: 'hidden' }}>
        <span style={s.sectionWatermark}>03</span>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={s.contactGrid}>
            <ScrollReveal>
              <div>
                <p style={s.label}>Get In Touch</p>
                <h2 style={s.sectionTitle}>Contact Us</h2>
                <div style={s.contactInfo}>
                  <p style={s.contactText}>
                    Call/Text:{' '}
                    <a href="tel:5167747415" style={s.contactLink}>516-774-7415</a>
                  </p>
                  <p style={s.contactText}>
                    Email:{' '}
                    <a href="mailto:LumiNationCorp@gmail.com" style={s.contactLink}>
                      LumiNationCorp@gmail.com
                    </a>
                  </p>
                  <div style={s.hours}>
                    <h4 style={s.infoTitle}>Hours</h4>
                    <p style={s.infoBody}>Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p style={s.infoBody}>Sat - Sun: By Appointment</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <form style={s.form}>
                {/* className="input-line" provides bottom-only borders via global.css */}
                <input
                  type="text"
                  placeholder="Name"
                  className="input-line"
                  style={s.inputBase}
                />
                <input
                  type="email"
                  placeholder="Email*"
                  className="input-line"
                  style={s.inputBase}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone*"
                  className="input-line"
                  style={s.inputBase}
                  required
                />
                <textarea
                  placeholder="Message"
                  className="input-line"
                  style={{ ...s.inputBase, minHeight: '120px', resize: 'vertical' }}
                ></textarea>
                {/* Outlined submit — hover handled by .cta-btn-outline in global.css */}
                <button type="submit" className="cta-btn-outline" style={s.submitBase}>
                  Send Message
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — massive, two-line type treatment
          ══════════════════════════════════════════════ */}
      <section style={s.ctaSection}>
        <div className="container" style={s.ctaContainer}>
          <ScrollReveal>
            {/* Amber accent rule */}
            <div style={s.ctaAmberLine}></div>
            <h2 style={s.ctaHeading}>
              <span style={s.ctaLine1}>ILLUMINATE</span>
              <br />
              <em style={s.ctaLine2}>Your World</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <Link to="/products" className="cta-btn-outline" style={s.ctaLinkBtn}>
              Explore Catalog
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

// ─── styles ──────────────────────────────────────────────────────────────────
const s = {
  main: {
    minHeight: '100vh',
  },

  // ── shared ──
  section: {
    padding: '6rem 0',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '1.5rem',
    display: 'block',
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 5vw, 4rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    marginBottom: '2rem',
  },
  sectionBody: {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.55)',
    maxWidth: '560px',
  },
  sectionWatermark: {
    position: 'absolute',
    top: '0',
    left: '-0.02em',
    fontSize: 'clamp(10rem, 22vw, 22rem)',
    fontWeight: 900,
    color: 'rgba(255,255,255,0.04)',
    lineHeight: 0.85,
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 1,
    letterSpacing: '-0.06em',
  },

  // ── mosaic ──
  mosaicSection: {
    paddingTop: '6rem',
    paddingBottom: '6rem',
  },
  mosaicHeader: {
    marginBottom: '2.5rem',
  },
  mosaicTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  mosaicTitleEm: {
    fontWeight: 300,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
  },

  // ── philosophy ──
  philosophyGrid: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '3rem',
    alignItems: 'flex-start',
  },
  philosophyLeft: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: '0.25rem',
  },
  amberLine: {
    width: '2px',
    height: '80px',
    backgroundColor: '#C8922A',
    marginBottom: '1.5rem',
  },
  philosophyRight: {
    position: 'relative',
    zIndex: 2,
  },
  philosophyHeading: {
    fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    marginBottom: '2rem',
    color: '#ffffff',
  },
  philosophyLight: {
    fontWeight: 100,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
  },

  // ── showroom ──
  prism: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '60%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
    transform: 'rotate(-15deg)',
    pointerEvents: 'none',
  },
  showroomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  showroomText: {},
  locationCards: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '3.5rem',
    flexWrap: 'wrap',
  },
  locationCard: {
    flex: '1',
    minWidth: '200px',
    padding: '2rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  locationCity: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#fff',
  },
  locationAddr: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '1.5rem',
  },
  locationStatus: {
    display: 'inline-block',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    padding: '0.4rem 0.8rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
  },
  visualStack: {
    position: 'relative',
    padding: '2rem',
  },
  mainImageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  mainImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    filter: 'brightness(0.8) contrast(1.1)',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
  },
  secondaryImageWrapper: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '60%',
    overflow: 'hidden',
    border: '4px solid #000',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    zIndex: 3,
  },
  secondaryImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  // Sharp-corner badge — no border-radius
  floatingBadge: {
    position: 'absolute',
    top: '10%',
    right: '-5%',
    padding: '2rem',
    backgroundColor: '#fff',
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 4,
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
  },
  badgeNumber: {
    fontSize: '2.5rem',
    fontWeight: 900,
    lineHeight: 1,
  },
  badgeText: {
    fontSize: '0.6rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginTop: '0.5rem',
  },
  tickerWrapper: {
    overflow: 'hidden',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: '4rem',
    padding: '1.2rem 0',
  },

  // ── journal ──
  journalHeader: {
    marginBottom: '2.5rem',
  },
  journalGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '4rem',
  },
  // Amber bottom border on main story card
  mainStory: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '2px solid #C8922A',
  },
  videoWrapper: {
    position: 'relative',
    height: '500px',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoIframe: {
    border: 'none',
  },
  storyContent: {
    padding: '3rem',
  },
  storyTag: {
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: '0.4rem 0.8rem',
    display: 'inline-block',
    marginBottom: '1.5rem',
  },
  storyTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  storyExcerpt: {
    fontSize: '1rem',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.5)',
  },
  sidebarStories: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  videoSidebarItem: {
    padding: '1.5rem',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  sidebarItem: {
    padding: '2rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  sidebarTitle: {
    fontSize: '1.15rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#fff',
  },
  sidebarText: {
    fontSize: '0.95rem',
    lineHeight: 1.65,
    color: 'rgba(255,255,255,0.4)',
  },

  // ── contact ──
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4rem',
    position: 'relative',
    zIndex: 2,
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
  infoTitle: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '0.75rem',
    fontWeight: 400,
  },
  infoBody: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '0.4rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  // Base style for inputs — .input-line class applies border-bottom-only in global.css
  inputBase: {
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'inherit',
    width: '100%',
  },
  submitBase: {
    marginTop: '1.5rem',
    alignSelf: 'flex-start',
    fontFamily: 'inherit',
  },

  // ── CTA ──
  ctaSection: {
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center',
    padding: '6rem 0',
  },
  ctaContainer: {
    textAlign: 'center',
  },
  ctaAmberLine: {
    width: '80px',
    height: '2px',
    backgroundColor: '#C8922A',
    margin: '0 auto 2.5rem',
  },
  ctaHeading: {
    marginBottom: '3rem',
    lineHeight: 1.05,
  },
  ctaLine1: {
    display: 'block',
    fontSize: 'clamp(4rem, 12vw, 10rem)',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: '#ffffff',
  },
  ctaLine2: {
    display: 'block',
    fontSize: 'clamp(3rem, 9vw, 7.5rem)',
    fontWeight: 100,
    fontStyle: 'italic',
    letterSpacing: '-0.02em',
    color: 'rgba(255,255,255,0.7)',
  },
  ctaLinkBtn: {
    display: 'inline-block',
    textDecoration: 'none',
    fontFamily: 'inherit',
  },
};
