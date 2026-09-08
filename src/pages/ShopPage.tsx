import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Filter, 
  SlidersHorizontal, 
  Search, 
  Check, 
  ArrowUpDown, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star,
  Flame,
  Tag
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, Product } from '../types';
import { useCart } from '../context/CartContext';

interface ShopPageProps {
  onNavigate: (page: string, productId?: string) => void;
  onSelectProduct: (product: Product) => void;
  initialCategory?: ProductCategory | 'all';
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  onNavigate, 
  onSelectProduct,
  initialCategory = 'all' 
}) => {
  const { formatPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'bestselling' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblemFilter, setSelectedProblemFilter] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Essentials', count: PRODUCTS.length },
    { id: 'glue', label: 'Bodybond Glue', count: PRODUCTS.filter((p) => p.category === 'glue').length },
    { id: 'nips', label: 'Nip Covers', count: PRODUCTS.filter((p) => p.category === 'nips').length },
  ];

  const problemTags = [
    { id: 'all', label: 'All Solutions' },
    { id: 'plunge', label: 'Plunging V-Neck' },
    { id: 'backless', label: 'Backless & Cowl Back' },
    { id: 'strapless', label: 'Strapless Tops' },
    { id: 'sheer', label: 'Sheer Fabrics' },
    { id: 'festival', label: 'Sweat-Proof & Dancing' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSub = product.subtitle.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchDesc) return false;
      }
      // Problem tag filter
      if (selectedProblemFilter && selectedProblemFilter !== 'all') {
        const text = `${product.name} ${product.description} ${product.features.join(' ')}`.toLowerCase();
        if (selectedProblemFilter === 'plunge' && !text.includes('plung') && !text.includes('adhesive') && !text.includes('glue')) return false;
        if (selectedProblemFilter === 'backless' && !text.includes('backless') && !text.includes('covers') && !text.includes('glue')) return false;
        if (selectedProblemFilter === 'strapless' && !text.includes('strapless') && !text.includes('glue') && !text.includes('kit')) return false;
        if (selectedProblemFilter === 'sheer' && !text.includes('sheer') && !text.includes('seamless') && !text.includes('pierced')) return false;
        if (selectedProblemFilter === 'festival' && !text.includes('sweat') && !text.includes('holder') && !text.includes('glue')) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'bestselling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'price-low') return a.priceNZD - b.priceNZD;
      if (sortBy === 'price-high') return b.priceNZD - a.priceNZD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCategory, sortBy, searchQuery, selectedProblemFilter]);

  return (
    <div className="bg-transparent text-[#1E141D] min-h-screen pb-20 font-sans">
      {/* Shop Header Banner */}
      <div className="bg-gradient-to-b from-[#FFEAF2] via-[#FFF5F8] to-[#FFF5F8] border-b border-[#F2D3E2] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF2D8D]">
                  Official Bodybond Collection
                </span>
                <span className="text-xs text-[#C49EAF]">•</span>
                <span className="text-xs font-semibold text-[#66465B]">100% Skin Safe Formula</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#1E141D] uppercase tracking-tight">
                Shop Wardrobe Essentials
              </h1>
              <p className="text-xs sm:text-sm text-[#5E3F54] max-w-xl leading-relaxed">
                Banish sticky fashion tape forever. Premium sweatproof adhesives, seamless matte covers, and wardrobe styling essentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filter and Control Bar */}
        <div className="space-y-4 mb-8">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ProductCategory | 'all')}
                className={`px-4 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white shadow-md font-black shadow-[#FF2D8D]/25'
                    : 'bg-white text-[#4A2E42] hover:bg-[#FFEBF3] border border-[#F2D3E2]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-black/20 text-white font-extrabold' : 'bg-[#FFEBF3] text-[#FF2D8D]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Controls: Search, Problem Tags, and Sort */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D80]" />
              <input
                type="text"
                placeholder="Search products, shades, outfits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F2D3E2] rounded-xl text-xs text-[#1E141D] placeholder:text-[#9E8294] focus:outline-none focus:border-[#FF2D8D] shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6D80] hover:text-[#1E141D]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Problem tags quick filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-[#66465B] flex items-center gap-1 pr-1">
                <Tag className="w-3 h-3 text-[#FF2D8D]" />
                Outfit:
              </span>
              {problemTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedProblemFilter(selectedProblemFilter === tag.id ? null : tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    (selectedProblemFilter === tag.id) || (tag.id === 'all' && !selectedProblemFilter)
                      ? 'bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white font-extrabold'
                      : 'bg-white hover:bg-[#FFEBF3] text-[#4A2E42] border border-[#F2D3E2]'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <label htmlFor="shop-sort" className="text-xs font-semibold text-[#5E3F54] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8C6D80]" />
                Sort:
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#F2D3E2] text-xs font-medium text-[#1E141D] rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF2D8D] cursor-pointer shadow-sm"
              >
                <option value="featured">Featured Picks</option>
                <option value="bestselling">Best Sellers</option>
                <option value="rating">Highest Rated (4.8+ ★)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#66465B] mb-6 pb-2 border-b border-[#F2D3E2]">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'essential' : 'essentials'}
          </span>
          <span className="text-[11px] text-[#FF2D8D] font-bold">
            ✨ Free Cash On Delivery Across Bangladesh
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F2D3E2] space-y-4 my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFEBF3] mx-auto flex items-center justify-center text-[#FF2D8D]">
              <Search className="w-8 h-8 text-[#FF2D8D]" />
            </div>
            <h3 className="text-2xl font-black text-[#1E141D] uppercase tracking-tight">
              No essentials match your filter
            </h3>
            <p className="text-xs text-[#66465B] max-w-md mx-auto">
              Try clearing your search query or switching category tabs to see the full collection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedProblemFilter(null);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Confidence Guarantees Banner */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#F2D3E2]">
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#F2D3E2] shadow-sm">
            <div className="p-3 bg-[#FFEBF3] rounded-xl text-[#FF2D8D] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs text-[#1E141D] uppercase tracking-wider">100% Skin Safe Formula</h4>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                Infused with Aloe Vera & Hyaluronic Acid. 100% latex-free and hypoallergenic.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#F2D3E2] shadow-sm">
            <div className="p-3 bg-[#FFEBF3] rounded-xl text-[#FF2D8D] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs text-[#1E141D] uppercase tracking-wider">Fast Cash On Delivery</h4>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                2-3 Days Fast Delivery Nationwide across Bangladesh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#F2D3E2] shadow-sm">
            <div className="p-3 bg-[#FFEBF3] rounded-xl text-[#FF2D8D] flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs text-[#1E141D] uppercase tracking-wider">30-Day Zero Slip Guarantee</h4>
              <p className="text-xs text-[#5E3F54] leading-relaxed">
                Love your all-night security or our customer care team will make it right.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
