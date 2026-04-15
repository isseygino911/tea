import { ScrollReveal } from '../components/ScrollReveal';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import mockTea from '../mock_tea.json';

export const Tea = () => {
  const { addToCart } = useCart();

  return (
    <main className="bg-surface min-h-screen pt-24 pb-32">
      {/* Header */}
      <section className="bg-surface-container py-16 md:py-32 border-b border-primary/5 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <img src="/stitch/hubei_map.webp" alt="Map" className="w-full h-full object-contain" />
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">Ancestral Leaves · 茶系列</p>
              <h1 className="font-headline text-5xl md:text-8xl font-bold mb-6 italic leading-tight text-primary">
                Heritage Tea <br />
                <span className="opacity-40 not-italic font-light">from the misty East.</span>
              </h1>
              <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg font-light italic">
                “Tracing back over a millennium, the steam processing method remains one of tea's most delicate secrets.”
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-12 border-b border-primary/10 pb-6">
          <h2 className="font-headline text-2xl italic text-primary">The Tea Collection</h2>
          <span className="text-[10px] uppercase tracking-widest text-primary/40 font-medium">
            {mockTea.length} Seasonal Varietals
          </span>
        </div>

        <div className="grid gap-x-8 gap-y-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockTea.map((product, index) => (
            <ScrollReveal key={product.id} delay={(index % 4) * 0.05}>
              <ProductCard product={product} onAddToCart={addToCart} />
            </ScrollReveal>
          ))}
        </div>

        {/* Narrative Section */}
        <section className="mt-32 py-24 border-t border-primary/5 text-center max-w-3xl mx-auto">
          <ScrollReveal>
            <span className="material-symbols-outlined text-secondary text-4xl mb-8">eco</span>
            <h3 className="font-headline text-3xl italic text-primary mb-6">Beyond the Industrial Premium</h3>
            <p className="text-on-surface-variant leading-relaxed font-light">
              We source directly from family cooperatives in Hubei and Yunnan, ensuring that the 'affordable connoisseur' can access heritage-grade leaves without the artificial markups of luxury labels.
            </p>
          </ScrollReveal>
        </section>
      </div>
    </main>
  );
};
