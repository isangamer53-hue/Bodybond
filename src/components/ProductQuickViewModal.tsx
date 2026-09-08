import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Droplets, 
  ChevronDown, 
  Sparkles, 
  Plus, 
  Minus,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatPrice } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<'features' | 'ingredients' | 'howTo' | null>('features');

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setSelectedShade(quickViewProduct.shades ? quickViewProduct.shades[0].id : undefined);
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : undefined);
      setQuantity(1);
      setAdded(false);
      setOpenSection('features');
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedShade, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#E2DAD0] overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#1A1817] shadow-md transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-6 bg-[#FAF7F2] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E1D9]">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#E8E1D9] shadow-xs mb-4">
            <img
              src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnail Strip */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#1A1817] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Configuration */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
          
          {/* Badge & Stars */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {quickViewProduct.badge && (
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#1A1817] text-white">
                  {quickViewProduct.badge}
                </span>
              )}
              <div className="flex items-center gap-1.5 text-xs text-[#6B635C]">
                <div className="flex text-[#FF2D8D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FF2D8D] text-[#FF2D8D]" />
                  ))}
                </div>
                <span className="font-bold text-[#1A1817]">{quickViewProduct.rating}</span>
                <span>({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1817]">
              {quickViewProduct.name}
            </h2>
            <p className="text-xs text-[#7A7169]">{quickViewProduct.subtitle}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="font-extrabold text-2xl text-[#1A1817]">
              {formatPrice(quickViewProduct.priceNZD)}
            </span>
            {quickViewProduct.compareAtPriceNZD && (
              <span className="text-sm text-[#9E948C] line-through">
                {formatPrice(quickViewProduct.compareAtPriceNZD)}
              </span>
            )}
            {quickViewProduct.compareAtPriceNZD && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#FF2D8D] text-white">
                SAVE {Math.round(((quickViewProduct.compareAtPriceNZD - quickViewProduct.priceNZD) / quickViewProduct.compareAtPriceNZD) * 100)}%
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A524C] leading-relaxed">
            {quickViewProduct.description}
          </p>

          {/* Shade Selection */}
          {quickViewProduct.shades && (
            <div className="space-y-2 pt-2 border-t border-[#F0EAE1]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1817]">Select Skin Shade:</span>
                <span className="text-[#FF2D8D] font-semibold">
                  {quickViewProduct.shades.find((s) => s.id === selectedShade)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {quickViewProduct.shades.map((shade) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade.id)}
                    className={`p-1 rounded-full transition-all cursor-pointer ${
                      selectedShade === shade.id ? 'ring-2 ring-[#1A1817] scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full block border border-black/15 shadow-inner"
                      style={{ backgroundColor: shade.colorHex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {quickViewProduct.sizes && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#1A1817]">Select Diameter Size:</span>
              <div className="flex gap-2">
                {quickViewProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#1A1817] text-white border-[#1A1817]'
                        : 'bg-white text-[#5A524C] border-[#DDD5CB] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Action */}
          <div className="space-y-3 pt-3 border-t border-[#F0EAE1]">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#DDD5CB] rounded-2xl bg-[#FAF7F2] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[#EAE3DA] rounded-xl text-[#5A524C] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-[#1A1817]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-[#EAE3DA] rounded-xl text-[#5A524C] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A1817] hover:bg-black text-white hover:shadow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatPrice(quickViewProduct.priceNZD * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(quickViewProduct, quantity, selectedShade, selectedSize);
                setQuickViewProduct(null);
                window.location.hash = 'checkout';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Order Now (ক্যাশ অন ডেলিভারি পেজ)</span>
            </button>

            <button
              onClick={() => {
                window.location.hash = `product/${quickViewProduct.id}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setQuickViewProduct(null);
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-[#7A7169] hover:text-[#1A1817] underline uppercase tracking-wider transition-colors cursor-pointer"
            >
              View Full Product Page & Reviews →
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#7A7169] pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Dispatches within 24-48 hrs</span>
              </span>
              <span>100% Skin Safe Formula</span>
            </div>
          </div>

          {/* Accordion Tabs */}
          <div className="divide-y divide-[#EFE9E2] border-t border-[#EFE9E2] pt-2 text-xs">
            {/* Features Accordion */}
            <div className="py-2.5">
              <button
                onClick={() => setOpenSection(openSection === 'features' ? null : 'features')}
                className="w-full flex items-center justify-between font-bold text-[#1A1817] py-1 cursor-pointer"
              >
                <span>Key Features & Benefits</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'features' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'features' && (
                <ul className="pt-2 space-y-1.5 text-[#6B635C] list-disc list-inside">
                  {quickViewProduct.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ingredients Accordion */}
            {quickViewProduct.ingredients && (
              <div className="py-2.5">
                <button
                  onClick={() => setOpenSection(openSection === 'ingredients' ? null : 'ingredients')}
                  className="w-full flex items-center justify-between font-bold text-[#1A1817] py-1 cursor-pointer"
                >
                  <span>Clean Ingredients</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'ingredients' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'ingredients' && (
                  <ul className="pt-2 space-y-1.5 text-[#6B635C] list-disc list-inside">
                    {quickViewProduct.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* How to use Accordion */}
            <div className="py-2.5">
              <button
                onClick={() => setOpenSection(openSection === 'howTo' ? null : 'howTo')}
                className="w-full flex items-center justify-between font-extrabold text-[#1A1817] py-1 cursor-pointer"
              >
                <span className="text-[#FF2D8D] uppercase font-black">WHERE TO USE • HOW TO USE • HOW TO REMOVE</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'howTo' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'howTo' && (
                <div className="pt-3 space-y-3 text-xs text-[#332222]">
                  <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                    <strong className="text-[#FF2D8D] font-black block text-xs uppercase">📍 WHERE TO USE (কোথায় ব্যবহার করবেন)</strong>
                    <p className="text-[11px] text-gray-700 mt-0.5">শাড়ির ব্লাউজ, ডিপ নেক, ব্যাকলেস ড্রেস, লেহেঙ্গা ওড়না এবং অফ-শোল্ডার টপসের ফিটিং ফিক্স রাখতে।</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <strong className="text-emerald-800 font-black block text-xs uppercase">✨ HOW TO USE (কীভাবে ব্যবহার করবেন)</strong>
                    <p className="text-[11px] text-gray-700 mt-0.5">১. ত্বকে ৩-৪ ফোঁটা লাগান ➔ ২. ১৫ সেকেন্ড বাতাস দিন ➔ ৩. ৩০ সেকেন্ড কাপড়ের ওপর চেপে ধরুন।</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200">
                    <strong className="text-cyan-800 font-black block text-xs uppercase">🚿 HOW TO REMOVE (কীভাবে রিমুভ করবেন)</strong>
                    <p className="text-[11px] text-gray-700 mt-0.5">কুসুম গরম বা সাবান পানি দিলে আঠা ওয়াটার-সল্যুবল হয়ে নিমিষেই উঠে যাবে। কাপড়ে দাগ পড়ে না।</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
