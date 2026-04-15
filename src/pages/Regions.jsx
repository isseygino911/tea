import { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';

const PRODUCERS = [
  {
    id: 'baoshan',
    name: 'Mr. Chen Wen',
    title: '3rd Generation Grower',
    location: 'Baoshan / 保山',
    desc: 'Mastering the high-altitude Arabica of the Gaoligong mountains for over forty years. His beans are known for their distinct notes of dark honey.',
    img: '/stitch/producer_baoshan.webp',
    pos: { top: '65%', left: '20%' }
  },
  {
    id: 'puer',
    name: 'Ms. Lin Hua',
    title: 'Forest Custodian',
    location: "Pu'er / 普洱",
    desc: 'Protecting the ancient wild tea trees of Jingmai. Her Sheng Pu\'er captures the essence of damp earth and mountain orchids.',
    img: '/stitch/producer_puer.webp',
    pos: { top: '75%', left: '30%' }
  },
  {
    id: 'enshi',
    name: 'Master Zhou',
    title: 'Steam Processing Expert',
    location: 'Enshi / 恩施',
    desc: 'Preserving the Tang Dynasty technique of steam-panning. His Yulu green tea is exceptionally rich in selenium and ocean-air notes.',
    img: '/stitch/producer_enshi.webp',
    pos: { top: '45%', left: '65%' }
  },
  {
    id: 'yichang',
    name: 'The Zhao Family',
    title: 'Heirloom Black Tea',
    location: 'Yichang / 宜昌',
    desc: 'Cultivating Yihong Black Tea along the Yangtze tributaries. A heritage of sweetness that fueled the historical tea trade with Europe.',
    img: '/stitch/producer_yichang.webp',
    pos: { top: '35%', left: '75%' }
  }
];

export const Regions = () => {
  const [showPath, setShowPath] = useState(true);
  const [activeProducer, setActiveProducer] = useState(null);

  return (
    <main className="bg-background text-on-surface font-body selection:bg-secondary-fixed pt-24">
      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
        <ScrollReveal>
          <div className="mb-4">
            <span className="font-label text-xs uppercase tracking-[0.3em] text-secondary">The Silent Narrative / 沉默的叙述</span>
          </div>
          <h1 className="font-headline text-5xl md:text-8xl italic mb-8">Our Regions / 产地</h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-on-surface-variant font-light">
            Tracing the lineage of every leaf and bean from the misty heights of Yunnan to the ancient riverbanks of Hubei. A journey through terroir, tradition, and the silent labor of our artisan producers.
          </p>
        </ScrollReveal>
      </section>

      {/* Map Navigation Section */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-20 md:mb-32">
        <div className="bg-surface-container-low rounded-lg p-1 w-full aspect-[21/9] relative overflow-hidden group">
          {/* Map Background */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-multiply transition-transform duration-[20s] linear hover:scale-110" 
            style={{ 
              backgroundImage: "url('/stitch/regions_map_bg.webp')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          />
          
          {/* SVG Overlay for Route */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400">
            {showPath && (
              <>
                <path 
                  className="stroke-secondary/30 fill-none transition-all duration-1000" 
                  d="M150,300 C250,280 400,220 550,180 S850,150 900,100" 
                  strokeWidth="2"
                  strokeDasharray="4, 8"
                />
                <text className="fill-secondary/60 text-[10px] font-label tracking-widest uppercase italic" x="500" y="210">
                  Wanli Tea Road / 万里茶路
                </text>
              </>
            )}
          </svg>

          {/* Producer Pins */}
          {PRODUCERS.map((p) => (
            <div 
              key={p.id}
              className="absolute group/pin cursor-pointer z-10"
              style={{ top: p.pos.top, left: p.pos.left }}
              onMouseEnter={() => setActiveProducer(p.id)}
              onMouseLeave={() => setActiveProducer(null)}
            >
              <div className="relative">
                <div className={`w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full border-2 border-surface ${activeProducer === p.id ? 'animate-ping' : ''}`}></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full border-2 border-surface absolute inset-0"></div>
                <span className="absolute top-6 left-0 whitespace-nowrap font-headline italic text-xs md:text-sm bg-surface/80 px-2 py-0.5 rounded-sm backdrop-blur-sm">
                  {p.location}
                </span>

                {/* Hover Card */}
                <div className={`absolute bottom-8 -left-20 w-64 md:w-72 bg-surface p-4 md:p-6 shadow-2xl transition-all duration-500 z-20 pointer-events-none ${activeProducer === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      alt={p.name} 
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-sm grayscale hover:grayscale-0 transition-all" 
                      src={p.img} 
                    />
                    <div>
                      <h4 className="font-headline font-bold text-sm md:text-base">{p.name}</h4>
                      <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-secondary">{p.title}</p>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs leading-relaxed text-on-surface-variant mb-4">{p.desc}</p>
                  <button className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all">
                    View Collection / 查看藏品
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm italic font-headline text-on-surface-variant">
            Hover over markers to discover our producers / 悬停以发现我们的生产者
          </p>
          <button 
            onClick={() => setShowPath(!showPath)}
            className="bg-primary text-on-primary px-6 md:px-8 py-2 md:py-3 font-headline italic hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            {showPath ? 'Hide Historical Path' : 'Show Historical Path'} / 历史路径
          </button>
        </div>
      </section>

      {/* Bento Grid Regional Details */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Yunnan Feature */}
          <div className="md:col-span-7 bg-surface-container-low p-8 md:p-12 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
            <div>
              <span className="font-label text-xs tracking-widest text-secondary mb-4 block uppercase">Province South / 省南</span>
              <h2 className="font-headline text-3xl md:text-5xl italic mb-6">Yunnan: The Birthplace / 云南</h2>
              <p className="text-on-surface-variant leading-loose font-light max-w-md text-sm md:text-base">
                From the snow-capped Gaoligong mountains to the tropical borders of Xishuangbanna, Yunnan is a sanctuary of biodiversity. Here, coffee and tea grow in the same red volcanic soil, sharing a unique mineral vitality.
              </p>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="flex gap-8 md:gap-12">
                <div>
                  <span className="block font-headline text-xl md:text-2xl italic">1,800m+</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-on-surface-variant">Avg Altitude</span>
                </div>
                <div>
                  <span className="block font-headline text-xl md:text-2xl italic">Wild</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-on-surface-variant">Cultivation</span>
                </div>
              </div>
              <button className="group flex items-center gap-2 font-headline italic text-lg md:text-xl">
                Shop Yunnan Collection
                <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">east</span>
              </button>
            </div>
          </div>

          {/* Hubei Image Feature */}
          <div className="md:col-span-5 bg-primary relative overflow-hidden group min-h-[300px]">
            <img 
              alt="Misty mountains of Hubei" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-1000" 
              src="/stitch/hubei_feature.webp" 
            />
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
              <h3 className="font-headline text-2xl md:text-4xl italic mb-4">Hubei: The Riverine Heritage / 湖北</h3>
              <p className="text-xs md:text-sm opacity-80 leading-relaxed font-light mb-6">
                Where the Yangtze carves through ancient limestone, nurturing the delicate green and black teas that have defined the Wanli Tea Road for centuries.
              </p>
              <button className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest border-b border-white/40 pb-1 self-start hover:border-white transition-all">
                Explore Hubei Teas / 探索湖北茶
              </button>
            </div>
          </div>

          {/* Small Artifact/Story Card */}
          <div className="md:col-span-4 bg-surface-container-high p-6 md:p-8">
            <span className="material-symbols-outlined text-secondary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
            <h4 className="font-headline italic text-xl md:text-2xl mb-4">The Wanli Road</h4>
            <p className="text-[10px] md:text-xs leading-relaxed text-on-surface-variant font-light">
              A 13,000-kilometer trade route starting from the tea mountains of the south, crossing the Mongolian steppes, reaching as far as St. Petersburg. We honor this silent history in every shipment.
            </p>
          </div>

          {/* Product Highlight Card */}
          <div className="md:col-span-8 bg-surface-container-lowest p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 md:gap-12">
            <div className="w-full sm:w-1/3">
              <img 
                alt="Tea and coffee sample set" 
                className="w-full aspect-square object-cover" 
                src="/stitch/regional_flight.webp" 
              />
            </div>
            <div className="w-full sm:w-2/3">
              <h4 className="font-headline text-2xl md:text-3xl italic mb-2">Regional Flight / 产地品鉴</h4>
              <p className="text-xs md:text-sm text-on-surface-variant mb-6 leading-relaxed">
                A curated selection of four origins. Experience the contrast between Baoshan’s bright acidity and Enshi’s savory depth.
              </p>
              <button className="bg-secondary text-white px-6 py-2 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity">
                Purchase Selection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Guidebook Excerpt Section */}
      <section className="max-w-screen-md mx-auto px-6 md:px-12 py-20 md:py-32 border-t border-outline-variant/15 text-center">
        <ScrollReveal>
          <span className="material-symbols-outlined text-primary mb-8 text-3xl md:text-4xl">local_library</span>
          <blockquote className="font-headline text-2xl md:text-3xl italic leading-snug mb-8">
            “To taste a tea from Pu’er is to inhale the breath of a mountain that has been sleeping for a thousand years. The coffee from Baoshan is but a modern echo of that same ancient resonance.”
          </blockquote>
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary">— FROM THE JOURNALS OF YÚN & LEAF</p>
        </ScrollReveal>
      </section>
    </main>
  );
};
