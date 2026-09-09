import React from 'react';
import { OutfitMatcher } from '../components/OutfitMatcher';
import { Sparkles, ArrowRight, ShieldCheck, Heart, ShoppingBag, Package } from 'lucide-react';

interface OutfitMatcherPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const OutfitMatcherPage: React.FC<OutfitMatcherPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen pb-24 space-y-12 sm:space-y-16 text-[#1E141D]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#F2D3E2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>Interactive Wardrobe Guide • আউটফিট সমাধান</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E141D] tracking-tight">
            Outfit Problem <span className="text-[#FF2D8D]">Solver</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5E3F54] max-w-2xl mx-auto leading-relaxed font-medium">
            Select your neckline or silhouette below to see the exact dot placement strategy and essential tools needed for all-night security.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OutfitMatcher />
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FF2D8D] border border-[#F2D3E2] text-white rounded-3xl p-6 sm:p-12 text-center space-y-5 shadow-xl">
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-white/95 uppercase block">
            100% Cash On Delivery Available Nationwide
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Ready to Lock Down Your Look?
          </h2>
          <p className="text-xs sm:text-sm text-white/95 max-w-lg mx-auto leading-relaxed font-medium">
            Grab our viral Bodybond Glue & Seamless Nipple Covers with fast 24-48h door-to-door delivery.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-[#1E141D] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop All Essentials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

