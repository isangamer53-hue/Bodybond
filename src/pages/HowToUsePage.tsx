import React from 'react';
import { Sparkles, Clock, CheckCircle2, ArrowRight, ShieldCheck, Flame, AlertCircle } from 'lucide-react';

interface PageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const HowToUsePage: React.FC<PageProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '১',
      title: 'স্কিন ও কাপড় পরিষ্কার রাখুন (Prep Skin)',
      time: '5 SECONDS',
      desc: 'গ্লু লাগানোর আগে ত্বকে কোনো ভারী লোশন, ময়েশ্চারাইজার বা বডি অয়েল থাকলে তা টিস্যু দিয়ে মুছে ত্বক ও কাপড় শুকনো রাখুন।',
      tips: 'ত্বক তেলমুক্ত থাকলে আঠা সবচেয়ে বেশি দীর্ঘস্থায়ী হোল্ড দেয়।'
    },
    {
      num: '২',
      title: '৩-৪ ফোঁটা গ্লু লাগান (Apply Glue Drops)',
      time: '5 SECONDS',
      desc: 'বডিবন্ড টিউবের প্রিসিশন ডগা দিয়ে কাপড়ের ভেতরের বর্ডারে অথবা ত্বকে ৩-৪ ফোঁটা ছোট তরল আঠা লাগান।',
      tips: 'সামান্য ফোঁটাই যথেষ্ট—বেশি পরিমাণে ঢালার প্রয়োজন নেই।'
    },
    {
      num: '৩',
      title: '১৫ সেকেন্ড অপেক্ষা করুন (Wait 15s to become tacky)',
      time: '15 SECONDS',
      desc: 'আঠা দেওয়ার পর সঙ্গে সঙ্গে না চেপে ১৫ সেকেন্ড বাতাস দিন। বাতাস পেয়ে আঠাটি হালকা স্টিকি ও জ্যালের মতো আঠালো হয়ে উঠবে।',
      tips: 'এই ১৫ সেকেন্ড বাতাস দেওয়াই শক্তিশালী হোল্ডের আসল গোপন রহস্য!'
    },
    {
      num: '৪',
      title: '৩০ সেকেন্ড চেপে ধরুন (Press & Lock)',
      time: '30 SECONDS',
      desc: 'কাপড়টি কাঙ্ক্ষিত পজিশনে বসিয়ে হাত দিয়ে ৩০ সেকেন্ড চেপে ধরুন। ব্যাস! ১২+ ঘণ্টা যেকোনো পার্টি বা অনুষ্ঠানে নিশ্চিন্ত থাকুন।',
      tips: 'একবার লক হয়ে গেলে নাচ-গান বা গরমেও ড্রেস নিজের জায়গা থেকে সরবে না।'
    }
  ];

  return (
    <div className="bg-transparent text-[#1E141D] min-h-screen font-sans pb-24">
      
      {/* Page Header Banner */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#F2D3E2] bg-gradient-to-b from-white via-[#FFF5F8] to-transparent overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEBF3] text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FF2D8D]" />
            <span>30-SECOND APPLICATION GUIDE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1E141D] leading-tight">
            HOW TO USE <br />
            <span className="text-[#FF2D8D]">(কীভাবে ব্যবহার করবেন)</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5E3F54] max-w-2xl mx-auto leading-relaxed font-medium">
            মাত্র ৪টি সহজ ধাপে বডিবন্ড গ্লু দিয়ে আপনার ড্রেস পারফেক্টলি বডির সাথে লক করুন। সারাদিন বা সারা রাত কোনো চিন্তা ছাড়া উপভোগ করুন!
          </p>
        </div>
      </section>

      {/* Main Steps Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        
        {/* Official 3-Step Visual Graphic */}
        <div className="bg-white border-2 border-[#FF2D8D] rounded-3xl p-4 sm:p-6 shadow-xl overflow-hidden shadow-[#FF2D8D]/10">
          <div className="text-center pb-4 space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF2D8D]">Official Step-By-Step Visual Guide</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight">SECURE HOLD IN SECS</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#F2D3E2] max-w-2xl mx-auto bg-white shadow-md">
            <img 
              src="/images/how_to_use_guide.jpg" 
              alt="How to use Bodybond Glue - Secure Hold in Secs" 
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#F2D3E2] hover:border-[#FF2D8D] rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white font-black text-lg flex items-center justify-center shadow-md shadow-[#FF2D8D]/25">
                    {step.num}
                  </span>
                  <span className="px-3 py-1 bg-[#FFEBF3] text-[#FF2D8D] border border-[#F2D3E2] font-black text-[10px] tracking-wider uppercase rounded-full">
                    {step.time}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1E141D] uppercase tracking-tight group-hover:text-[#FF2D8D] transition-colors">
                    {step.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#5E3F54] leading-relaxed font-medium">
                  {step.desc}
                </p>

                <div className="p-3 rounded-2xl bg-[#FFF5F8] border border-[#F2D3E2] text-xs text-[#992257] flex items-start gap-2">
                  <Flame className="w-4 h-4 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                  <span><strong>প্রো-টিপ:</strong> {step.tips}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts Section */}
        <div className="bg-white border border-[#F2D3E2] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight text-center">
            PRO TIPS FOR BEST RESULTS (গুরুত্বপূর্ণ পরামর্শ)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <span className="font-black text-emerald-700 text-sm block uppercase">
                ✅ DO’S (যা করবেন)
              </span>
              <ul className="space-y-2 text-[#374151]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>গ্লু দেওয়ার পর ১৫ সেকেন্ড বাতাস দেওয়ার নিয়মটি মেনে চলুন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>চাপ দেওয়ার পর ৩০ সেকেন্ড ভালোভাবে চেপে ধরুন।</span>
                </li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
              <span className="font-black text-rose-700 text-sm block uppercase">
                ❌ DON’TS (যা করবেন না)
              </span>
              <ul className="space-y-2 text-[#374151]">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>আঠা লাগানোর আগে ত্বকে লোশন বা বডি অয়েল দিয়ে রাখবেন না।</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>আঠা দেওয়ার সাথে সাথে না শুকিয়ে চাপবেন না।</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('product-detail', 'bodybond-glue')}
            className="px-10 py-4 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#FF2D8D]/25 hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <span>ORDER BODYBOND GLUE NOW</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>

    </div>
  );
};
