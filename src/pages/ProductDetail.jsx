import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductController } from '../hooks/useProductController';
import { LoadingBar } from '../components/ui/LoadingBar';
import { ScrollReveal } from '../components/ScrollReveal';
import { wishlistAPI } from '../services/wishlistAPI';
import { useAuth } from '../context/AuthContext';
import mockCatalog from '../mock_catalog.json';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { product: apiProduct, productImages, loading: apiLoading, error: apiError, fetchProductById } = useProductController();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      
      // 1. Try finding in mock data first (for Stitch design IDs)
      const mockItem = mockCatalog.find(p => p.id === id);
      if (mockItem) {
        setProduct(mockItem);
        setLoading(false);
        return;
      }

      // 2. Otherwise try API
      if (id && !isNaN(id) || id?.length > 30) { // Likely numeric ID or UUID
        try {
          await fetchProductById(id);
        } catch (err) {
          setError("Product not found");
        }
      } else {
        setError("Product not found");
      }
      setLoading(false);
    };

    loadProduct();
  }, [id, fetchProductById]);

  // Sync state if API returns product
  useEffect(() => {
    if (apiProduct && !product) {
      setProduct(apiProduct);
    }
  }, [apiProduct, product]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!user || !product?.id) return;
    wishlistAPI.checkWishlist(product.id).then(res => {
      setInWishlist(res.data.inWishlist);
    }).catch(() => {});
  }, [user, product?.id]);

  const handleWishlistToggle = async () => {
    if (!user || !product?.id) return;
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await wishlistAPI.addToWishlist(product.id);
        setInWishlist(true);
      }
    } catch (err) {
      // silent
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-surface">
        <LoadingBar text="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-surface">
        <p className="text-secondary font-headline italic text-xl text-center">Product not found</p>
      </div>
    );
  }

  const images = productImages?.length > 0 
    ? productImages.map(img => img.image_url)
    : [product.image_url];
  const currentImage = images[currentImageIndex];
  const isOutOfStock = !product.stock_quantity || product.stock_quantity === 0;
  const price = parseFloat(product.price) || 0;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="bg-surface text-primary font-body antialiased selection:bg-secondary/20 pt-24">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12 lg:py-20">
        <Link to="/products" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors mb-12">
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Image Gallery */}
          <div className="lg:col-span-7 relative group">
            <ScrollReveal>
              <div className="aspect-[4/5] w-full overflow-hidden bg-surface-variant relative">
                <img 
                  src={currentImage || '/stitch/product_enshi_detail.webp'} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                />
                
                {images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handlePrevImage} className="w-10 h-10 bg-surface/80 backdrop-blur-sm border border-primary/10 flex items-center justify-center hover:bg-surface transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleNextImage} className="w-10 h-10 bg-surface/80 backdrop-blur-sm border border-primary/10 flex items-center justify-center hover:bg-surface transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Designer Note / Badge */}
              <div className="absolute -bottom-6 -left-6 hidden lg:block bg-surface p-6 shadow-sm border border-primary/5">
                <p className="font-headline italic text-secondary text-base uppercase tracking-tight">
                  {product.category} · {product.origin_location || 'Single Origin'}
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-6 lg:pt-0">
            <ScrollReveal delay={0.2}>
              <div className="mb-10">
                <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/60 block mb-4">
                  Origin / 原产地：{product.origin_location || 'Heritage Highlands'}
                </span>
                <h1 className="font-headline text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-primary">
                  {product.name} <br/>
                  <span className="font-normal italic text-3xl lg:text-5xl block mt-2 opacity-80">{product.name_cn || '产地之选'}</span>
                </h1>
                <p className="text-base lg:text-lg leading-relaxed text-on-surface-variant mb-10 max-w-md font-body font-light">
                  {product.description || "Hand-harvested from high-altitude cloud forests, this selection reflects the silent narrative of terroir and tradition. Preserving ancestral techniques and profound clarity in every cup."}
                </p>
              </div>

              <div className="space-y-10 mb-12">
                <div>
                  <h3 className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/80 mb-6 border-b border-primary/10 pb-2 flex justify-between items-center">
                    <span>Tasting Notes / 味觉档案</span>
                    {product.uuid && <span className="opacity-40">SKU: {product.uuid.slice(0, 8).toUpperCase()}</span>}
                  </h3>
                  <ul className="flex flex-wrap gap-3">
                    {(product.tasting_notes || "Steam-pressed, Young clover, Oceanic finish").split(',').map((note, i) => (
                      <li key={i} className="px-4 py-1.5 bg-surface-container-low text-primary text-xs font-medium border border-primary/5 uppercase tracking-wider">
                        {note.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                {product.brewing_guide && (
                  <div>
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/80 mb-4 border-b border-primary/10 pb-2">Brewing Guide / 冲泡建议</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-light italic">
                      {product.brewing_guide}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6 border-t border-primary/10 pt-10">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-headline font-bold text-primary">${price.toFixed(2)}</span>
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant opacity-60">
                      {product.weight || '50g'} Reserve
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-primary/10 bg-surface">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-primary/60 hover:text-primary transition-colors">-</button>
                      <span className="px-2 text-sm font-medium w-8 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-primary/60 hover:text-primary transition-colors">+</button>
                    </div>
                    {user && (
                      <button 
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className={`w-10 h-10 border border-primary/10 flex items-center justify-center transition-all ${inWishlist ? 'bg-secondary/10 border-secondary/30' : 'hover:bg-surface-container'}`}
                      >
                        <Heart size={18} fill={inWishlist ? '#895125' : 'none'} color={inWishlist ? '#895125' : '#082719'} className={wishlistLoading ? 'opacity-30' : ''} />
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => !isOutOfStock && addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className={`w-full py-5 font-headline text-lg flex items-center justify-center gap-3 transition-all ${isOutOfStock ? 'bg-primary/20 text-primary/40 cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-90'}`}
                >
                  {isOutOfStock ? 'Out of Stock / 缺货' : 'Add to cart / 加入购物车'}
                  {!isOutOfStock && <span className="material-symbols-outlined text-sm">east</span>}
                </button>
                
                {!isOutOfStock && (
                  <p className="text-[10px] text-center uppercase tracking-widest opacity-40">
                    In Stock ({product.stock_quantity} available)
                  </p>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications && (
          <section className="mt-24 pt-24 border-t border-primary/5">
            <ScrollReveal>
              <h2 className="font-headline text-2xl mb-10 italic text-primary">Technical Specifications / 技术规格</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                {Object.entries(typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-baseline border-b border-primary/5 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">{key}</span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* Meet the Producer Section */}
        <section className="mt-32 mb-16">
          <ScrollReveal>
            <div className="bg-primary-container text-surface p-10 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 lg:w-1/3 h-full opacity-20 hidden md:block">
                <img 
                  alt="Tea Producer" 
                  className="w-full h-full object-cover grayscale" 
                  src="/stitch/producer_qin.webp" 
                />
              </div>
              <div className="relative z-10 max-w-2xl">
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-6 block">Direct Trade Narrative / 直接贸易叙事</span>
                <h2 className="font-headline text-3xl md:text-5xl mb-8 leading-tight italic">
                  Meet the Producer: <br/>{product.producer_name || 'The Ancestral Cooperative'}
                </h2>
                <p className="text-on-primary-container text-base md:text-xl mb-10 leading-relaxed italic opacity-90">
                  {product.producer_story || "“The mountain provides the mist; we only provide the patience.” Refined through generations, ensuring each selection reflects the high-altitude terroir of ancestral gardens."}
                </p>
                <div className="flex items-center space-x-8 md:space-x-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl opacity-80">eco</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-60 text-center">Organic<br/>Certified</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl opacity-80">handshake</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-60 text-center">Fairtrade<br/>Sourced</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl opacity-80">history_edu</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-60 text-center">Heritage<br/>Method</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </main>
  );
};
