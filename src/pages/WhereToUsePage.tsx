import React from 'react';
import { MapPin, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface PageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const WhereToUsePage: React.FC<PageProps> = ({ onNavigate }) => {
  const outfitCategories = [
    {
      id: 'saree-blouse',
      title: 'Saree Blouse & Deep Necklines',
      banglaTitle: 'শাড়ি ও ব্লাউজের ডিপ কাট',
      emoji: '👗',
      badge: 'MOST POPULAR',
      description: 'ডিপ নেক বা ব্যাকলেস শাড়ির ব্লাউজ কাধ থেকে পিছলে পড়ে যাওয়া বা ডিপ কাট ফাঁক হয়ে থাকা পুরোপুরি বন্ধ করে।',
      points: [
        'কাধের স্ট্র্যাপ বা ব্লাউজের ডোরি পিছলে পড়া আটকায়',
        'ডিপ ভি-নেক বা প্লান্জিং ব্লাউজ ছাতি থেকে ফাঁক হয় না',
        'ব্যাকলেস ব্লাউজের ফিটিং বডির সাথে নিখুঁতভাবে লেগে থাকে',
        'সেফটি পিনের কোনো প্রয়োজন নেই—ব্লাউজের দামি কাপড় নষ্ট হয় না'
      ],
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'lehenga-dupatta',
      title: 'Lehenga Dupatta & Heavy Borders',
      banglaTitle: 'লেহেঙ্গার ভারী ওড়না ও বর্ডার',
      emoji: '💃',
      badge: 'PARTY SAFE',
      description: 'ভারী জর্জেট, নেট বা কাতান ওড়না কাধে সেফটি পিন ছাড়া পারফেক্ট পজিশনে লক করে রাখে। নাচ বা নাড়াচাড়াতেও সরে না।',
      points: [
        'কাধের ওপর ওড়নার প্লেট পিন ছাড়াই আটকে থাকে',
        'লেহেঙ্গার গলার বর্ডার পারফেক্ট শেপে ধরে রাখে',
        'নাচ-গান বা হাঁটাচলাতেও ওড়না বারবার টেনে সোজা করতে হয় না',
        'দামি জরি বা নেট কাপড়ে কোনো ছিদ্র বা ফুটা হয় না'
      ],
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'western-gowns',
      title: 'Off-Shoulder, Gowns & Western Tops',
      banglaTitle: 'অফ-শোল্ডার, গাউন ও স্লিভলেস ড্রেস',
      emoji: '✨',
      badge: 'HOLDS ALL NIGHT',
      description: 'অফ-শোল্ডার ড্রেস, স্ট্র্যাপলেস গাউন এবং ওয়েস্টার্ন টপস পরার সময় বারবার হাত দিয়ে ওপরে তোলার দুশ্চিন্তা খতম!',
      points: [
        'অফ-শোল্ডার টপস নিচে নেমে যায় না বা ওপরে উঠে আসে না',
        'স্ট্র্যাপলেস বা পপ-আপ ড্রেস বুকের কাছে একদম লক থাকে',
        'হাই স্লিট বা ওপেন লেগ গাউন বাতাসে উড়ায় অনাকাঙ্ক্ষিত বিপদ এড়ায়',
        'গরম বা ঘামেও আঠা ঢিলে হয়ে আলগা হয় না'
      ],
      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'temporary-hem',
      title: 'Temporary Hemming (No Sewing)',
      banglaTitle: 'প্যান্ট বা স্কার্টের ঝুল ছোট করা (সেলাই ছাড়া)',
      emoji: '✂️',
      badge: 'SMART HACK',
      description: 'জরুরি প্রয়োজনে প্যান্ট বা ড্রেসের ঝুল বেশি লম্বা হলে সেলাই না করে নিমিষেই ভাজ করে আটকে রাখা যায়।',
      points: [
        'যেকোনো প্যান্ট বা স্কার্ট কাটা বা সেলাই ছাড়াই কাঙ্ক্ষিত ঝুল করা যায়',
        'ধোয়ার সাথে সাথে আঠা উঠে যাবে এবং কাপড় আগের মতো হয়ে যাবে',
        'হিল বা ফ্ল্যাট জুতোর সাথে মিলিয়ে প্যান্টের ঝুল অ্যাডজাস্ট করা সহজ',
        'জরুরি পার্টিকলে নিখুঁত ঝুল পাওয়ার স্মার্ট সমাধান'
      ],
      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-white text-[#1E141D] min-h-screen font-sans pb-24">
      
      {/* Page Header Banner */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#F2D3E2] bg-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black uppercase tracking-wider shadow-sm">
            <MapPin className="w-4 h-4 text-[#FF2D8D]" />
            <span>FABRIC & OUTFIT GUIDE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1E141D] leading-tight">
            WHERE TO USE <br />
            <span className="text-[#FF2D8D]">(কোথায় ব্যবহার করবেন)</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5E3F54] max-w-2xl mx-auto leading-relaxed font-medium">
            বডিবন্ড গ্লু যেকোনো আধুনিক ও ঐতিহ্যবাহী পোশাকে নিরাপদে ব্যবহার করা যায়। নিচে প্রতিটি পোশাকের জন্য ব্যবহারের বিবরণ দেওয়া হলো:
          </p>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {outfitCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border-2 border-[#F2D3E2] hover:border-[#FF2D8D] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#FF2D8D] text-white font-black text-[10px] tracking-wider uppercase rounded-full shadow-md">
                    {cat.badge}
                  </span>

                  <span className="absolute bottom-3 left-3 text-3xl p-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#F2D3E2]">
                    {cat.emoji}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight group-hover:text-[#FF2D8D] transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-sm font-extrabold text-[#FF2D8D] mt-0.5">
                      ({cat.banglaTitle})
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5E3F54] leading-relaxed font-medium">
                    {cat.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-[#F2D3E2]">
                    {cat.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#374151]">
                        <CheckCircle2 className="w-4 h-4 text-[#FF2D8D] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Order CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onNavigate('product-detail', 'bodybond-glue')}
                  className="w-full py-3 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#FF2D8D]/25 flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <span>Order Bodybond Glue Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Banner */}
        <div className="bg-gradient-to-r from-[#FF2D8D] via-[#FF65AC] to-[#FFA6D5] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#F2D3E2]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              100% FABRIC SAFE & SKIN FRIENDLY
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/95">
              সিল্ক, জর্জেট, শিফন বা কটন—কোনো কাপড়ে দাগ পড়ে না এবং ক্ষতি হয় না।
            </p>
          </div>

          <button
            onClick={() => onNavigate('product-detail', 'bodybond-glue')}
            className="px-8 py-3.5 bg-[#1E141D] hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            ORDER CASH ON DELIVERY
          </button>
        </div>
      </section>

    </div>
  );
};
