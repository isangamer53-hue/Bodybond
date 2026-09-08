import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Tag, 
  Gift, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { PRODUCTS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotalNZD,
    discountCode,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    freeShippingThresholdNZD,
    freeShippingRemainingNZD,
    isFreeShippingUnlocked,
    formatPrice,
    addToCart,
    setIsCheckoutOpen,
  } = useCart();

  const { language, t } = useLanguage();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [orderNote, setOrderNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isCartOpen) return null;

  const discountAmountNZD = subtotalNZD * appliedDiscount;
  const finalTotalNZD = Math.max(0, subtotalNZD - discountAmountNZD);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyDiscountCode(promoInput);
    if (res.success) {
      setPromoFeedback({ type: 'success', message: res.message });
      setPromoInput('');
    } else {
      setPromoFeedback({ type: 'error', message: res.message });
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Upsell candidates
  const upsellCandidates = PRODUCTS.filter(
    (p) => !cart.some((item) => item.productId === p.id)
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFFDFE] text-[#1E141D] shadow-2xl flex flex-col border-l border-[#F2D3E2]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F2D3E2] flex items-center justify-between bg-[#FFF5F8]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF2D8D]" />
              <h2 className="font-extrabold text-sm sm:text-base tracking-wider text-[#1E141D] uppercase">
                {t.cartTitle} ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#7A5E70] hover:text-[#1E141D] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* COD Info Banner inside Cart */}
          <div className="bg-[#FFEBF3] border-b border-[#F2D3E2] px-4 py-2.5 flex items-center gap-2 text-xs text-[#1E141D]">
            <Truck className="w-4 h-4 text-[#FF2D8D] flex-shrink-0" />
            <span className="text-[11px] font-bold text-[#6B3F5D]">
              🚚 Cash On Delivery: Pay when your package arrives
            </span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFEBF3] flex items-center justify-center mx-auto text-[#FF2D8D]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#1E141D]">{t.cartEmptyTitle}</h3>
                  <p className="text-xs text-[#7A5E70] max-w-xs mx-auto">
                    {t.cartEmptyDesc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-[#F2D3E2] shadow-sm flex gap-3 relative"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#F2D3E2] flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="pr-6">
                        <h4 className="font-bold text-xs text-[#1E141D] truncate">{item.name}</h4>
                        {item.selectedShade && (
                          <p className="text-[10px] text-[#FF2D8D] font-medium">Shade: {item.selectedShade}</p>
                        )}
                        <p className="text-xs font-black text-[#1E141D] mt-0.5">
                          {formatPrice(item.priceNZD)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2D3E2]">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-[#FFEBF3] rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-[#7A5E70] hover:text-[#FF2D8D] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#1E141D] min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#7A5E70] hover:text-[#FF2D8D] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-[#FF2D8D]">
                          {formatPrice(item.priceNZD * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-3 right-3 text-[#9E8294] hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#F2D3E2] bg-[#FFF5F8] space-y-3">
              
              {/* Promo / Coupon Input */}
              <div className="p-2.5 bg-white border border-[#F2D3E2] rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#4A2E42] flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>কুপন কোড (Coupon)</span>
                  </span>
                  {discountCode && (
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer font-bold"
                    >
                      রিমুভ
                    </button>
                  )}
                </div>

                {appliedDiscount > 0 ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
                    <span className="font-bold">কুপন '{discountCode}' ({Math.round(appliedDiscount * 100)}% ছাড়)</span>
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="কুপন কোড (যেমন: WELCOME10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#FFFDFE] border border-[#F2D3E2] text-[#1E141D] text-xs uppercase focus:border-[#FF2D8D] focus:outline-none placeholder:text-[#9E8294]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#FF2D8D] hover:bg-[#E0267B] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoFeedback && (
                  <p className={`text-[10px] ${promoFeedback.type === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {promoFeedback.message}
                  </p>
                )}
              </div>

              {/* Subtotal */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#66465B]">
                  <span>{t.subtotalLabel}</span>
                  <span className="font-bold text-[#1E141D]">{formatPrice(subtotalNZD)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({Math.round(appliedDiscount * 100)}%):</span>
                    <span>-{formatPrice(discountAmountNZD)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#66465B]">
                  <span>{t.deliveryFeeLabel}</span>
                  <span className="font-bold text-emerald-600">
                    Calculated at checkout
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-[#1E141D] pt-2 border-t border-[#F2D3E2]">
                  <span>{t.estimatedTotal}</span>
                  <span className="text-[#FF2D8D]">{formatPrice(finalTotalNZD)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 sm:py-4 bg-[#FF2D8D] hover:bg-[#E0267B] text-white rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-[#FF2D8D]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-[#7A5E70] pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#FF2D8D]" />
                  <span>{t.trustBadge3}</span>
                </span>
                <span>•</span>
                <span>{t.trustBadge1}</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
