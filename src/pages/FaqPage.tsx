import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  ChevronDown, 
  HelpCircle, 
  Mail, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Check,
  Send,
  MessageCircle
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

interface FaqPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

interface FaqItem {
  id: string;
  category: 'application' | 'skin' | 'fabric' | 'shipping' | 'returns';
  question: string;
  questionBn?: string;
  answer: string;
  answerBn?: string;
}

const FAQ_DATABASE: FaqItem[] = [
  {
    id: 'f1',
    category: 'application',
    question: 'How do I apply Bodybond Glue for maximum all-night hold?',
    questionBn: 'বডিবন্ড বডি গ্লু কীভাবে সঠিকভাবে লাগাবেন?',
    answer: 'Start with clean, dry skin (free of oil or lotion). Place 2-3 small drops on skin or the inner garment edge. Wait 15-20 seconds until it feels slightly tacky, then firmly press fabric to skin for 20-30 seconds to lock the bond.',
    answerBn: 'পরিষ্কার ও শুকনো ত্বকে ২-৩ ফোঁটা গ্লু লাগান। ১৫-২০ সেকেন্ড অপেক্ষা করে হালকা আঠালো হলে কাপড় চেপে ধরুন ৩০ সেকেন্ড।'
  },
  {
    id: 'f2',
    category: 'application',
    question: 'Will Bodybond hold up through heavy sweating, humidity, and dancing?',
    questionBn: 'ঘাম বা গরমে কি আঠা খুলে যাবে?',
    answer: 'Yes! Bodybond is sweat-resistant and specially formulated to withstand warm, humid weather, weddings, and dance events for 12+ hours without peeling.',
    answerBn: 'না, এটি ঘাম-প্রতিরোধী এবং বিয়ে বাড়ি ও গরমের অনুষ্ঠানে ১২+ ঘণ্টা নিখুঁত সাপোর্ট দেয়।'
  },
  {
    id: 'f3',
    category: 'application',
    question: 'How many times can I use a 20ml / 30ml tube of Bodybond?',
    questionBn: 'একটি ২০ মিলি / ৩০ মিলি বোতল কতবার ব্যবহার করা যাবে?',
    answer: 'A 20ml bottle provides approximately 50-75 full outfit applications (5-8 months of regular wear), and the 30ml value pack offers 90-120+ applications.',
    answerBn: '২০ মিলি বোতলে প্রায় ৫০-৭৫ বার এবং ৩০ মিলি বোতলে ৯০-১২০ বার ব্যবহার করা সম্ভব।'
  },
  {
    id: 'f4',
    category: 'skin',
    question: 'Is Bodybond safe for sensitive skin? Will it cause rashes?',
    questionBn: 'সেনসিটিভ ত্বকে কোনো এলার্জি বা লালচে দাগ হবে কি?',
    answer: 'Yes, 100% skin safe. Bodybond is hypoallergenic, latex-free, and infused with organic Aloe Vera & Vitamin E. It peels off gently without redness or irritation.',
    answerBn: 'সম্পূর্ণ নিরাপদ। এতে রয়েছে অ্যালোভেরা ও ভিটামিন ই যা ত্বকে কোনো জ্বালাপোড়া বা দাগ ফেলে না।'
  },
  {
    id: 'f5',
    category: 'skin',
    question: 'How do I remove Bodybond at the end of the night? Does it hurt?',
    questionBn: 'কীভাবে রিমুভ করবেন? তুলতে কোনো ব্যথা লাগে?',
    answer: 'Removal is 100% painless! Gently lift fabric away from your body. Any remaining residue dissolves effortlessly with lukewarm water and soap in seconds.',
    answerBn: 'কোনো ব্যথা লাগে না। হালকা কুসুম গরম পানি ও সাবান দিলে সাথে সাথেই উঠে যায়।'
  },
  {
    id: 'f6',
    category: 'fabric',
    question: 'Will Bodybond stain delicate silk, georgette, velvet, or katan sarees?',
    questionBn: 'সিল্ক, কাতান বা জর্জেট পোশাকে কি কোনো দাগ পড়বে?',
    answer: 'No. Bodybond is 100% water-soluble and oil-free. It washes out completely from fabrics during normal hand wash or dry cleaning with zero residue.',
    answerBn: 'না। এটি ওয়াটার-সল্যুবল হওয়ায় পোশাকে কোনো তেল চিটচিটে বা স্থায়ী দাগ ফেলে না।'
  },
  {
    id: 'f7',
    category: 'shipping',
    question: 'How does Cash on Delivery (COD) work across Bangladesh?',
    questionBn: 'ক্যাশ অন ডেলিভারি (COD) কীভাবে কাজ করে?',
    answer: 'No advance online payment is required. Place your order with name, phone number, and address. Pay cash to the delivery rider when receiving your parcel.',
    answerBn: 'কোনো অগ্রিম পেমেন্ট ছাড়া অর্ডার করুন। পার্সেল হাতে পেয়ে ডেলিভারিম্যানকে ক্যাশ পেমেন্ট করবেন।'
  },
  {
    id: 'f8',
    category: 'shipping',
    question: 'What are the delivery times and charges for Dhaka & outside Dhaka?',
    questionBn: 'ডেলিভারি সময় ও চার্জ কত?',
    answer: 'Dhaka City: 24-48 hours (৳70). Outside Dhaka / Sub-urban / All Districts: 2-3 business days (৳130) via Steadfast / RedX express courier.',
    answerBn: 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা (৭০ টাকা), ঢাকার বাইরে ২-৩ কার্যদিবস (১৩০ টাকা)।'
  },
  {
    id: 'f9',
    category: 'returns',
    question: 'Can I inspect the parcel before receiving?',
    questionBn: 'পার্সেল কি দেখে রিসিভ করা যাবে?',
    answer: 'Yes! Riders allow you to check the outer branded packaging and seal before handing over cash.',
    answerBn: 'হ্যাঁ, ডেলিভারিম্যানের সামনে সিল ও প্যাকেজিং চেক করে গ্রহণ করতে পারবেন।'
  }
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const { announcement } = useOrders();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('f1');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const phone = announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979';

  const categories = [
    { id: 'all', label: 'All Questions', labelBn: 'সকল প্রশ্ন' },
    { id: 'application', label: 'Application & Hold', labelBn: 'ব্যবহার বিধি' },
    { id: 'skin', label: 'Skin Safety', labelBn: 'ত্বকের সুরক্ষা' },
    { id: 'fabric', label: 'Clothing & Washing', labelBn: 'পোশাক ও ওয়াশ' },
    { id: 'shipping', label: 'Cash on Delivery', labelBn: 'ডেলিভারি তথ্য' },
    { id: 'returns', label: 'Guarantee & Support', labelBn: 'সাপোর্ট' },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.question} ${item.questionBn || ''} ${item.answer} ${item.answerBn || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="bg-white min-h-screen pb-24 space-y-12 sm:space-y-16 text-[#1E141D] font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-[#F2D3E2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#FF2D8D] border border-[#F2D3E2] text-xs font-black tracking-wider uppercase shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>Help Center & FAQ • সাহায্য কেন্দ্র</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E141D] tracking-tight">
            Frequently Asked <span className="text-[#FF2D8D]">Questions</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5E3F54] max-w-xl mx-auto leading-relaxed font-medium">
            Find answers regarding application, delicate saree blouses, sensitive skin safety, Cash on Delivery, and delivery tracking.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E8294]" />
            <input
              type="text"
              placeholder="Search (e.g. saree, sweat, wash, delivery, skin, দাম)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#F2D3E2] rounded-2xl text-xs sm:text-sm text-[#1E141D] placeholder:text-[#9E8294] focus:outline-none focus:border-[#FF2D8D] shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A5E70] hover:text-[#1E141D] px-2 py-1 bg-white border border-[#F2D3E2] rounded-lg cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 min-h-[40px] ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white shadow-md shadow-[#FF2D8D]/25 border border-[#FF2D8D]'
                    : 'bg-white text-[#5E3F54] border border-[#F2D3E2] hover:bg-white hover:text-[#1E141D] shadow-sm'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75">({cat.labelBn})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Help Guide Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('where-to-use')}
            className="p-3.5 rounded-2xl bg-white border border-[#F2D3E2] hover:border-[#FF2D8D] text-left transition-all group cursor-pointer shadow-sm hover:shadow-md"
          >
            <span className="text-xs font-black uppercase text-[#FF2D8D] block">📍 WHERE TO USE</span>
            <span className="text-[11px] text-[#5E3F54]">কোন কোন পোশাকে ব্যবহার করবেন</span>
          </button>
          <button
            onClick={() => onNavigate('how-to-use')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 text-left transition-all group cursor-pointer shadow-sm hover:shadow-md"
          >
            <span className="text-xs font-black uppercase text-emerald-600 block">✨ HOW TO USE</span>
            <span className="text-[11px] text-[#5E3F54]">৩টি সহজ ধাপে ব্যবহারের নিয়ম</span>
          </button>
          <button
            onClick={() => onNavigate('how-to-remove')}
            className="p-3.5 rounded-2xl bg-white border border-cyan-200 hover:border-cyan-500 text-left transition-all group cursor-pointer shadow-sm hover:shadow-md"
          >
            <span className="text-xs font-black uppercase text-cyan-600 block">🚿 HOW TO REMOVE</span>
            <span className="text-[11px] text-[#5E3F54]">সহজে তোলার সম্পূর্ণ গাইড</span>
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen 
                      ? 'bg-white border-[#FF2D8D] shadow-md ring-1 ring-[#FF2D8D]/20' 
                      : 'bg-white border-[#F2D3E2] hover:border-[#FF2D8D]/40 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer min-h-[52px]"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs sm:text-sm text-[#1E141D] leading-snug block">
                        {faq.question}
                      </span>
                      {faq.questionBn && (
                        <span className="text-[11px] font-medium text-[#FF2D8D] block">
                          {faq.questionBn}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7A5E70] transition-transform flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#FF2D8D]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5E3F54] leading-relaxed border-t border-[#F2D3E2] pt-3.5 space-y-2 animate-in fade-in duration-200">
                      <p>{faq.answer}</p>
                      {faq.answerBn && (
                        <p className="p-2.5 bg-white rounded-xl text-[11px] sm:text-xs text-[#992257] border border-[#F2D3E2]">
                          💡 <strong className="text-[#1E141D]">বাংলায়:</strong> {faq.answerBn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 text-center rounded-2xl border border-[#F2D3E2] shadow-sm">
              <p className="text-xs text-[#7A5E70]">No questions matched "{searchQuery}". You can chat directly with our team on WhatsApp below.</p>
            </div>
          )}
        </div>

        {/* Contact Concierge Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F2D3E2] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF2D8D]">
                Still Have A Question?
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E141D]">
                Contact BODYBOND Support
              </h2>
              <p className="text-xs text-[#5E3F54]">
                Need outfit advice or help placing a Cash on Delivery order?
              </p>
            </div>

            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent('Hello Bodybond Team! I have a question regarding my order / product.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp Chat</span>
            </a>
          </div>

          {contactSent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your inquiry has been received. Our team will contact you via phone/WhatsApp shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSendContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E141D]">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farzana Islam"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#F2D3E2] rounded-xl text-xs text-[#1E141D] placeholder:text-[#9E8294] focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E141D]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01700000000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#F2D3E2] rounded-xl text-xs text-[#1E141D] placeholder:text-[#9E8294] focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1E141D]">How Can We Help? *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your dress, event date, or order inquiry..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white border border-[#F2D3E2] rounded-xl text-xs text-[#1E141D] placeholder:text-[#9E8294] focus:outline-none focus:border-[#FF2D8D]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-[#FF2D8D] hover:bg-[#E61B78] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FF2D8D]/25 flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-[#7A5E70]">⚡ We reply within 10-30 minutes</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

