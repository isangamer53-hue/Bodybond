import React from 'react';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Leaf, 
  MapPin, 
  Award, 
  Check, 
  ArrowRight,
  Droplets,
  Truck,
  Flame,
  CheckCircle2,
  Facebook,
  Instagram
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-transparent min-h-screen pb-24 space-y-12 sm:space-y-20 text-[#1E141D] font-sans">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-b from-white via-[#FFF5F8] to-transparent border-b border-[#F2D3E2] py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEBF3] text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>The Zero-Slip Movement • আমাদের গল্প</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1E141D] leading-tight">
            We Set Out to Banish <span className="text-[#FF2D8D]">Wardrobe Slips</span> Forever.
          </h1>
          <p className="text-sm sm:text-base text-[#5E3F54] max-w-2xl mx-auto leading-relaxed font-medium">
            Because nobody should spend their dream party, wedding, or photo shoot worrying about outfit slips or peeling painful red tape off delicate skin.
          </p>
        </div>
      </div>

      {/* The Story Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FF2D8D]">
              <Flame className="w-4 h-4 text-[#FF2D8D]" />
              <span>Engineered For Confidence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1E141D] leading-tight">
              From Frustrating Wedding Outfits to Bangladesh's #1 Wardrobe Adhesive
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#5E3F54] leading-relaxed font-medium">
              <p>
                Every woman has experienced the stress of a deep-neck saree blouse shifting out of place, a plunge dress opening unexpectedly, or cheap double-sided tape unsticking in sweaty weather.
              </p>
              <p>
                <strong className="text-[#1E141D]">BODYBOND</strong> was formulated to solve this forever: a sweat-resistant, medical-grade body adhesive infused with Aloe Vera & Vitamin E that holds strong for 12+ hours through heat and dancing, yet washes away gently with warm water with zero fabric stains.
              </p>
              <p>
                Trusted by thousands of fashion-forward women and bridal stylists across Bangladesh with 100% Cash on Delivery and doorstep parcel verification.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FF2D8D]/25 cursor-pointer flex items-center gap-2"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('how-to-use')}
                className="px-5 sm:px-6 py-3.5 bg-white hover:bg-[#FFEBF3] text-[#1E141D] border border-[#F2D3E2] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
              >
                How To Use Guide
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#F2D3E2] bg-white">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                alt="Bodybond Story"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-xs font-black text-[#FFA6D5] uppercase tracking-wider">Premium Formulation</span>
                <span className="text-lg sm:text-xl font-bold">100% Skin Safe • Hypoallergenic • Aloe Infused</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Pillars of Bodybond */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#F2D3E2] shadow-xl space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF2D8D]">The Bodybond Standard</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E141D]">
              Formulated With Care. Zero Compromises.
            </h2>
            <p className="text-xs text-[#7A5E70]">
              Made with dermatological grade ingredients suitable for sensitive skin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 bg-[#FFFDFE] rounded-2xl border border-[#F2D3E2] space-y-3 shadow-sm hover:border-[#FF2D8D]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FFEBF3] flex items-center justify-center text-[#FF2D8D]">
                <Leaf className="w-5 h-5 text-[#FF2D8D]" />
              </div>
              <h3 className="font-black text-sm text-[#1E141D]">100% Cruelty-Free</h3>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                Never tested on animals. Formulated entirely without harsh chemical toxins or artificial binders.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#FFFDFE] rounded-2xl border border-[#F2D3E2] space-y-3 shadow-sm hover:border-[#FF2D8D]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FFEBF3] flex items-center justify-center text-[#FF2D8D]">
                <ShieldCheck className="w-5 h-5 text-[#FF2D8D]" />
              </div>
              <h3 className="font-black text-sm text-[#1E141D]">Latex-Free & Safe</h3>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                100% free of latex, irritating acrylates, parabens, and synthetic perfumes that cause allergic skin redness.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#FFFDFE] rounded-2xl border border-[#F2D3E2] space-y-3 shadow-sm hover:border-[#FF2D8D]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FFEBF3] flex items-center justify-center text-[#FF2D8D]">
                <Droplets className="w-5 h-5 text-[#FF2D8D]" />
              </div>
              <h3 className="font-black text-sm text-[#1E141D]">Skin Hydration</h3>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                Infused with Aloe Vera & Vitamin E to soothe and protect delicate skin areas throughout all-day wear.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#FFFDFE] rounded-2xl border border-[#F2D3E2] space-y-3 shadow-sm hover:border-[#FF2D8D]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FFEBF3] flex items-center justify-center text-[#FF2D8D]">
                <Truck className="w-5 h-5 text-[#FF2D8D]" />
              </div>
              <h3 className="font-black text-sm text-[#1E141D]">Fast Nationwide COD</h3>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                Safe Cash on Delivery to all 64 districts across Bangladesh with express 24-48h fulfillment.
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-12 p-8 bg-gradient-to-r from-[#FFEBF3] via-white to-[#FFEBF3] rounded-3xl border border-[#F2D3E2] text-center space-y-4 shadow-md">
            <h3 className="text-lg font-black text-[#1E141D] uppercase tracking-wider">Connect With Us</h3>
            <p className="text-xs text-[#5E3F54] max-w-md mx-auto">
              Follow our official Facebook page and Instagram for customer looks, styling tips, and new restock alerts!
            </p>
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <a
                href="https://www.facebook.com/share/1QybWhQJCa/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white hover:bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                <span>Facebook Page</span>
              </a>
              <a
                href="https://www.instagram.com/bodybond_glue?stkn=MWg3eGZ6bzhhdnF3Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white hover:bg-[#E4405F]/10 text-[#E4405F] border border-[#E4405F]/30 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                <span>Instagram Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

