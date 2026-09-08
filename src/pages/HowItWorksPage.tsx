import React from 'react';
import { 
  Sparkles, 
  Droplets, 
  Shirt, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Flame, 
  Layers, 
  Sparkle,
  Heart
} from 'lucide-react';
import { HowItWorks } from '../components/HowItWorks';
import { IngredientsSpotlight } from '../components/IngredientsSpotlight';

interface HowItWorksPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-transparent min-h-screen pb-24 space-y-12 sm:space-y-16 text-[#1E141D]">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-white via-[#FFF5F8] to-transparent border-b border-[#F2D3E2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEBF3] text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>The Science of Secure Styling • কীভাবে কাজ করে</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E141D] tracking-tight">
            How Bodybond Works
          </h1>
          <p className="text-xs sm:text-sm text-[#5E3F54] max-w-2xl mx-auto leading-relaxed font-medium">
            Everything you need to know about our invisible, sweatproof, 100% skin-safe wardrobe adhesive and seamless faux-pierced nips.
          </p>
        </div>
      </div>

      {/* Main Step-by-Step Interactive Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorks />
      </div>

      {/* Skincare Formulation Deep Dive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IngredientsSpotlight />
      </div>

      {/* Fabric Compatibility & Staining Test Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F2D3E2] shadow-md space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF2D8D]">
              Fabric Safety Certified
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E141D]">
              100% Stain-Free on Delicate Fabrics
            </h2>
            <p className="text-xs sm:text-sm text-[#5E3F54] font-medium">
              Unlike fashion tape that leaves gummy residue that ruins dry-clean only silks, Bodybond is 100% water-soluble and rinses out effortlessly with warm water.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: '100% Pure Silk', result: 'Zero Residue', badge: 'Verified' },
              { name: 'Bridal Satin', result: '100% Stain-Free', badge: 'Verified' },
              { name: 'Natural Linen', result: 'Clean Rinse', badge: 'Verified' },
              { name: 'Sheer Organza', result: 'Invisible Hold', badge: 'Verified' },
              { name: 'Party Lycra/Spandex', result: 'Sweat Proof', badge: 'Verified' },
              { name: 'Delicate Floral Lace', result: 'No Snagging', badge: 'Verified' },
            ].map((fabric, idx) => (
              <div key={idx} className="p-4 bg-[#FFF5F8] rounded-2xl border border-[#F2D3E2] text-center space-y-1">
                <Shirt className="w-5 h-5 text-[#FF2D8D] mx-auto" />
                <span className="block text-xs font-bold text-[#1E141D] pt-1">{fabric.name}</span>
                <span className="block text-[10px] text-emerald-600 font-bold">{fabric.result}</span>
              </div>
            ))}
          </div>

          {/* Removal Tips */}
          <div className="p-5 sm:p-6 bg-[#FFF5F8] rounded-2xl border border-[#F2D3E2] flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-black text-sm text-[#1E141D]">Pain-Free Removal in 30 Seconds</h3>
              <p className="text-xs text-[#5E3F54] max-w-xl leading-relaxed font-medium">
                When you're ready to take your outfit off at the end of the night, simply peel gently away from the skin. Any remaining dots wash off with warm water and your favorite soap.
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md flex-shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center shadow-[#FF2D8D]/25"
            >
              Shop Bodybond Essentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

