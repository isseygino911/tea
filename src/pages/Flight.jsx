import { ScrollReveal } from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';

export const Flight = () => {
  const { addToCart } = useCart();

  const flightProduct = {
    id: 'cloud-forest-flight',
    name: 'The Cloud Forest Flight',
    name_cn: '品鉴系列',
    price: 22.00,
    category: 'Flight',
    image_url: '/stitch/flight_coffee.webp'
  };

  return (
    <main className="bg-surface text-on-surface min-h-screen pt-24 antialiased selection:bg-secondary/20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-90 grayscale-[10%]" 
            src="/stitch/flight_hero.webp" 
            alt="Misty mountain tea plantation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="flex flex-col justify-center">
            <ScrollReveal>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary-container mb-6 block">Discovery Flight / 品鉴系列</span>
              <h1 className="font-headline text-5xl md:text-8xl text-white leading-tight mb-8 italic">
                The Cloud Forest <br/><span>Flight</span>
              </h1>
              <p className="font-body text-base md:text-lg text-white/80 max-w-md leading-relaxed mb-12 font-light">
                An introductory journey through the high-altitude cloud forests of Enshi and Yunnan. A curated bridge between the ritual of tea and the craft of coffee.
              </p>
              <div className="flex items-center">
                <button 
                  onClick={() => addToCart(flightProduct, 1)}
                  className="bg-primary text-on-primary px-10 py-5 font-headline text-xl tracking-wide hover:bg-primary/90 transition-all flex items-center group"
                >
                  Begin the journey
                  <span className="ml-6 text-secondary-container opacity-80">$22.00</span>
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Composition: Bento Layout */}
      <section className="py-24 md:py-40 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="mb-20 max-w-2xl">
            <ScrollReveal>
              <h2 className="font-headline text-3xl md:text-5xl mb-8 italic text-primary">The Silent Narrative of Terroir / 风土的无声叙事</h2>
              <p className="text-on-surface-variant leading-relaxed text-base md:text-lg font-light">
                Every flight is a curated dialogue between earth and atmosphere. This selection presents the fundamental profiles of the Yun-Enshi axis, where the humidity of the cloud forest meets the mineral-rich soil of the highlands.
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[800px]">
            {/* Large Featured Item */}
            <div className="md:col-span-7 bg-surface-container-low relative overflow-hidden group">
              <ScrollReveal className="h-full">
                <img 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="/stitch/flight_coffee.webp" 
                  alt="Specialty coffee and tea leaves"
                />
                <div className="absolute bottom-8 left-8 p-8 bg-surface/10 backdrop-blur-xl border border-white/10">
                  <h3 className="font-headline text-2xl md:text-3xl text-primary italic">100g Yunnan Coffee</h3>
                  <p className="text-[10px] font-label uppercase tracking-widest text-secondary mt-3">Catimor • Washed • 1600m</p>
                </div>
              </ScrollReveal>
            </div>

            {/* Side Stacks */}
            <div className="md:col-span-5 grid grid-rows-2 gap-8">
              <div className="bg-surface-container-highest relative overflow-hidden group">
                <ScrollReveal className="h-full">
                  <img 
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" 
                    src="/stitch/flight_green_tea.webp" 
                    alt="Green tea leaves"
                  />
                  <div className="absolute top-8 right-8 text-right">
                    <h3 className="font-headline text-xl md:text-2xl text-primary italic">50g Enshi Yulu</h3>
                    <p className="text-[10px] font-label uppercase tracking-widest text-secondary mt-2">Steamed Green Tea</p>
                  </div>
                </ScrollReveal>
              </div>
              <div className="bg-primary relative overflow-hidden group">
                <ScrollReveal className="h-full">
                  <img 
                    className="w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110" 
                    src="/stitch/flight_black_tea.webp" 
                    alt="Black tea leaves"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12">
                    <h3 className="font-headline text-xl md:text-2xl text-white italic">50g Yihong Gongfu</h3>
                    <p className="text-[10px] font-label uppercase tracking-widest text-secondary-container mt-3">Historic Black Tea</p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terroir Map Section */}
      <section className="py-24 md:py-40 bg-primary text-on-primary overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 relative">
            <ScrollReveal>
              <img 
                className="w-full aspect-square object-cover grayscale brightness-110" 
                src="/stitch/terroir_map_artifact.webp" 
                alt="Terroir Map Artifact"
              />
              <div className="absolute inset-0 border-[20px] border-primary/20 pointer-events-none"></div>
            </ScrollReveal>
          </div>
          <div className="order-1 md:order-2">
            <ScrollReveal delay={0.2}>
              <span className="text-secondary-container font-label text-[10px] uppercase tracking-[0.3em] mb-6 block">The Artifact</span>
              <h2 className="font-headline text-4xl md:text-6xl mb-10 leading-tight italic text-white">Printed Terroir Map / <span className="opacity-50 not-italic font-light">The Path</span></h2>
              <div className="space-y-10 font-body text-white/70 leading-relaxed text-base md:text-lg font-light">
                <p>Included in every flight is our signature Terroir Map, a physical narrative of the elevation, soil composition, and seasonal mist cycles that define these harvests.</p>
                <div className="border-l-2 border-secondary-container pl-8 py-2">
                  <h4 className="text-white font-headline italic text-xl md:text-2xl mb-4">Unique Value Proposition</h4>
                  <p>We don't just provide tea and coffee; we provide context. Trace the journey from the root to the cup with detailed coordinates and harvest dates for each component.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 md:py-56 bg-surface-container-low text-center px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-headline text-4xl md:text-6xl mb-16 italic text-primary leading-tight">Begin your introductory journey.</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="text-left">
                <span className="block text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1 opacity-60">Total Value</span>
                <span className="text-4xl font-headline font-bold text-primary">$22.00 USD</span>
              </div>
              <button 
                onClick={() => addToCart(flightProduct, 1)}
                className="w-full md:w-auto bg-primary text-on-primary px-16 py-6 font-headline text-xl tracking-wider hover:opacity-90 transition-all border border-primary"
              >
                Begin the journey / 开始旅程
              </button>
            </div>
            <p className="mt-16 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant opacity-40">
              Complimentary shipping on your first flight.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};
