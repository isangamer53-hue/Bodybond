import React, { useState } from 'react';
import { Star, Eye, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useMedia } from '../context/MediaContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, formatPrice, setQuickViewProduct } = useCart();
  const { galleryImages } = useMedia();
  const [selectedShade, setSelectedShade] = useState(
    product.shades ? product.shades[0].id : undefined
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Dynamic image matching with media context
  const primaryImg = (product.id === 'bodybond-glue' && galleryImages[0]?.src) ? galleryImages[0].src : product.images[0];
  const secondaryImg = (product.id === 'bodybond-glue' && galleryImages[1]?.src) ? galleryImages[1].src : (product.images[1] || primaryImg);
  const activeImage = isHovered && secondaryImg ? secondaryImg : primaryImg;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedShade, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    if (product.inStock === false) {
      return; // Do NOT enter/navigate when sold out
    }
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      window.location.hash = `product/${product.id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isSoldOut = product.inStock === false;

  return (
    <div 
      className={`group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-sm ${
        isSoldOut 
          ? 'border-[#F2D3E2] opacity-80 cursor-not-allowed select-none' 
          : 'border-[#F2D3E2] hover:border-[#FF2D8D] hover:shadow-xl hover:shadow-[#FF2D8D]/15 cursor-pointer'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
        {/* Image Container */}
      <div className={`relative aspect-square w-full overflow-hidden bg-[#FFF5F8] ${isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <img
          src={activeImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover object-center transition-transform duration-700 ${isSoldOut ? 'filter grayscale-[30%]' : 'group-hover:scale-105'}`}
          loading="lazy"
          decoding="async"
        />

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {isSoldOut ? (
            <span className="px-3 py-1 text-[11px] font-black tracking-wider uppercase rounded-full bg-[#1E141D] text-white shadow-md border border-white/10">
              SOLD OUT
            </span>
          ) : (
            product.badge && (
              <span className="px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-full bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] text-white shadow-md border border-white/20">
                {product.badge}
              </span>
            )
          )}
          {!isSoldOut && product.compareAtPriceNZD && (
            <span className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full bg-[#FF2D8D] text-white shadow-sm">
              SAVE {Math.round(((product.compareAtPriceNZD - product.priceNZD) / product.compareAtPriceNZD) * 100)}%
            </span>
          )}
        </div>

        {/* Quick View Button - only for in stock */}
        {!isSoldOut && (
          <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickView}
              className="p-2.5 rounded-full bg-white/90 hover:bg-[#FF2D8D] hover:text-white text-[#1E141D] border border-[#F2D3E2] shadow-md hover:scale-110 transition-all cursor-pointer"
              title="Quick View"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Add overlay button on desktop hover */}
        <div className="absolute inset-x-4 bottom-4 z-10 hidden sm:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          {!isSoldOut ? (
            <button
              onClick={handleAdd}
              className={`w-full py-3 rounded-2xl text-xs font-black tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                addedAnimation 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] text-white hover:opacity-95 shadow-[#FF2D8D]/30'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Quick Add • {formatPrice(product.priceNZD)}</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-lg bg-[#F5EDF1] text-[#9E8294] border border-[#E8D4DF] cursor-not-allowed"
            >
              SOLD OUT — RESTOCKING SOON
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A5E70]">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-bold text-[#1E141D]">{product.rating}</span>
          <span className="text-[#9E8294]">({product.reviewCount})</span>
        </div>

        {/* Product Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="font-extrabold text-base text-[#1E141D] group-hover:text-[#FF2D8D] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#5E3F54] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Shade Selector if available */}
        {product.shades && product.shades.length > 0 && (
          <div className="pt-1 space-y-1.5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[11px] text-[#5E3F54]">
              <span className="font-semibold">Shade:</span>
              <span className="text-[#1E141D] text-[10px] font-bold">
                {product.shades.find((s) => s.id === selectedShade)?.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {product.shades.map((shade) => (
                <button
                  key={shade.id}
                  onClick={() => setSelectedShade(shade.id)}
                  style={{ backgroundColor: shade.colorHex }}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    selectedShade === shade.id
                      ? 'ring-2 ring-[#FF2D8D] ring-offset-2 ring-offset-white scale-110 border-[#FF2D8D]'
                      : 'border-[#F2D3E2] hover:scale-105'
                  }`}
                  title={shade.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Selector if available */}
        {product.sizes && (
          <div className="flex gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                  selectedSize === size
                    ? 'bg-[#FF2D8D] text-white border-[#FF2D8D]'
                    : 'bg-[#FFEBF3] text-[#FF2D8D] border-[#F2D3E2] hover:bg-[#FFD6E8]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Price & Mobile Add Button */}
        <div className="mt-auto pt-3 border-t border-[#F2D3E2] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-black text-lg text-[#FF2D8D]">
              {formatPrice(product.priceNZD)}
            </span>
            {product.compareAtPriceNZD && (
              <span className="text-xs text-[#9E8294] line-through">
                {formatPrice(product.compareAtPriceNZD)}
              </span>
            )}
          </div>

          {product.inStock !== false ? (
            <button
              onClick={handleAdd}
              className="sm:hidden px-3.5 py-2 bg-[#FF2D8D] hover:bg-[#D91B74] text-white rounded-xl text-xs font-black tracking-wider uppercase transition-colors cursor-pointer shadow-md"
              aria-label="Add to bag"
            >
              Add
            </button>
          ) : (
            <button
              disabled
              className="sm:hidden px-3 py-2 bg-[#F5EDF1] text-[#9E8294] rounded-xl text-[10px] font-bold tracking-wider uppercase cursor-not-allowed border border-[#E8D4DF]"
              aria-label="Out of stock"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
