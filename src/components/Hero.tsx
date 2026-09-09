import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  Heart, 
  ArrowRight, 
  Star, 
  Flame, 
  CheckCircle2, 
  Play
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

interface HeroProps {
  onShopClick: () => void;
  onKitsClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onKitsClick, onHowItWorksClick }) => {
  const { addToCart, formatPrice } = useCart();
  const heroProduct = PRODUCTS.find((p) => p.id === 'bodybond-glue') || PRODUCTS[0];

  return (
    <section id="hero" className="relative overflow-hidden bg-white text-[#1E141D] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#F2D3E2]">
      {/* Subtle glowing ambient pink gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-[#FF2D8D]/5 via-[#FF65AC]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Social Proof Star Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#FF2D8D]/40 shadow-sm text-xs font-semibold text-[#1E141D]">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[#1E141D] font-bold">4.9/5 Rating</span>
              <span className="text-[#FF2D8D]">•</span>
              <span className="text-[#7A5E70]">Over 10,000+ Outfits Secured 💕</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#1E141D] leading-[1.12] tracking-tight font-normal">
                Your Outfit’s <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#FF2D8D] drop-shadow-sm">
                  Secret Glamour Weapon.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#5E3F54] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                The viral pro-grade body adhesive & fashion nipple covers created for modern women. Zero slip for deep plunges, backless gowns, sarees, and strapless styles. 100% skin safe, sweatproof, and washes clean with warm water.
              </p>
            </div>

            {/* Value Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#F2D3E2] shadow-sm hover:border-[#FF2D8D]/60 transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#FF2D8D] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#1E141D]">100% Skin Safe</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#F2D3E2] shadow-sm hover:border-[#FF2D8D]/60 transition-colors">
                <Droplets className="w-4 h-4 text-[#FF2D8D] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#1E141D]">Sweatproof 12h</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#F2D3E2] shadow-sm hover:border-[#FF2D8D]/60 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D8D] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#1E141D]">Zero Fabric Stain</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#F2D3E2] shadow-sm hover:border-[#FF2D8D]/60 transition-colors">
                <Sparkles className="w-4 h-4 text-[#FF2D8D] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#1E141D]">Aloe + B5 Care</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] text-white hover:opacity-95 transition-all rounded-full font-black text-sm tracking-wider uppercase shadow-xl shadow-[#FF2D8D]/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto px-6 py-4 bg-white text-[#1E141D] hover:bg-white border border-[#FF2D8D]/40 hover:border-[#FF2D8D] transition-all rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-[#FF2D8D] text-[#FF2D8D]" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Quote Testimonial Minimal */}
            <div className="pt-4 border-t border-[#F2D3E2] flex items-center justify-center lg:justify-start gap-3 text-xs text-[#7A5E70]">
              <span className="font-semibold text-[#FF2D8D]">“Goodbye useless fashion tape forever.”</span>
              <span>— Vogue Recommended Wardrobe Essential</span>
            </div>
          </div>

          {/* Right Hero Visual Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-2xl border border-[#F2D3E2] shadow-[#FF2D8D]/5">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
                    alt="BODYBOND Wardrobe Security In Action"
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/5" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-[#FF2D8D]/50 backdrop-blur-md text-[#1E141D] text-xs font-bold tracking-wider uppercase shadow-md">
                    <Flame className="w-3.5 h-3.5 text-[#FF2D8D] fill-[#FF2D8D]" />
                    <span>#1 Viral Beauty Adhesive</span>
                  </div>

                  {/* Bottom Feature Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#F2D3E2] text-[#1E141D] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-[#1E141D]">{heroProduct.name}</h3>
                        <p className="text-[11px] text-[#7A5E70]">12+ Hour Sweatproof Body Glue</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-[#FF2D8D]">{formatPrice(heroProduct?.priceNZD || 0)}</span>
                        {heroProduct?.compareAtPriceNZD && (
                          <span className="block text-[10px] text-[#9E8294] line-through">
                            {formatPrice(heroProduct.compareAtPriceNZD)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          addToCart(heroProduct);
                          window.location.hash = 'checkout';
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-90 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Order Now (Cash On Delivery)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Social Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-2xl border border-[#F2D3E2] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF2D8D]/10 flex items-center justify-center text-[#FF2D8D] font-bold text-base">
                  💧
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E141D]">Rinses Clean in Water</p>
                  <p className="text-[11px] text-[#7A5E70]">Gentle on sensitive female skin</p>
                </div>
              </div>

              {/* Floating Rating Badge */}
              <div className="hidden sm:flex absolute -top-4 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-2xl border border-[#F2D3E2] items-center gap-2.5 z-20">
                <div className="w-9 h-9 rounded-full bg-[#FF2D8D] text-white flex items-center justify-center font-black text-xs shadow-md">
                  50+
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E141D]">Uses Per Bottle</p>
                  <p className="text-[11px] text-[#7A5E70]">5-7 months average supply</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
