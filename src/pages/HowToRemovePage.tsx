import React from 'react';
import { RotateCcw, Droplets, CheckCircle2, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface PageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const HowToRemovePage: React.FC<PageProps> = ({ onNavigate }) => {
  const removeFeatures = [
    {
      title: 'কুসুম গরম বা সাবান পানি ব্যবহার করুন (Warm Water)',
      bangla: 'ওয়াটার সল্যুবল ফর্মুলা',
      icon: Droplets,
      desc: 'পার্টি বা অনুষ্ঠান শেষে বাথরুমে গিয়ে সামান্য কুসুম গরম পানি বা সাবান পানি স্পর্শ করালেই আঠাটি নিমিষেই নরম হয়ে উঠে যাবে।',
      points: [
        'টানাটানি করার কোনো প্রয়োজন নেই',
        'পানি লাগালেই আঠা জেলের মতো গলে উঠে আসে',
        'ত্বকে কোনো চুলকানি বা লাল ভাব হয় না'
      ]
    },
    {
      title: 'কাপড়ে কোনো আঠার দাগ পড়ে না (Zero Fabric Staining)',
      bangla: '১০০% ফেব্রিক সেফ',
      icon: Sparkles,
      desc: 'সাধারণ ফ্যাশন টেপ বা ডাবল সাইডেড টেপ তোলার পর কাপড়ে চিটচিটে বিশ্রী দাগ রেখে যায়, কিন্তু বডিবন্ড ওয়াশিংয়ে সম্পূর্ণ ধুয়ে পরিষ্কার হয়ে যায়।',
      points: [
        'দামি শিফন, সিল্ক, জর্জেট বা কাতান কাপড়ে কোনো আঠার চিহ্ন থাকে না',
        'স্বাভাবিক ধোয়াতেই কাপড়ের গ্লু চলে যায়',
        'ড্রাই ক্লিন করার কোনো ঝামেলা নেই'
      ]
    },
    {
      title: 'ত্বকের জন্য সম্পূর্ণ ব্যথামুক্ত (Pain-Free Removal)',
      bangla: 'স্কিন ফ্রেন্ডলি জেন্টল ফর্মুলা',
      icon: Heart,
      desc: 'ফ্যাশন টেপ খোলার সময় চামড়া টেনে লাল করে ফেলে বা পশম উপড়ে তীব্র ব্যথা দেয়। বডিবন্ড পিল-অফ অত্যন্ত জেন্টল ও পেইন-ফ্রি!',
      points: [
        'সেন্সিটিভ স্কিনের জন্য হাইপো-অ্যালার্জেনিক ফর্মুলা',
        'চামড়া বা পশমে টান লাগে না',
        'ডর্ম্যাটোলজিক্যালি সেফ ও হাইজিনিক'
      ]
    }
  ];

  return (
    <div className="bg-transparent text-[#1E141D] min-h-screen font-sans pb-24">
      
      {/* Page Header Banner */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#F2D3E2] bg-gradient-to-b from-white via-[#FFF5F8] to-transparent overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEBF3] text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black uppercase tracking-wider shadow-sm">
            <RotateCcw className="w-4 h-4 text-[#FF2D8D]" />
            <span>PAIN-FREE & WATER SOLUBLE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1E141D] leading-tight">
            HOW TO REMOVE <br />
            <span className="text-[#FF2D8D]">(কীভাবে রিমুভ করবেন / তুলবেন)</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5E3F54] max-w-2xl mx-auto leading-relaxed font-medium">
            বডিবন্ড গ্লু তোলা অত্যন্ত সহজ, ব্যথামুক্ত ও সুবিধাজনক। কোনো কেমিক্যাল স্প্রে লাগে না—শুধুমাত্র পানি দিয়েই নিমিষে উঠে যায়!
          </p>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        
        {/* Official 3-Step Removal Visual Graphic */}
        <div className="bg-white border-2 border-[#FF2D8D] rounded-3xl p-4 sm:p-6 shadow-xl overflow-hidden shadow-[#FF2D8D]/10">
          <div className="text-center pb-4 space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF2D8D]">Official Step-By-Step Removal Guide</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight">EASY REMOVAL PROCESS</h2>
            <p className="text-xs text-[#5E3F54]">Strong hold when you need it, easy off when you don't</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#F2D3E2] max-w-2xl mx-auto bg-white shadow-md">
            <img 
              src="/images/how_to_remove_guide.jpg" 
              alt="How to remove Bodybond Glue - Easy Removal Process" 
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {removeFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-[#F2D3E2] hover:border-[#FF2D8D] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white flex items-center justify-center shadow-md shadow-[#FF2D8D]/25 font-bold">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#1E141D] uppercase tracking-tight group-hover:text-[#FF2D8D] transition-colors">
                      {feat.title}
                    </h2>
                    <p className="text-xs font-extrabold text-[#FF2D8D] mt-1">
                      ({feat.bangla})
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5E3F54] leading-relaxed font-medium">
                    {feat.desc}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-[#F2D3E2]">
                    {feat.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#374151]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Bodybond Glue vs Fashion Tape */}
        <div className="bg-white border border-[#F2D3E2] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight text-center">
            WHY BODYBOND BEATS DOUBLE-SIDED FASHION TAPE
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#F2D3E2] text-[#FF2D8D]">
                  <th className="pb-3 font-black uppercase">বৈশিষ্ট্য (Feature)</th>
                  <th className="pb-3 font-black uppercase text-[#FF2D8D]">✨ BODYBOND GLUE</th>
                  <th className="pb-3 font-black uppercase text-[#7A5E70]">❌ DOUBLE-SIDED TAPE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D3E2] text-[#374151]">
                <tr>
                  <td className="py-3 font-bold text-[#1E141D]">রিমুভাল পদ্ধতি</td>
                  <td className="py-3 text-emerald-600 font-bold">পানি দিলে নিমিষে উঠে যায়</td>
                  <td className="py-3 text-rose-600 font-bold">চামড়া টেনে কষ্ট করে তুলতে হয়</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#1E141D]">কাপড়ে দাগ পড়ে কি?</td>
                  <td className="py-3 text-emerald-600 font-bold">একদম কোনো দাগ পড়ে না</td>
                  <td className="py-3 text-rose-600 font-bold">আঠার বিশ্রী দাগ রয়ে যায়</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#1E141D]">ত্বকের অনুভূতি</td>
                  <td className="py-3 text-emerald-600 font-bold">হাইপো-অ্যালার্জেনিক ও ব্যথামুক্ত</td>
                  <td className="py-3 text-rose-600 font-bold">ত্বক লাল হয় ও পশম টানে</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('product-detail', 'bodybond-glue')}
            className="px-10 py-4 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#FF2D8D]/25 hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <span>ORDER BODYBOND GLUE NOW</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
};
