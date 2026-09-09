import React, { useState } from 'react';
import { FAQS } from '../data/faqs';
import { ChevronDown, Sparkles, Search, HelpCircle, Mail, MessageCircle } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-5', 'faq-7']);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'Application & Hold', label: 'Application & Hold' },
    { id: 'Skin & Sensitivity', label: 'Skin & Sensitivity' },
    { id: 'Removal & Washing', label: 'Removal & Washing' },
    { id: 'Shipping & Orders', label: 'Shipping & Orders' },
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-white border-t border-[#F2D3E2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#F2D3E2] text-xs font-bold text-[#FF2D8D] tracking-widest uppercase shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1A1817] font-normal">
            Frequently Asked <span className="italic">Questions</span>
          </h2>
          <p className="text-base text-[#6B635C]">
            Everything you need to know about wear time, skin safety, machine washing, and shipping.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4 mb-10">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search questions (e.g., sensitive skin, removal, silk)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#DDD5CB] text-xs text-[#1A1817] placeholder:text-[#9E948C] focus:ring-1 focus:ring-[#1A1817] focus:outline-none shadow-xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#FF2D8D] text-white shadow-sm'
                    : 'bg-white text-[#5E3F54] border border-[#F2D3E2] hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-8 border border-[#E2DAD0]">
              <p className="text-sm font-semibold text-[#1A1817]">No questions found matching "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 text-xs font-bold text-[#E27D60] underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#E2DAD0] shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F3EDE6] text-[#8C827A]">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[#1A1817]">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8C827A] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#E27D60]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#5A524C] leading-relaxed border-t border-[#F0EAE1] pt-4 animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Help Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DAD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base text-[#1A1817]">Still have questions about your outfit?</h4>
            <p className="text-xs text-[#7A7169]">Our Auckland-based customer concierge is happy to assist with sizing & outfit matching.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="mailto:support@bodybond.com"
              className="px-5 py-2.5 bg-white hover:bg-white text-[#1E141D] border border-[#F2D3E2] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>support@bodybond.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
