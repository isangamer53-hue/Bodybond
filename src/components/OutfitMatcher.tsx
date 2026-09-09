import React, { useState } from 'react';
import { OUTFIT_STYLES } from '../data/outfits';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { Sparkles, ArrowRight, Check, ShoppingBag, Lightbulb, Flame } from 'lucide-react';

export const OutfitMatcher: React.FC = () => {
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('plunge');
  const { addToCart, formatPrice, openDrawer } = useCart();
  const [added, setAdded] = useState(false);

  const activeOutfit = OUTFIT_STYLES.find((o) => o.id === selectedOutfitId) || OUTFIT_STYLES[0];
  const recommendedProduct = PRODUCTS.find((p) => p.id === activeOutfit.recommendedProductId) || PRODUCTS[0];

  const handleAddSolution = () => {
    addToCart(recommendedProduct);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openDrawer();
    }, 600);
  };

  return (
    <section id="outfit-matcher" className="py-12 sm:py-20 bg-transparent text-[#1E141D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#F2D3E2] text-xs font-black text-[#FF2D8D] tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Styling Guide • স্টাইলিং নির্দেশিকা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E141D] tracking-tight">
            Outfit Problem <span className="text-[#FF2D8D]">Solver</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5E3F54] font-medium">
            Select your neckline or silhouette below to see the exact application method and recommended Bodybond essentials.
          </p>
        </div>

        {/* Outfit Type Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {OUTFIT_STYLES.map((outfit) => (
            <button
              key={outfit.id}
              onClick={() => setSelectedOutfitId(outfit.id)}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer min-h-[44px] flex items-center ${
                selectedOutfitId === outfit.id
                  ? 'bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25 border border-transparent'
                  : 'bg-white text-[#5E3F54] hover:text-[#1E141D] hover:bg-white border border-[#F2D3E2]'
              }`}
            >
              {outfit.name}
            </button>
          ))}
        </div>

        {/* Active Outfit Solution Showcase Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-md border border-[#F2D3E2] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Image visual */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-[#F2D3E2]">
              <img
                src={activeOutfit.image}
                alt={activeOutfit.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 bg-[#FF2D8D] text-white rounded-full">
                  Outfit Focus
                </span>
                <h4 className="text-xl font-black mt-1 text-white">{activeOutfit.name}</h4>
              </div>
            </div>

            {/* Right Solution & Details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-1">
                <span className="text-xs font-black tracking-widest text-[#FF2D8D] uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>The Styling Challenge</span>
                </span>
                <p className="text-base sm:text-lg font-black text-[#1E141D]">
                  {activeOutfit.challenge}
                </p>
                <p className="text-xs sm:text-sm text-[#5E3F54] leading-relaxed font-medium">
                  {activeOutfit.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F2D3E2] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF2D8D] uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Stylist Application Tip:</span>
                </div>
                <p className="text-xs text-[#5E3F54] leading-relaxed font-medium">
                  {activeOutfit.tip}
                </p>
              </div>

              {/* Recommended Product Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F2D3E2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src={recommendedProduct.images[0]}
                    alt={recommendedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-white border border-[#F2D3E2] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black text-[#FF2D8D] uppercase tracking-wider block">
                      Recommended Match
                    </span>
                    <h5 className="font-black text-xs sm:text-sm text-[#1E141D] truncate">{recommendedProduct?.name || 'Bodybond Essential'}</h5>
                    <p className="text-xs text-[#FF2D8D] font-extrabold">{formatPrice(recommendedProduct?.priceNZD || 0)}</p>
                  </div>
                </div>

                <button
                  onClick={handleAddSolution}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FF2D8D] hover:bg-[#E61B78] text-white shadow-[#FF2D8D]/25'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order This Solution</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

