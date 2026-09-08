import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, formatPrice } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const popularSearches = [
    'Bodybond Glue',
    'Pierced Nips',
    'Essential Kit',
    'Seamless Covers',
    'Keychain Holder',
    'Backless Dress',
  ];

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E2DAD0] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8E1D9] flex items-center gap-3 bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#8C827A]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, kits, shades, and outfit solutions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1A1817] placeholder:text-[#9E948C] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8C827A] hover:text-[#1A1817] text-xs font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full bg-[#EAE3DA] hover:bg-[#DDD5CB] text-[#1A1817] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-5 py-3 bg-[#F4EFEB] border-b border-[#E8E1D9] flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="font-bold text-[#7A7169] whitespace-nowrap">Trending:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-3 py-1 bg-white hover:bg-[#FAF7F2] rounded-full border border-[#DDD5CB] text-[#3E3A37] whitespace-nowrap font-medium transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 divide-y divide-[#EFE9E2]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-[#1A1817]">No products found matching "{query}"</p>
              <p className="text-xs text-[#7A7169]">Try searching for "Glue", "Nips", or "Kit".</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  window.location.hash = `product/${prod.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsSearchOpen(false);
                }}
                className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAF7F2] p-2 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-[#E8E1D9] bg-[#FAF7F2] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1A1817] group-hover:text-[#E27D60] transition-colors truncate">
                        {prod.name}
                      </h4>
                      {prod.badge && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-[#1A1817] text-white">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A7169] line-clamp-1">{prod.shortDescription}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8C827A] mt-0.5">
                      <Star className="w-3 h-3 fill-[#E27D60] text-[#E27D60]" />
                      <span>{prod.rating} ({prod.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-bold text-xs sm:text-sm text-[#1A1817]">
                    {formatPrice(prod.priceNZD)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-hover:text-[#1A1817] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
