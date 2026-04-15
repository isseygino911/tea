import { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';

export const Wholesale = () => {
  const [form, setForm] = useState({ cafe: '', name: '', email: '', city: '', volume: '', message: '' });
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <main style={{ backgroundColor: '#F4EDE0', paddingTop: '64px' }}>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroOverlay} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <p style={s.label}>Wholesale · 批发</p>
            <h1 style={s.heroTitle}>Premium cloud-forest<br /><em style={s.em}>coffee and tea for<br />the modern café.</em></h1>
            <p style={s.heroSub}>
              Single-origin arabica from Yunnan and specialty teas from Hubei.
              Direct-trade pricing. Producer-story cards for your bar.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Value props */}
      <section style={{ ...s.section, backgroundColor: '#FBF8F1' }}>
        <div className="container">
          <div style={s.propsGrid}>
            {[
              { title: 'Direct-trade pricing', body: 'Because our origins aren\'t yet famous, our wholesale prices sit well below comparable boutique roasters. Your margin improves. The product is the same quality.' },
              { title: 'Producer-story cards', body: 'Every wholesale account receives printed producer cards — farm name, elevation, harvest date, tasting notes — ready to display at your bar. A small detail that creates real conversations.' },
              { title: '1kg and 5kg bags', body: 'Whole bean only. Light, medium, or medium-dark roast available. Ground-to-order on request for high-volume accounts.' },
              { title: 'Bulk tea tins', body: 'Loose-leaf in 250g and 500g tins. Minimum 6 tins per order. Your café\'s name can be printed on a band wrap for accounts over 12 tins/month.' },
            ].map((p, i) => (
              <ScrollReveal key={p.title} delay={i % 2}>
                <div style={s.propCard}>
                  <span style={s.propNum}>0{i + 1}</span>
                  <h3 style={s.propTitle}>{p.title}</h3>
                  <p style={s.propBody}>{p.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Products available */}
      <section style={s.section}>
        <div className="container">
          <ScrollReveal>
            <p style={s.label}>Available SKUs</p>
            <h2 style={s.sectionTitle}>What we offer<br /><em style={s.em}>wholesale.</em></h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Product','Origin','Format','Min. Order','Wholesale Price'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Baoshan Washed', 'Yunnan · 1,650m', '1kg whole bean', '3kg', 'On application'],
                  ["Pu'er Highlands", "Yunnan · Pu'er", '1kg / 5kg whole bean', '3kg', 'On application'],
                  ['Enshi Yulu', 'Hubei · 1,200m', '250g / 500g loose leaf tin', '6 tins', 'On application'],
                  ['Yihong Gongfu', 'Hubei · Yichang', '250g / 500g loose leaf tin', '6 tins', 'On application'],
                  ['Cloud Forest Flight', 'Yunnan + Hubei', 'Retail-ready gift set', '12 units', 'On application'],
                ].map(row => (
                  <tr key={row[0]} style={s.tr}>
                    {row.map((cell, i) => <td key={i} style={i === 0 ? s.tdBold : s.td}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>
        </div>
      </section>

      {/* Application form */}
      <section style={{ ...s.section, backgroundColor: '#FBF8F1' }}>
        <div className="container">
          <div style={s.formGrid}>
            <ScrollReveal>
              <div>
                <p style={s.label}>Apply · 申请</p>
                <h2 style={s.formTitle}>Start your<br /><em style={s.em}>wholesale account.</em></h2>
                <p style={s.formIntro}>
                  Fill out the form and we'll be in touch within two business days with a
                  price sheet and sample pack options.
                </p>
                <div style={s.contactInfo}>
                  <p style={s.contactItem}>Email: <a href="mailto:wholesale@yunandleaf.ca" style={s.contactLink}>wholesale@yunandleaf.ca</a></p>
                  <p style={s.contactItem}>Canada &amp; North America only at this time.</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <form style={s.form} onSubmit={e => e.preventDefault()}>
                <div style={s.formRow}>
                  <input name="cafe" value={form.cafe} onChange={handle} placeholder="Café or business name*" className="input-line" style={s.input} required />
                  <input name="name" value={form.name} onChange={handle} placeholder="Your name*" className="input-line" style={s.input} required />
                </div>
                <input name="email" value={form.email} onChange={handle} type="email" placeholder="Email address*" className="input-line" style={s.input} required />
                <div style={s.formRow}>
                  <input name="city" value={form.city} onChange={handle} placeholder="City / Province" className="input-line" style={s.input} />
                  <input name="volume" value={form.volume} onChange={handle} placeholder="Est. monthly volume" className="input-line" style={s.input} />
                </div>
                <textarea name="message" value={form.message} onChange={handle} placeholder="Any specific products or questions?" className="input-line" style={{ ...s.input, minHeight: '100px', resize: 'vertical' }} />
                <button type="submit" style={s.submitBtn}>Submit application</button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </main>
  );
};

const s = {
  hero: {
    minHeight: '60vh', display: 'flex', alignItems: 'flex-end',
    backgroundImage: 'url("/hero/IMG_0294.jpg")', backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative', padding: '5rem 0',
  },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(31,61,46,0.78), rgba(31,61,46,0.22))', zIndex: 1 },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 300, color: '#F4EDE0', lineHeight: 1.05, marginBottom: '1.5rem' },
  heroSub: { fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(244,237,224,0.65)', maxWidth: '500px', lineHeight: 1.7 },
  em: { fontStyle: 'italic', color: 'rgba(244,237,224,0.6)' },
  label: { fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#8FA3A8', marginBottom: '1.2rem', display: 'block' },
  section: { padding: '6rem 0' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.15, color: '#1A1A1A', marginBottom: '3rem' },
  propsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  propCard: { padding: '2.5rem', backgroundColor: '#F4EDE0', border: '1px solid rgba(31,61,46,0.08)' },
  propNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: 'rgba(31,61,46,0.12)', display: 'block', marginBottom: '1rem', lineHeight: 1 },
  propTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 400, color: '#1F3D2E', marginBottom: '0.8rem' },
  propBody: { fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', lineHeight: 1.72, color: 'rgba(26,26,26,0.62)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8FA3A8', padding: '0.8rem 1rem', borderBottom: '1px solid rgba(31,61,46,0.12)', textAlign: 'left' },
  tr: { borderBottom: '1px solid rgba(31,61,46,0.06)' },
  td: { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(26,26,26,0.65)', padding: '1.1rem 1rem' },
  tdBold: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: '#1F3D2E', padding: '1.1rem 1rem', fontWeight: 400 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '5rem', alignItems: 'start' },
  formTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: '#1A1A1A', lineHeight: 1.15, marginBottom: '1.5rem', marginTop: '0.5rem' },
  formIntro: { fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', lineHeight: 1.72, color: 'rgba(26,26,26,0.6)', marginBottom: '2rem' },
  contactInfo: { borderTop: '1px solid rgba(31,61,46,0.1)', paddingTop: '1.5rem' },
  contactItem: { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(26,26,26,0.6)', marginBottom: '0.5rem' },
  contactLink: { color: '#1F3D2E', borderBottom: '1px solid rgba(31,61,46,0.2)', paddingBottom: '1px' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  input: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#1A1A1A', width: '100%' },
  submitBtn: { marginTop: '1.5rem', alignSelf: 'flex-start', display: 'inline-block', padding: '1rem 2.5rem', backgroundColor: '#1F3D2E', color: '#F4EDE0', fontFamily: 'Inter, sans-serif', fontSize: '0.76rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', border: 'none', cursor: 'pointer' },
};
