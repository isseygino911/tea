import React from 'react';

export const Hero = () => (
  <section style={s.hero}>
    {/* Background Image Layer */}
    <div style={s.bgLayer} />
    
    {/* Mist/Cloud Layers */}
    <div style={{ ...s.mist, ...s.mist1 }} />
    <div style={{ ...s.mist, ...s.mist2 }} />

    {/* Overlays */}
    <div style={s.overlay} />
    
    {/* Content */}
    <div style={s.content}>
      <h1 style={s.headline}>
        <span style={s.brandEn}>Yún & Leaf</span>
        <span style={s.brandCn}>云叶</span>
      </h1>
      <p style={s.sub}>
        PREMIUM ORIGIN. HONEST PRICE.
      </p>
    </div>
  </section>
);

const s = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '2rem',
    textAlign: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  bgLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("/hero/yunan-hero.png")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: 'kenBurns 45s ease-out forwards',
    zIndex: 0,
  },
  mist: {
    position: 'absolute',
    inset: '-20%',
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 70%)',
    opacity: 0.35,
    pointerEvents: 'none',
    zIndex: 1,
    filter: 'blur(60px)',
  },
  mist1: {
    animation: 'cloudDrift 60s ease-in-out infinite alternate',
  },
  mist2: {
    animation: 'cloudDrift 90s ease-in-out infinite alternate-reverse',
    opacity: 0.25,
  },
  overlay: {
    position: 'absolute', 
    inset: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 2,
  },
  content: {
    position: 'relative', 
    zIndex: 3,
    animation: 'fadeIn 3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  headline: {
    color: '#F4EDE0',
    marginBottom: '1.2rem',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  brandEn: {
    fontFamily: "var(--font-display)",
    fontSize: 'clamp(2.5rem, 12vw, 5.5rem)',
    fontWeight: 300,
    fontStyle: 'italic',
    letterSpacing: '-0.01em',
    lineHeight: 1,
  },
  brandCn: {
    fontFamily: "var(--font-cn)",
    fontSize: 'clamp(2rem, 10vw, 4.5rem)',
    fontWeight: 300,
    lineHeight: 1,
    marginLeft: '0.5rem',
  },
  sub: {
    fontFamily: "var(--font-body)",
    fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
    color: 'rgba(244,237,224,0.95)',
    letterSpacing: '0.45em',
    textTransform: 'uppercase',
    marginTop: '0.5rem',
    fontWeight: 400,
  },
};
