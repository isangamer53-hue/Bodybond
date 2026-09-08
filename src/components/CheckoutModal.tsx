import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight,
  Lock,
  Phone,
  MapPin,
  User,
  MessageCircle,
  FileText,
  BadgeCheck,
  Copy,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotalNZD,
    appliedDiscount,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
    isFreeShippingUnlocked,
    formatPrice,
    currency,
    convertPrice,
    clearCart,
  } = useCart();

  const { language, t } = useLanguage();
  const { createOrder, openTrackingModal, announcement, validateCoupon } = useOrders();

  const [isSuccess, setIsSuccess] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Coupon input state
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ isError: boolean; text: string } | null>(null);

  if (!isCheckoutOpen) return null;

  // Delivery charge calculation
  // Dhaka: ৳60, Outside: ৳120
  const deliveryFeeBDT = deliveryArea === 'dhaka' ? (announcement?.insideDhakaFeeBDT ?? 60) : (announcement?.outsideDhakaFeeBDT ?? 120);
  const deliveryFeeNZD = deliveryFeeBDT; // Base currency in CartContext is BDT (e.g. 1350 for glue)
  const deliveryChargeDisplay = currency === 'BDT' 
    ? `৳${deliveryFeeBDT}`
    : formatPrice(deliveryFeeNZD);

  const discountAmountNZD = subtotalNZD * appliedDiscount;
  const totalNZD = Math.max(0, subtotalNZD - discountAmountNZD + deliveryFeeNZD);

  const subtotalBDT = Math.round(subtotalNZD);
  const discountBDT = Math.round(discountAmountNZD);
  const totalBDT = Math.max(0, subtotalBDT - discountBDT + deliveryFeeBDT);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    // Try CartContext default codes first
    const res = applyDiscountCode(couponInput);
    if (res.success) {
      setCouponMsg({ isError: false, text: res.message });
      setCouponInput('');
    } else {
      // Try validateCoupon from OrderContext
      const orderRes = validateCoupon(couponInput, subtotalBDT);
      if (orderRes.valid) {
        setCouponMsg({ isError: false, text: orderRes.message });
        setCouponInput('');
      } else {
        setCouponMsg({ isError: true, text: res.message || orderRes.message });
      }
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Please enter your name, phone number, and address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = createOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        address: address.trim(),
        city: deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
        zone: deliveryArea === 'dhaka' ? 'inside_dhaka' : 'outside_dhaka',
        items: [...cart],
        subtotalBDT,
        deliveryFeeBDT,
        discountBDT,
        totalBDT,
        paymentMethod: 'Cash on Delivery',
        adminNotes: orderNotes.trim() || undefined,
      });

      setOrderNumber(created.id);
      setIsSuccess(true);
      setIsSubmitting(false);
      clearCart();

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF2D8D', '#10B981', '#5A31F4', '#FAF7F2'],
        });
      } catch {
        // safe fallback
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleOpenLiveTracking = () => {
    const activeId = orderNumber;
    setIsCheckoutOpen(false);
    setIsSuccess(false);
    openTrackingModal(activeId);
  };

  const handleWhatsAppOrder = () => {
    const itemsList = cart.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ');
    const insideFee = announcement?.insideDhakaFeeBDT ?? 60;
    const outsideFee = announcement?.outsideDhakaFeeBDT ?? 120;
    const msg = `Hello Bodybond! I would like to place a Cash On Delivery order:\nItems: ${itemsList || 'Bodybond Glue'}\nName: ${fullName || '...'}\nPhone: ${phone || '...'}\nAddress: ${address || '...'}\nDelivery Area: ${deliveryArea === 'dhaka' ? `Inside Dhaka (৳${insideFee})` : `Outside Dhaka (৳${outsideFee})`}`;

    const waPhone = announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979';
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#121212] text-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#2B2B2B] overflow-hidden relative max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#261320] flex items-center justify-between bg-[#190E17]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF2D8D]/20 border border-[#FF2D8D]/40 flex items-center justify-center text-[#FFA6D5]">
              <Truck className="w-4 h-4 text-[#FF2D8D]" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase flex items-center gap-1.5">
                {t.checkoutTitle}
              </span>
              <p className="text-[11px] text-[#A0A0A0]">
                ⚡ Fast Cash on Delivery (Pay upon receipt)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setIsSuccess(false);
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {!isSuccess ? (
            <form onSubmit={handleConfirmOrder} className="space-y-4 sm:space-y-5">
              
              {/* COD Highlight Card */}
              <div className="bg-[#1D0E1A] border border-[#FF2D8D]/30 p-3.5 rounded-2xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FF2D8D] flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-extrabold text-[#FFA6D5] uppercase tracking-wide">
                    100% Guaranteed Cash On Delivery
                  </p>
                  <p className="text-gray-300 leading-relaxed text-[11px]">
                    {t.codNotice}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              {cart.length > 0 && (
                <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#2B2B2B] space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    {t.orderSummaryTitle} ({cart.reduce((a, c) => a + c.quantity, 0)} items)
                  </span>
                  <div className="divide-y divide-[#262626] max-h-32 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover border border-[#333333]" />
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-white flex-shrink-0">{formatPrice(item.priceNZD * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Inputs */}
              <div className="space-y-3.5">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>{t.fullNameLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white text-xs sm:text-sm focus:border-[#FF2D8D] focus:ring-1 focus:ring-[#FF2D8D] focus:outline-none transition-colors"
                  />
                </div>

                {/* Mobile Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>{t.phoneLabel}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white text-xs sm:text-sm focus:border-[#FF2D8D] focus:ring-1 focus:ring-[#FF2D8D] focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-gray-400">
                    We will call this phone number to confirm your delivery.
                  </p>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>{t.addressLabel}</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder={t.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white text-xs sm:text-sm focus:border-[#FF2D8D] focus:ring-1 focus:ring-[#FF2D8D] focus:outline-none transition-colors"
                  />
                </div>

                {/* Delivery Zone Radio Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>{t.deliveryAreaLabel}</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label 
                      onClick={() => setDeliveryArea('dhaka')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        deliveryArea === 'dhaka'
                          ? 'border-[#FF2D8D] bg-[#FF2D8D]/15 text-white'
                          : 'border-[#333333] bg-[#1A1A1A] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={deliveryArea === 'dhaka'}
                          onChange={() => setDeliveryArea('dhaka')}
                          className="accent-[#FF2D8D]"
                        />
                        <span className="font-bold">Inside Dhaka City</span>
                      </div>
                      <span className="font-extrabold text-[#FFA6D5]">
                        {currency === 'BDT' ? `৳${announcement?.insideDhakaFeeBDT ?? 60}` : formatPrice(announcement?.insideDhakaFeeBDT ?? 60)}
                      </span>
                    </label>

                    <label 
                      onClick={() => setDeliveryArea('outside')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        deliveryArea === 'outside'
                          ? 'border-[#FF2D8D] bg-[#FF2D8D]/15 text-white'
                          : 'border-[#333333] bg-[#1A1A1A] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={deliveryArea === 'outside'}
                          onChange={() => setDeliveryArea('outside')}
                          className="accent-[#FF2D8D]"
                        />
                        <span className="font-bold">Outside Dhaka City</span>
                      </div>
                      <span className="font-extrabold text-[#FFA6D5]">
                        {currency === 'BDT' ? `৳${announcement?.outsideDhakaFeeBDT ?? 120}` : formatPrice(announcement?.outsideDhakaFeeBDT ?? 120)}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.orderNotesLabel}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t.orderNotesPlaceholder}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white text-xs focus:border-gray-500 focus:outline-none"
                  />
                </div>

              </div>

              {/* Promo / Coupon Code Section */}
              <div className="p-3 bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF2D8D]" />
                    <span>কুপন কোড (Have a Coupon Code?)</span>
                  </span>
                  {discountCode && (
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      কুপন বাদ দিন ({discountCode})
                    </button>
                  )}
                </div>

                {appliedDiscount > 0 ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">কুপন '{discountCode}' যুক্ত হয়েছে! ({Math.round(appliedDiscount * 100)}% ছাড়)</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="কুপন কোড লিখুন (যেমন: WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#121212] border border-[#333333] text-white text-xs uppercase focus:border-[#FF2D8D] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#FF2D8D] hover:bg-[#D91B74] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Total Payable Summary Box */}
              <div className="p-3.5 bg-[#181818] border border-[#2D2D2D] rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>{t.subtotalLabel}:</span>
                  <span className="text-white font-bold">{formatPrice(subtotalNZD)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({Math.round(appliedDiscount * 100)}%):</span>
                    <span>-{formatPrice(discountAmountNZD)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>{t.deliveryFeeLabel}:</span>
                  <span className="text-[#FFA6D5] font-bold">{deliveryChargeDisplay}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-[#333333]">
                  <span>{t.totalPayableLabel}:</span>
                  <span className="text-[#FFA6D5]">{formatPrice(totalNZD)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Confirm Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl text-sm sm:text-base font-black tracking-wider uppercase bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white transition-all shadow-xl shadow-[#FF2D8D]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <BadgeCheck className="w-5 h-5 text-white" />
                  <span>{isSubmitting ? 'Processing...' : t.confirmOrderBtn}</span>
                </button>

                {/* Direct WhatsApp Order Option */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.whatsappOrderBtn}</span>
                </button>
              </div>

              {/* Security & Delivery assurance */}
              <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400 pt-1">
                <span>🛡️ {t.trustBadge2}</span>
                <span>•</span>
                <span>🚚 {t.trustBadge1}</span>
              </div>

            </form>
          ) : (
            /* Order Success View */
            <div className="py-6 sm:py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t.orderSuccessTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                  {t.orderSuccessDesc}
                </p>

                {/* Copyable Order ID badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1F1F1F] border border-[#333333]">
                  <span className="text-xs text-[#888888] font-bold">ORDER ID:</span>
                  <span className="font-mono font-extrabold text-sm text-[#FFA6D5]">{orderNumber}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#2D2D2D] text-xs text-left space-y-2.5 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>Delivery Update & Instructions</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {t.orderSuccessInstructions}
                </p>
                <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-gray-400 text-[11px]">
                  <span>Payment:</span>
                  <span className="font-bold text-white">Cash On Delivery</span>
                </div>
              </div>

              {/* Action Buttons: Live Tracking & WhatsApp */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                {/* Real-time Order Tracking Button */}
                <button
                  type="button"
                  onClick={handleOpenLiveTracking}
                  className="w-full sm:flex-1 py-3.5 px-4 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#FF2D8D]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Order Live</span>
                </button>

                {/* Continue shopping button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsSuccess(false);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#222222] hover:bg-[#2A2A2A] text-gray-200 border border-[#333333] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {t.continueShoppingBtn}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
