import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';

export const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <main className="bg-surface text-on-surface font-body selection:bg-secondary/20 pt-16 md:pt-24">
      {/* Hero: The Silent Narrative */}
      <section className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover grayscale-[20%] brightness-[85%] animate-video-fade"
          >
            <source src="/hero_vid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/30"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <ScrollReveal>
            <h1 className="text-5xl md:text-8xl font-headline italic mb-4 tracking-tighter">Yún & Leaf 云叶</h1>
            <p className="text-sm md:text-xl font-body tracking-[0.2em] uppercase opacity-90">Premium origin. Honest price.</p>
          </ScrollReveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes video-fade {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-video-fade {
          animation: video-fade 8s ease-in-out infinite;
        }
      `}} />

      {/* Thesis Section */}
      <section className="bg-surface-container py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <span className="text-secondary font-label text-xs uppercase tracking-[0.3em] mb-8 block">The Philosophy / 哲学</span>
            <p className="font-headline text-xl md:text-3xl leading-relaxed italic text-primary">
              For too long, the Western specialty market has treated the treasures of the East as either inaccessible luxuries or industrial commodities. At Yún & Leaf, we bridge this gap. By sourcing directly from the high-altitude cloud forests of Yunnan and the misty slopes of Hubei, we champion the 'affordable connoisseur'—bringing the silent narrative of premium single-origin coffee and heritage tea to your daily ritual without the artificial premium.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Product: The Cloud Forest Flight */}
      <section className="py-20 md:py-32 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-7 overflow-hidden">
              <ScrollReveal>
                <img 
                  className="w-full h-auto object-cover grayscale-[10%]" 
                  alt="premium ceramic tea tasting set" 
                  src="/stitch/spotlight.webp" 
                />
              </ScrollReveal>
            </div>
            <div className="md:col-span-5 flex flex-col items-start">
              <ScrollReveal delay={0.2}>
                <span className="text-secondary font-label text-xs uppercase tracking-widest mb-4">Seasonal Spotlight / 季节限定</span>
                <h2 className="text-3xl md:text-5xl font-headline italic text-primary mb-6">The Cloud Forest Flight</h2>
                <p className="text-on-surface-variant leading-relaxed mb-10 text-base md:text-lg">
                  An curated introduction to our ecosystem. Features two single-origin Yunnan coffee roasts and two high-mountain Hubei teas, accompanied by a sensory guide to the high-altitude terroir.
                </p>
                <Link className="bg-secondary text-on-secondary px-8 md:px-10 py-3 md:py-4 font-headline text-base md:text-lg hover:opacity-90 transition-all inline-block" to="/products">Start here</Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Regions */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Yunnan Coffee */}
        <div className="relative min-h-[400px] md:min-h-[600px] flex flex-col justify-end p-8 md:p-12 bg-primary-container group overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay grayscale group-hover:scale-105 transition-transform duration-1000">
            <img 
              className="w-full h-full object-cover" 
              alt="sun-drenched coffee cherries" 
              src="/stitch/yunnan_coffee.webp" 
            />
          </div>
          <div className="relative z-10">
            <ScrollReveal>
              <h3 className="text-2xl md:text-3xl font-headline italic text-primary-fixed mb-4">Yunnan / 云南</h3>
              <p className="text-on-primary-container max-w-sm mb-8 text-sm md:text-base">Home to China’s burgeoning specialty coffee movement. Volcanic soil, high altitude, and the misty climate of Baoshan create a profile of dark fruit and clean spice.</p>
              <div className="flex items-center gap-4 group/link cursor-pointer">
                <span className="text-secondary-fixed text-xs md:text-sm uppercase tracking-widest">Explore the Origin</span>
                <span className="w-8 md:w-12 h-[1px] bg-secondary-fixed"></span>
              </div>
            </ScrollReveal>
          </div>
          <div className="absolute top-8 md:top-12 right-8 md:right-12 w-24 h-24 md:w-32 md:h-32 opacity-20 hidden sm:block">
            <img className="w-full h-full object-contain invert" alt="map of Yunnan" src="/stitch/yunnan_map.webp" />
          </div>
        </div>
        {/* Hubei Tea */}
        <div className="relative min-h-[400px] md:min-h-[600px] flex flex-col justify-end p-8 md:p-12 bg-surface-container-high group overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-1000">
            <img 
              className="w-full h-full object-cover" 
              alt="misty morning in tea plantation" 
              src="/stitch/hubei_tea.webp" 
            />
          </div>
          <div className="relative z-10">
            <ScrollReveal>
              <h3 className="text-2xl md:text-3xl font-headline italic text-primary mb-4">Hubei / 湖北</h3>
              <p className="text-on-surface-variant max-w-sm mb-8 text-sm md:text-base">The ancestral cradle of tea culture. Our Enshi Yulu, a rare steam-processed green tea, offers a marine-fresh sweetness and unparalleled clarity.</p>
              <div className="flex items-center gap-4 group/link cursor-pointer">
                <span className="text-secondary text-xs md:text-sm uppercase tracking-widest">Discover the Leaf</span>
                <span className="w-8 md:w-12 h-[1px] bg-secondary"></span>
              </div>
            </ScrollReveal>
          </div>
          <div className="absolute top-8 md:top-12 right-8 md:right-12 w-24 h-24 md:w-32 md:h-32 opacity-20 hidden sm:block">
            <img className="w-full h-full object-contain" alt="map of Hubei" src="/stitch/hubei_map.webp" />
          </div>
        </div>
      </section>

      {/* Core Line Preview */}
      <section className="py-20 md:py-32 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12 md:mb-16">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-headline italic text-primary">The Core Collection</h2>
            </ScrollReveal>
            <Link className="text-xs font-label uppercase tracking-widest border-b border-outline-variant pb-1 hover:border-secondary transition-colors" to="/products">Shop All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
            {/* Products map */}
            {[
              { name: 'Baoshan Washed', origin: 'Coffee / Yunnan', price: '$18.00', img: '/stitch/product_baoshan.webp' },
              { name: 'Enshi Yulu', origin: 'Tea / Hubei', price: '$22.00', img: '/stitch/product_enshi.webp' },
              { name: 'Shadow Ferment', origin: "Coffee / Pu'er", price: '$24.00', img: '/stitch/product_shadow.webp' },
              { name: 'Moonlight White', origin: 'Tea / Yunnan', price: '$20.00', img: '/stitch/product_moonlight.webp' },
            ].map((product, i) => (
              <ScrollReveal key={product.name} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] bg-surface-container-low mb-6 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} src={product.img} />
                  </div>
                  <p className="text-[10px] md:text-xs text-secondary font-label uppercase tracking-widest mb-1">{product.origin}</p>
                  <h4 className="text-base md:text-lg font-headline italic text-primary mb-2">{product.name}</h4>
                  <p className="text-on-surface-variant font-body text-xs md:text-sm">{product.price}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Snippet */}
      <section className="py-20 md:py-32 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="mb-12 md:mb-20 text-center">
            <ScrollReveal>
              <span className="text-secondary font-label text-xs uppercase tracking-[0.4em] mb-4 block">The Journal / 刊物</span>
              <h2 className="text-3xl md:text-4xl font-headline italic text-primary">Notes on the Silent Narrative</h2>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              { date: 'Craft • Nov 2024', title: 'The Art of the Slow Pour: Finding Presence in the Morning', excerpt: 'In a world obsessed with efficiency, the deliberate ritual of brewing becomes a silent form of resistance.', img: '/stitch/journal_1.webp' },
              { date: 'Origin • Oct 2024', title: 'Yunnan’s Volcanic Terroir: Why Altitude Matters', excerpt: 'Rising 2,000 meters above sea level, the farms of Baoshan are redefining the profile of Asian coffee.', img: '/stitch/journal_2.webp' },
              { date: 'Heritage • Sep 2024', title: 'Ancestral Steam: The Legacy of Enshi Yulu Green Tea', excerpt: "Tracing back over a millennium, the steam processing method remains one of tea's most delicate secrets.", img: '/stitch/journal_3.webp' },
            ].map((article, i) => (
              <article key={article.title} className="flex flex-col">
                <ScrollReveal delay={i * 0.1}>
                  <div className="mb-6 md:mb-8 h-[200px] md:h-[300px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <img className="w-full h-full object-cover" alt={article.title} src={article.img} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 inline-block">{article.date}</span>
                  <h3 className="text-lg md:text-xl font-headline italic mb-4 leading-snug">{article.title}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-3 mb-6">{article.excerpt}</p>
                  <a className="text-secondary font-label text-xs uppercase tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2" href="#">
                    Read Article <span className="material-symbols-outlined text-[14px]">east</span>
                  </a>
                </ScrollReveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Bottom Section */}
      <section className="bg-primary py-24 text-center text-white px-6">
        <ScrollReveal>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mb-10"></div>
          <h2 className="text-4xl md:text-7xl font-headline mb-4 italic leading-tight">
            Premium origin.<br />
            <span className="opacity-50">Honest price.</span>
          </h2>
          <p className="text-[#F4EDE0]/40 font-cn text-lg mt-8 tracking-widest">茶，西方久违；咖啡，东方初醒</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link className="bg-[#F4EDE0] text-primary px-8 py-3 uppercase text-xs tracking-widest font-medium" to="/products">Explore the line</Link>
            <Link className="border border-[#F4EDE0]/30 text-[#F4EDE0] px-8 py-3 uppercase text-xs tracking-widest font-medium hover:bg-white/5" to="/wholesale">Wholesale enquiry</Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
};
