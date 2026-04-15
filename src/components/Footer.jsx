import React from 'react';
import { Link } from 'react-router-dom';


export const Footer = () => {
  return (
          <footer className="bg-[#F4EDE0] text-[#082719] py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-24">
              <div>
                <span className="text-lg font-headline mb-4 block not-italic">Yún & Leaf 云叶</span>
                <p className="text-xs tracking-normal leading-relaxed opacity-60 max-w-xs">
                  Curating the intersection of heritage agriculture and modern specialty culture. From the mist-shrouded peaks to your morning cup.
                </p>
                <div className="mt-8 flex gap-4">
                  <div className="w-8 h-8 flex items-center justify-center border border-[#082719]/10 rounded-full opacity-60">
                    <span className="material-symbols-outlined text-sm">verified</span>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center border border-[#082719]/10 rounded-full opacity-60">
                    <span className="material-symbols-outlined text-sm">eco</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-[10px] uppercase tracking-widest mb-2">Shop</span>
                <Link className="text-[11px] uppercase tracking-widest opacity-60 hover:text-secondary transition-colors" to="/products">Coffee / 咖啡</Link>
                <Link className="text-[11px] uppercase tracking-widest opacity-60 hover:text-secondary transition-colors" to="/products">Tea / 茶</Link>
                <Link className="text-[11px] uppercase tracking-widest opacity-60 hover:text-secondary transition-colors" to="/wholesale">Wholesale / 批发</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-[10px] uppercase tracking-widest mb-2">Origins</span>
                <Link className="text-[11px] uppercase tracking-widest opacity-60 hover:text-secondary transition-colors" to="/regions">Yunnan / 云南</Link>
                <Link className="text-[11px] uppercase tracking-widest opacity-60 hover:text-secondary transition-colors" to="/regions">Hubei / 湖北</Link>
                <Link className="text-[11px] uppercase tracking-widest opacity-60 hover:text-secondary transition-colors" to="/journal">Journal / 刊物</Link>
              </div>
              <div>
                <span className="font-bold text-[10px] uppercase tracking-widest mb-4 block">Subscribe</span>
                <p className="text-[11px] mb-4 opacity-60">Join our journal for seasonal releases and brewing guides.</p>
                <form className="flex border-b border-[#082719]/20 pb-2">
                  <input className="bg-transparent border-none focus:ring-0 w-full text-[11px] placeholder:text-[#082719]/40" placeholder="Email address" type="email" />
                  <button className="material-symbols-outlined text-sm" type="submit">arrow_forward</button>
                </form>
              </div>
            </div>
            <div className="border-t border-[#082719]/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40 text-[10px] uppercase tracking-widest">
              <p>© 2024 Yún & Leaf 云叶. The Silent Narrative.</p>
              <div className="flex gap-8">
                <span>Instagram</span>
                <span>WeChat</span>
                <span>Substack</span>
              </div>
            </div>
          </div>
        </footer>
  );
};