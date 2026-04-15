import { ScrollReveal } from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

const PILLARS = [
  {
    cn: '原产地直采',
    en: 'Origin Direct',
    body: 'By fostering direct relationships with small-scale estates in Yunnan and Hubei, we remove the layers of brokerage that traditionally inflate costs. These origin savings aren\'t just margins — they are the value of a shorter journey from the soil to your cup.',
  },
  {
    cn: '质量与伦理',
    en: 'Quality & Ethics',
    body: 'Transparency means acknowledging that the cheapest price often masks a hidden human or environmental cost. We commit to Fairtrade and Organic standards not as marketing labels, but as non-negotiable foundations. We pay above market rates.',
  },
  {
    cn: '直营模式',
    en: 'The Direct Model',
    body: 'By operating direct-to-consumer, we bypass conventional retail markup. Every dollar you spend is reinvested into sourcing exceptional harvests and sustainable packaging. Luxury defined by integrity of craft and clarity of origin — not exclusivity.',
  },
];

export const Pricing = () => (
  <main style={{ backgroundColor: '#F4EDE0', paddingTop: '64px' }}>

    {/* Hero */}
    <section style={s.hero}>
      <div className="container">
        <ScrollReveal>
          <p style={s.label}>Values · 价值观 — Pricing · 定价</p>
          <h1 style={s.heroTitle}>Honest Pricing<br /><em style={s.em}>诚实的定价</em></h1>
          <p style={s.heroSub}>
            The coffee is $14 and not $24 because Yunnan isn't yet famous in the West —
            not because the quality is lesser. This page explains our pricing once, plainly.
            After that, we never reference cost again.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Three pillars */}
    <section style={{ ...s.section, backgroundColor: '#FBF8F1' }}>
      <div className="container">
        <div style={s.pillarsGrid}>
          {PILLARS.map((p, i) => (
            <ScrollReveal key={p.en} delay={i}>
              <div style={s.pillar}>
                <p style={s.pillarNum}>0{i + 1}</p>
                <p style={s.pillarCn}>{p.cn}</p>
                <h3 style={s.pillarTitle}>{p.en}</h3>
                <p style={s.pillarBody}>{p.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Image + quote */}
    <section style={s.section}>
      <div className="container">
        <div style={s.splitGrid}>
          <ScrollReveal>
            <div style={s.imgWrap}>
              <img src="/brand/tea-farm.jpg" alt="Traditional tea farm" style={s.img} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div style={s.copyBlock}>
              <p style={s.label}>Fairtrade Commitment</p>
              <h2 style={s.blockTitle}>We pay above<br /><em style={s.em}>the minimum.</em></h2>
              <p style={s.blockBody}>
                The Fairtrade Minimum Price is the floor — the point below which no certified
                product can be sold. We pay the Fairtrade Premium on top, which is invested
                directly back into producer communities for education, healthcare, and
                infrastructure.
              </p>
              <p style={{ ...s.blockBody, marginTop: '1.2rem' }}>
                Canada Organic Regime (COR) certification means every farm in our supply chain
                has been independently audited. For Chinese-origin products sold in Canada, this
                also requires full bilingual (EN/FR) labelling and clear country-of-origin marks.
                We comply with all of it.
              </p>
              <div style={s.certBadges}>
                {['Canada Organic','Fairtrade Certified','Direct Trade'].map(c => (
                  <span key={c} style={s.badge}>{c}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Price table */}
    <section style={{ ...s.section, backgroundColor: '#FBF8F1' }}>
      <div className="container">
        <ScrollReveal>
          <p style={s.label}>Our Line</p>
          <h2 style={s.sectionTitle}>What you pay.<br /><em style={s.em}>What you get.</em></h2>
        </ScrollReveal>
        <ScrollReveal delay={1}>
          <div style={s.priceTable}>
            {[
              { tier: 'Core Line', range: '$12–16', desc: 'Single-origin Yunnan coffee and Hubei teas. Volume engine. Trust-builder. Genuinely high quality at prices that reflect origin anonymity, not lesser product.' },
              { tier: 'Reserve Line', range: '$22–32', desc: 'Limited-lot, named-farmer, small-harvest. The same quality tier as a $40 boutique offering elsewhere. Marked with Copper on packaging.' },
              { tier: 'Discovery Flights', range: '$18–24', desc: 'The acquisition product. Solves "I don\'t know what to try first." Includes a printed map of both regions with elevations, farm locations, and tasting notes.' },
            ].map((row, i) => (
              <div key={row.tier} style={{ ...s.priceRow, borderTop: i === 0 ? '1px solid rgba(31,61,46,0.12)' : undefined }}>
                <div style={s.priceLeft}>
                  <h3 style={s.priceTier}>{row.tier}</h3>
                  <span style={s.priceRange}>{row.range}</span>
                </div>
                <p style={s.priceDesc}>{row.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* CTA */}
    <section style={s.ctaSection}>
      <div className="container" style={{ textAlign: 'center' }}>
        <ScrollReveal>
          <h2 style={s.ctaTitle}>Confident pricing<br /><em style={s.ctaEm}>is premium pricing.</em></h2>
          <Link to="/products" style={s.ctaBtn}>Explore the line</Link>
        </ScrollReveal>
      </div>
    </section>

  </main>
);

const s = {
  hero: { padding: '6rem 0 5rem', borderBottom: '1px solid rgba(31,61,46,0.08)' },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 300, color: '#1A1A1A', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem', marginTop: '1rem' },
  heroSub: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(26,26,26,0.62)', maxWidth: '580px' },
  em: { fontStyle: 'italic', color: 'rgba(26,26,26,0.38)' },
  label: { fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#8FA3A8', marginBottom: '1.2rem', display: 'block' },
  section: { padding: '6rem 0' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.15, color: '#1A1A1A', marginBottom: '3rem' },
  pillarsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3rem' },
  pillar: { padding: '2.5rem', backgroundColor: '#F4EDE0', border: '1px solid rgba(31,61,46,0.08)' },
  pillarNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: 'rgba(31,61,46,0.12)', lineHeight: 1, marginBottom: '1rem' },
  pillarCn: { fontFamily: "'Noto Serif SC', serif", fontSize: '0.85rem', color: '#8FA3A8', marginBottom: '0.5rem' },
  pillarTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: '#1F3D2E', marginBottom: '1rem' },
  pillarBody: { fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', lineHeight: 1.72, color: 'rgba(26,26,26,0.6)' },
  splitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' },
  imgWrap: {},
  img: { width: '100%', height: '520px', objectFit: 'cover', display: 'block' },
  copyBlock: {},
  blockTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: '#1A1A1A', lineHeight: 1.15, marginBottom: '1.5rem' },
  blockBody: { fontFamily: 'Inter, sans-serif', fontSize: '1.0rem', lineHeight: 1.75, color: 'rgba(26,26,26,0.62)' },
  certBadges: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' },
  badge: { fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.13em', padding: '0.4rem 0.9rem', border: '1px solid rgba(31,61,46,0.2)', color: '#1F3D2E' },
  priceTable: { borderBottom: '1px solid rgba(31,61,46,0.12)' },
  priceRow: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '3rem', padding: '2rem 0', borderBottom: '1px solid rgba(31,61,46,0.08)', alignItems: 'start' },
  priceLeft: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  priceTier: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 400, color: '#1F3D2E' },
  priceRange: { fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#B87849' },
  priceDesc: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(26,26,26,0.6)', paddingTop: '0.3rem' },
  ctaSection: { backgroundColor: '#1F3D2E', padding: '7rem 0' },
  ctaTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 300, color: '#F4EDE0', lineHeight: 1.1, marginBottom: '3rem' },
  ctaEm: { fontStyle: 'italic', color: 'rgba(244,237,224,0.5)' },
  ctaBtn: { display: 'inline-block', padding: '1rem 2.8rem', backgroundColor: '#F4EDE0', color: '#1F3D2E', fontFamily: 'Inter, sans-serif', fontSize: '0.76rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' },
};
