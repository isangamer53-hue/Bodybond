import React from 'react';
import { Sparkles, ShieldCheck, Droplets, Leaf, HeartHandshake } from 'lucide-react';

export const IngredientsSpotlight: React.FC = () => {
  const ingredients = [
    {
      name: 'Aloe Vera Extract',
      category: 'Soothing Botanical',
      description: 'Cools and calms the skin, preventing redness or friction irritation even during active dancing.',
      icon: Leaf,
    },
    {
      name: 'Hyaluronic Acid',
      category: 'Skin Barrier Protection',
      description: 'Draws moisture into the epidermis, ensuring skin stays deeply hydrated beneath the garment bond.',
      icon: Droplets,
    },
    {
      name: 'Pro-Vitamin B5 (Panthenol)',
      category: 'Nutrient Fortifier',
      description: 'Deeply nourishes and conditions delicate skin on the chest, shoulders, and waistline.',
      icon: Sparkles,
    },
    {
      name: 'Medical VP/VA Copolymer',
      category: 'Pro-Grade Hold Agent',
      description: 'A flexible, dermatologically approved skin adhesive that moves seamlessly with body heat and rinses clean with warm water.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-transparent border-t border-[#F2D3E2] text-[#1E141D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-black text-[#FF2D8D] border border-[#F2D3E2] tracking-widest uppercase shadow-sm">
            <Leaf className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>Clean Skincare Science • ১০০% স্কিন ফ্রেন্ডলি উপাদান</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E141D]">
            Formulated Like <span className="text-[#FF2D8D]">Luxury Skincare</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5E3F54] font-medium">
            Unlike industrial double-sided tape packed with harsh solvents, Bodybond is crafted with gentle, nourishing skincare ingredients that love your skin.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ingredients.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-[#F2D3E2] shadow-md hover:border-[#FF2D8D] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#F2D3E2] flex items-center justify-center text-[#FF2D8D] mb-4 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF2D8D]">
                    {item.category}
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-[#1E141D]">{item.name}</h3>
                  <p className="text-xs text-[#5E3F54] leading-relaxed font-medium">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free from badges */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-3xl bg-white border border-[#F2D3E2] shadow-sm flex flex-wrap items-center justify-around gap-3 sm:gap-4 text-[11px] sm:text-xs font-black text-[#374151]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 100% Latex-Free
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Paraben & Phthalate-Free
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Cruelty-Free & Vegan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe on Sensitive Skin
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 100% Water-Soluble
          </span>
        </div>

      </div>
    </section>
  );
};

