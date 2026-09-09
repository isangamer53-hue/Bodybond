import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Phone, 
  MapPin, 
  User, 
  FileText, 
  Tag, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  BadgeCheck, 
  MessageCircle, 
  Copy, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotalNZD,
    appliedDiscount,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
    formatPrice,
    currency,
    addToCart,
  } = useCart();

  const { language, t } = useLanguage();
  const { createOrder, openTrackingModal, announcement, validateCoupon } = useOrders();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ isError: boolean; text: string } | null>(null);

  // Order submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Delivery Charge Calculation
  const deliveryFeeBDT = deliveryArea === 'dhaka' 
    ? (announcement?.insideDhakaFeeBDT ?? 60) 
    : (announcement?.outsideDhakaFeeBDT ?? 120);

  const subtotalBDT = Math.round(subtotalNZD);
  const discountAmountBDT = Math.round(subtotalBDT * appliedDiscount);
  const totalBDT = Math.max(0, subtotalBDT - discountAmountBDT + deliveryFeeBDT);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyDiscountCode(couponInput);
    if (res.success) {
      setCouponMsg({ isError: false, text: res.message });
      setCouponInput('');
    } else {
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
    setFormError(null);

    if (cart.length === 0) {
      setFormError('আপনার কার্ট খালি! অর্ডার করতে প্রথমে একটি পণ্য যুক্ত করুন (Your bag is empty).');
      return;
    }

    if (!fullName.trim()) {
      setFormError('দয়া করে আপনার পুরো নাম লিখুন (Please enter your full name).');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setFormError('দয়া করে একটি সঠিক ১০ বা ১১ ডিজিটের মোবাইল নম্বর লিখুন (Please enter a valid phone number).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setFormError('দয়া করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (Please enter your full delivery address).');
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
        discountBDT: discountAmountBDT,
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
          particleCount: 150,
          spread: 90,
          origin: { y: 0.4 },
          colors: ['#FF2D8D', '#10B981', '#5A31F4', '#FAF7F2'],
        });
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setFormError('অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Quick 1-click addition of Bodybond Glue if cart is empty
  const handleQuickAddGlue = (size: '20ml' | '30ml') => {
    const glue = PRODUCTS.find((p) => p.id === 'bodybond-glue') || PRODUCTS[0];
    addToCart(glue, 1, undefined, size);
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#F2D3E2] p-6 sm:p-8 shadow-xl text-center space-y-6">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#F2D3E2] text-[#FF2D8D] text-xs font-black uppercase tracking-wider">
              🎉 Order Successfully Placed!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E141D] uppercase tracking-tight">
              ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে
            </h1>
            <p className="text-xs sm:text-sm text-[#66465B] max-w-md mx-auto leading-relaxed">
              আমাদের কাস্টমার কেয়ার প্রতিনিধি শিগগিরই কল দিয়ে আপনার অর্ডারটি কনফার্ম করবেন।
            </p>
          </div>

          {/* Order Info Card */}
          <div className="p-4 bg-white rounded-2xl border border-[#F2D3E2] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#F2D3E2] pb-2.5">
              <span className="font-bold text-[#7A5E70]">Order ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[#FF2D8D] tracking-wider text-sm">{orderNumber}</span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1 rounded bg-white border border-[#F2D3E2] text-[#1E141D] hover:text-[#FF2D8D] cursor-pointer"
                  title="Copy ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5E70]">Customer Name:</span>
              <span className="font-bold text-[#1E141D]">{fullName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5E70]">Mobile Number:</span>
              <span className="font-bold text-[#1E141D]">{phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5E70]">Delivery Address:</span>
              <span className="font-bold text-[#1E141D] truncate max-w-[200px]">{address}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5E70]">Payment Method:</span>
              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F2D3E2]">
              <span className="font-extrabold text-[#1E141D]">Total Amount:</span>
              <span className="font-black text-base text-[#FF2D8D]">৳{totalBDT.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openTrackingModal()}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FF2D8D] hover:bg-[#E61B78] text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Live (লাইভ ট্র্যাক করুন)</span>
            </button>

            <a
              href={`https://wa.me/${announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979'}?text=${encodeURIComponent(`Hello Bodybond, I just placed order ${orderNumber || ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Support (হোয়াটসঅ্যাপ সহায়তা)</span>
            </a>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full py-3 px-6 rounded-2xl bg-white border border-[#F2D3E2] hover:bg-white text-[#1E141D] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continue Shopping (আরও কেনাকাটা করুন)</span>
              <ChevronRight className="w-4 h-4 text-[#FF2D8D]" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Breadcrumb */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#66465B] hover:text-[#FF2D8D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-[#1E141D]">
          <ShoppingBag className="w-4 h-4 text-[#FF2D8D]" />
          <span className="uppercase tracking-wider">Full Order & Checkout Page</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Customer Information & Delivery Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl border border-[#F2D3E2] p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="border-b border-[#F2D3E2] pb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E141D] uppercase tracking-tight flex items-center gap-2">
                  <User className="w-6 h-6 text-[#FF2D8D]" />
                  <span>গ্রাহক তথ্য ও ডেলিভারি ফর্ম</span>
                </h1>
                <p className="text-xs text-[#7A5E70] mt-1">
                  ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে ফর্মটি পূরণ করুন।
                </p>
              </div>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 animate-bounce">
                <span className="text-base leading-none">⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmOrder} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E141D] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>আপনার নাম (Full Name) <span className="text-[#FF2D8D]">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="যেমন: নুসরাত জাহান"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#F2D3E2] text-sm text-[#1E141D] placeholder:text-[#A38698] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D8D] focus:border-transparent transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E141D] uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>মোবাইল নম্বর (Phone Number) <span className="text-[#FF2D8D]">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01712345678"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#F2D3E2] text-sm text-[#1E141D] placeholder:text-[#A38698] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D8D] focus:border-transparent transition-all"
                />
              </div>

              {/* Delivery Area Toggle */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-[#1E141D] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>ডেলিভারি এলাকা নির্বাচন করুন <span className="text-[#FF2D8D]">*</span></span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      deliveryArea === 'dhaka'
                        ? 'border-[#FF2D8D] bg-white ring-2 ring-[#FF2D8D]/30'
                        : 'border-[#F2D3E2] bg-white hover:bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-xs text-[#1E141D] block">ঢাকা সিটির ভেতরে</span>
                      <span className="text-[10px] text-[#7A5E70]">24-48 Business Hours</span>
                    </div>
                    <span className="font-black text-xs text-[#FF2D8D]">৳{announcement?.insideDhakaFeeBDT ?? 60}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      deliveryArea === 'outside'
                        ? 'border-[#FF2D8D] bg-white ring-2 ring-[#FF2D8D]/30'
                        : 'border-[#F2D3E2] bg-white hover:bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-xs text-[#1E141D] block">ঢাকার বাইরে (সারাদেশ)</span>
                      <span className="text-[10px] text-[#7A5E70]">2-4 Business Days</span>
                    </div>
                    <span className="font-black text-xs text-[#FF2D8D]">৳{announcement?.outsideDhakaFeeBDT ?? 120}</span>
                  </button>
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E141D] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>সম্পূর্ণ ডেলিভারি ঠিকানা (Full Address) <span className="text-[#FF2D8D]">*</span></span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: বাসা #৪৫, রোড #১২, ধানমন্ডি, ঢাকা"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#F2D3E2] text-sm text-[#1E141D] placeholder:text-[#A38698] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D8D] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Order Notes (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#66465B] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#7A5E70]" />
                  <span>বিশেষ নির্দেশনা / নোট (Optional)</span>
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="যেমন: ডেলিভারির আগে কল করবেন"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#F2D3E2] text-xs text-[#1E141D] placeholder:text-[#A38698] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D8D] focus:border-transparent transition-all"
                />
              </div>

              {/* Payment Method Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-extrabold text-xs text-emerald-900 block uppercase">
                    পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (COD)
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পণ্য হাতে পেয়ে ডেলিভারিম্যানকে টাকা পরিশোধ করবেন।
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className={`w-full py-4 px-6 rounded-2xl text-base font-black tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting || cart.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-[#FF2D8D] hover:bg-[#E61B78] text-white shadow-[#FF2D8D]/30 active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <BadgeCheck className="w-5 h-5 text-white" />
                    <span>অর্ডার কনফার্ম করুন • ৳{totalBDT.toLocaleString()}</span>
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#F2D3E2] space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#FF2D8D] mx-auto" />
              <span className="font-extrabold text-[11px] text-[#1E141D] block uppercase">100% Original</span>
              <span className="text-[9px] text-[#7A5E70] block">Authentic Formula</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#F2D3E2] space-y-1">
              <Truck className="w-5 h-5 text-[#FF2D8D] mx-auto" />
              <span className="font-extrabold text-[11px] text-[#1E141D] block uppercase">Fast Delivery</span>
              <span className="text-[9px] text-[#7A5E70] block">Nationwide COD</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#F2D3E2] space-y-1">
              <BadgeCheck className="w-5 h-5 text-[#FF2D8D] mx-auto" />
              <span className="font-extrabold text-[11px] text-[#1E141D] block uppercase">Easy Return</span>
              <span className="text-[9px] text-[#7A5E70] block">7 Days Support</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary & Cart Items */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-[#F2D3E2] p-6 shadow-sm space-y-5 sticky top-24">
            
            <div className="border-b border-[#F2D3E2] pb-3 flex items-center justify-between">
              <h2 className="font-black text-base text-[#1E141D] uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF2D8D]" />
                <span>অর্ডার সামারি (Order Items)</span>
              </h2>
              <span className="text-xs font-bold text-[#FF2D8D] bg-white border border-[#F2D3E2] px-2.5 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-8 text-center space-y-4 bg-white rounded-2xl p-4 border border-dashed border-[#F2D3E2]">
                <ShoppingBag className="w-10 h-10 text-[#FF2D8D] mx-auto opacity-50" />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-[#1E141D] block">আপনার ব্যাগ ফাঁকা আছে!</span>
                  <p className="text-xs text-[#7A5E70]">
                    অর্ডার করতে নিচে ক্লিক করে সহজে Bodybond Glue ব্যাগ-এ যুক্ত করুন:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => handleQuickAddGlue('20ml')}
                    className="flex-1 py-2.5 px-3 bg-[#FF2D8D] hover:bg-[#D91B74] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    + Bodybond Glue (20ml) • ৳1,250
                  </button>
                  <button
                    onClick={() => handleQuickAddGlue('30ml')}
                    className="flex-1 py-2.5 px-3 bg-[#1E141D] hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    + Bodybond Glue (30ml) • ৳1,350
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-2xl border border-[#F2D3E2] flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-[#F2D3E2] flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-[#1E141D] truncate">{item.name}</h4>
                      {item.selectedSize && (
                        <span className="text-[10px] text-[#7A5E70] block">Size: {item.selectedSize}</span>
                      )}
                      <span className="font-black text-xs text-[#FF2D8D] block mt-0.5">
                        {formatPrice(item.priceNZD)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white border border-[#F2D3E2] rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[#FF2D8D] cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[#FF2D8D] cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-[#F2D3E2] space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#7A5E70] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="কুপন কোড (WELCOME10 / BODY10)"
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#F2D3E2] rounded-xl text-xs uppercase font-bold text-[#1E141D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF2D8D]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#1E141D] hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <p className={`text-[11px] font-bold ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponMsg.text}
                </p>
              )}

              {discountCode && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-800">Coupon Code Applied: {discountCode}</span>
                  <button onClick={removeDiscountCode} className="text-rose-600 font-bold text-[10px] hover:underline cursor-pointer">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="pt-3 border-t border-[#F2D3E2] space-y-2 text-xs">
              <div className="flex justify-between text-[#66465B]">
                <span>পণ্য সমূহের মূল্য (Subtotal):</span>
                <span className="font-bold text-[#1E141D]">৳{subtotalBDT.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-[#66465B]">
                <span>ডেলিভারি চার্জ ({deliveryArea === 'dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}):</span>
                <span className="font-bold text-[#1E141D]">৳{deliveryFeeBDT}</span>
              </div>

              {discountAmountBDT > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>কুপন ডিসকাউন্ট:</span>
                  <span>-৳{discountAmountBDT.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-[#F2D3E2] text-sm">
                <span className="font-black text-[#1E141D]">সর্বমোট (Total Payable):</span>
                <span className="font-black text-lg text-[#FF2D8D]">৳{totalBDT.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
