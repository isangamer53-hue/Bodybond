import React, { useState } from 'react';
import { Sparkles, Droplets, Clock, Heart, Play, ShieldAlert, Check, MapPin, RotateCcw } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'glue' | 'nips'>('glue');

  const glueSteps = [
    {
      step: '01',
      title: 'Prep & Dot',
      description: 'Ensure skin is clean and completely free of moisturizers, self-tan oils, or powders. Dab a small drop of Bodybond Glue directly onto fabric edge or skin.',
      icon: Droplets,
      tip: 'A little goes a long way! Just 3-4 small pea-sized dots for a plunge neckline.',
    },
    {
      step: '02',
      title: 'Wait 15s & Press',
      description: 'Allow 15 seconds for the formula to become slightly tacky. Press your clothing firmly against your skin for 20-30 seconds to lock the bond.',
      icon: Clock,
      tip: 'Your natural body warmth activates the medical polymer for a flexible 12h hold.',
    },
    {
      step: '03',
      title: 'Slay & Water Rinse',
      description: 'Enjoy your night with zero anxiety. When ready, gently lift fabric away and wash off skin with warm water and soap. Machine wash clothes normally.',
      icon: Heart,
      tip: '100% water soluble—leaves no stains on silks, satins, or delicate linens.',
    },
  ];

  const nipsSteps = [
    {
      step: '01',
      title: 'Peel Film & Position',
      description: 'Gently remove the clear protective plastic backing from your Bodybond Nips. Align the barbell piercing or smooth dome centrally.',
      icon: Droplets,
      tip: 'Save the plastic protective backing—you will reapply it after washing.',
    },
    {
      step: '02',
      title: 'Smooth & Warm',
      description: 'Press from the center outward to smooth the micro-tapered edges flush against your skin. Cup with warm palms for 10 seconds.',
      icon: Clock,
      tip: 'Ultra-thin tapered edges disappear completely under sheer white tees.',
    },
    {
      step: '03',
      title: 'Wash & Reuse 30+ Times',
      description: 'Peel off gently. Wash adhesive side with mild hand soap and warm water. Let air-dry face up, reapply plastic sheet, and store in travel case.',
      icon: Sparkles,
      tip: 'Never use paper towels or linty cloths to dry silicone adhesive.',
    },
  ];

  const steps = activeTab === 'glue' ? glueSteps : nipsSteps;

  return (
    <section id="how-it-works" className="py-12 sm:py-20 bg-transparent text-[#1E141D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-black text-[#FF2D8D] border border-[#F2D3E2] tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>Complete Styling & Usage Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E141D]">
            How It <span className="text-[#FF2D8D]">Works</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5E3F54] font-medium">
            Three effortless steps to all-night wardrobe security. No complicated contraptions or painful tape.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex p-1 bg-white rounded-full border border-[#F2D3E2] mt-4 shadow-sm">
            <button
              onClick={() => setActiveTab('glue')}
              className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'glue'
                  ? 'bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25'
                  : 'text-[#7A5E70] hover:text-[#1E141D]'
              }`}
            >
              Bodybond Glue
            </button>
            <button
              onClick={() => setActiveTab('nips')}
              className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'nips'
                  ? 'bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25'
                  : 'text-[#7A5E70] hover:text-[#1E141D]'
              }`}
            >
              Bodybond Nips™
            </button>
          </div>
        </div>

        {/* BOLD 3-SECTION FEATURE CARDS WITH BENGALI SUBTITLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: WHERE TO USE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2D3E2] shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-[#FF2D8D] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-2xl bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25">
                  <MapPin className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-black tracking-wider uppercase bg-white text-[#FF2D8D] border border-[#F2D3E2] px-2.5 py-1 rounded-full">
                  EVERY OUTFIT
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight">
                  WHERE TO USE
                </h3>
                <p className="text-sm font-black text-[#FF2D8D]">
                  (কোথায় ব্যবহার করবেন)
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5E3F54] pt-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong className="text-[#1E141D]">শাড়ি ও ব্লাউজ:</strong> শাড়ির ব্লাউজ বা ব্যাকলেস নেকলাইন ফিটিং লক রাখতে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong className="text-[#1E141D]">লেহেঙ্গা ও ওড়না:</strong> কাধ থেকে ওড়না পিছলে পড়া আটকাতে সেফটি পিনের বদলে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong className="text-[#1E141D]">গাউন ও অফ-শোল্ডার:</strong> যেকোনো স্লিভলেস বা ডিপ কাট ড্রেসের স্টাইলিং সহজ করতে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong className="text-[#1E141D]">ঝুল ছোট করতে:</strong> লং প্যান্ট বা স্কার্ট সাময়িক ঝুল ফিক্স রাখতে।</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: HOW TO USE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2D3E2] shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-[#FF2D8D] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-2xl bg-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25">
                  <Sparkles className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-black tracking-wider uppercase bg-white text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  EASY 3 STEPS
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight">
                  HOW TO USE
                </h3>
                <p className="text-sm font-black text-[#FF2D8D]">
                  (কীভাবে ব্যবহার করবেন)
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5E3F54] pt-1">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">১</span>
                  <span><strong className="text-[#1E141D]">১. অ্যাপ্লাই করুন:</strong> শুষ্ক ত্বকে ৩-৪ ফোঁটা বডিবন্ড গ্লু লাগান।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">২</span>
                  <span><strong className="text-[#1E141D]">২. ১৫ সেকেন্ড ওয়েট করুন:</strong> বাতাস দিয়ে হালকা স্টিকি হতে দিন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">৩</span>
                  <span><strong className="text-[#1E141D]">৩. ৩০ সেকেন্ড চাপুন:</strong> কাপড়ের ওপর চেপে ১২ ঘণ্টা নিশ্চিন্ত থাকুন!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: HOW TO REMOVE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2D3E2] shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-[#FF2D8D] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-2xl bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25">
                  <RotateCcw className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-black tracking-wider uppercase bg-white text-[#FF2D8D] border border-[#F2D3E2] px-2.5 py-1 rounded-full">
                  PAIN FREE
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight">
                  HOW TO REMOVE
                </h3>
                <p className="text-sm font-black text-[#FF2D8D]">
                  (কীভাবে রিমুভ করবেন)
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5E3F54] pt-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2D8D] font-bold">🚿</span>
                  <span><strong className="text-[#1E141D]">কুসুম গরম পানি দিয়ে ধুয়ে ফেলুন:</strong> গরম বা সাবান পানি দিলেই আলগা হয়ে যাবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2D8D] font-bold">✨</span>
                  <span><strong className="text-[#1E141D]">কাপড়ে কোনো আঠার দাগ থাকে না:</strong> সিল্ক, জর্জেট বা কটন কাপড়ে ১০০% দাগ-মুক্ত।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF2D8D] font-bold">🌸</span>
                  <span><strong className="text-[#1E141D]">ত্বকের জন্য সম্পূর্ণ নিরাপদ:</strong> স্কিন পিলিং বা ব্যথামুক্ত জেন্টল ফর্মুলা।</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Steps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#F2D3E2] shadow-md hover:border-[#FF2D8D] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number Watermark */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-[#F2D3E2] group-hover:text-[#FF2D8D] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#F2D3E2] flex items-center justify-center text-[#FF2D8D]">
                    <Icon className="w-6 h-6 text-[#FF2D8D]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-xl text-[#1E141D]">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#5E3F54] leading-relaxed">{item.description}</p>
                </div>

                {/* Pro tip pill */}
                <div className="mt-6 pt-4 border-t border-[#F2D3E2] flex items-start gap-2 text-xs text-[#5E3F54] bg-white border border-[#F2D3E2] p-3 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-[#1E141D]">Pro Tip:</strong> {item.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

