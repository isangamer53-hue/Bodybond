import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = [
    { id: 'all', label: 'All Essentials' },
    { id: 'glue', label: 'Bodybond Glue' },
    { id: 'nips', label: 'Bodybond Nips™' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeCategory === 'all') return true;
    return product.category === activeCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.priceNZD - b.priceNZD;
    if (sortBy === 'price-high') return b.priceNZD - a.priceNZD;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return 0; // featured default
  });

  return (
    <section id="products" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#FF2D8D] border border-[#F2D3E2] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Wardrobe Security</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1A1817] font-normal">
            Zero-Stress Essentials That <span className="italic">Actually Work</span>
          </h2>
          <p className="text-base text-[#6B635C] leading-relaxed">
            Engineered to move, bend, and sweat with your body. No tape pulling, no wardrobe malfunctions, and zero residue on your favorite garments.
          </p>
        </div>

        {/* Filter and Sort Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-[#E8E1D9] mb-10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#FF2D8D] text-white shadow-sm'
                    : 'bg-white text-[#5E3F54] border border-[#F2D3E2] hover:bg-white hover:text-[#FF2D8D]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#6B635C]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C827A]" />
            <span className="font-semibold text-[#1A1817]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#F2D3E2] text-[#1E141D] text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-[#FF2D8D] cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="rating">Highest Rated (4.9★+)</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Value Callout Footer Banner */}
        <div className="mt-16 rounded-3xl bg-[#FF2D8D] text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl">Not sure which Bodybond is for you?</h3>
            <p className="text-sm text-[#D0C4B8] max-w-xl">
              Match your exact dress, top, or saree with our Outfit Problem Solver guide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="#outfit-matcher"
              className="px-6 py-3 bg-[#FF2D8D] hover:bg-[#D91B74] text-white text-xs font-bold tracking-wider uppercase rounded-full text-center transition-all shadow-md"
            >
              Match My Outfit
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
