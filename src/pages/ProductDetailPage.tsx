import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Volume2, 
  VolumeX, 
  X, 
  Filter, 
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  MessageCircle,
  BadgeCheck,
  MapPin,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, NIP_SHADES } from '../data/products';
import { OfferCountdownCard } from '../components/OfferCountdownCard';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useMedia } from '../context/MediaContext';
import { useOrders } from '../context/OrderContext';
import { VideoReelItem } from '../types';
import { UniversalVideoPlayer } from '../components/UniversalVideoPlayer';
import { SloganMarquee } from '../components/MarqueeTicker';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onSelectProduct
}) => {
  const { addToCart, formatPrice, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { language, t } = useLanguage();
  const { announcement } = useOrders();
  const { 
    galleryImages: glueGalleryImages, 
    nipsImages, 
    videoReels, 
    confidenceSlides, 
    autoPlayVideos, 
    openAdmin 
  } = useMedia();

  // Find product or fallback to Bodybond Glue (in-stock only)
  const product = PRODUCTS.find((p) => (p.id === productId || p.slug === productId) && p.inStock !== false) || PRODUCTS[0];
  const activeProductGallery = (product.category === 'nips' || product.id.includes('nips')) && nipsImages?.length > 0 
    ? nipsImages 
    : glueGalleryImages;

  // State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseTier, setPurchaseTier] = useState<'1x' | '2x'>('1x');
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [activeConfidenceSlide, setActiveConfidenceSlide] = useState(0);
  const [activeVideoModal, setActiveVideoModal] = useState<VideoReelItem | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewSuccess, setNewReviewSuccess] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Dynamic pricing based on selected variant tier:
  // 1x = 20ml (৳1250, regular ৳1650)
  // 2x = 30ml (৳1350, regular ৳1850)
  const currentPriceBDT = purchaseTier === '1x' ? 1250 : 1350;
  const currentCompareAtBDT = purchaseTier === '1x' ? 1650 : 1850;
  const currentSizeLabel = purchaseTier === '1x' ? '20ml' : '30ml';

  // Authentic Bangladeshi customer reviews
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      name: 'Nusrat Jahan (Dhanmondi, Dhaka)',
      verified: true,
      date: '02/09/2026',
      rating: 5,
      comment: 'Biye barite heavy silk saree ar deep back blouse porar jonno niyechilam. Ekdom perfect hold koreche, pin diye saree noshto korte hoy ni. Gorom ar ghameo khule jaay ni! Honestly shob meyetader closet e eta thaka dorkar.',
    },
    {
      id: 'rev-2',
      name: 'Tashfia Nawar (Gulshan, Dhaka)',
      verified: true,
      date: '29/08/2026',
      rating: 5,
      comment: 'Wedding gown er plunging neckline ar off-shoulder tops er jonno best solution. Age fashion tape use kortam ghame khule jeto, but Bodybond 7-8 ghanta nonstop hold koreche. Kushum gorom pani diye wash korlei shundor moto uthe jaay, skin e kono rash ba dag hoy na.',
    },
    {
      id: 'rev-3',
      name: 'Farhana Rahman (Panchlaish, Ctg)',
      verified: true,
      date: '24/08/2026',
      rating: 5,
      comment: 'Georgette dupatta shob shomoy kaadh theke slip kore pore jeto. Safety pin lagale expensive kapore futo hoye jaay. Eitar matro 2-3 drops diye stick korechi, pura din ekdom jayga moto chilo. Chittagong e 2 dine Cash on Delivery te parcel peyechi!',
    },
    {
      id: 'rev-4',
      name: 'Samira Huq (Uttara, Dhaka)',
      verified: true,
      date: '18/08/2026',
      rating: 5,
      comment: 'Amar skin onk sensitive tai prothome voy lagchilo allergy hobe kina. But eta use kore kono irritation ba itching hoyni. Cotton theke shuru kore silk shob fabricei shundor kaj kore. 20ml bottle ta portable, bag e shohoje carry kora jaay.',
    },
    {
      id: 'rev-5',
      name: 'Anika Tabassum (Banani, Dhaka)',
      verified: true,
      date: '14/08/2026',
      rating: 5,
      comment: 'Holud er program e heavy dance korechi, ek fota-o loose hoy ni. Eto sweat resistant hobe bhabte parini! 30ml offer ta niyechi, price onujayi full worth it. Delivery rider o khub bhalo chilo.',
    },
    {
      id: 'rev-6',
      name: 'Sharmin Sultana (Zindabazar, Sylhet)',
      verified: true,
      date: '08/08/2026',
      rating: 5,
      comment: 'Original product peyechi. Kurti ar saree blouse e safe styling er jonno ultimate product. Kapor nosto hoy na ar remove korao khub easy. Highly recommend to all Bangladeshi girls!',
    }
  ]);

  // Reset scroll and state when navigating
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product, 1, undefined, currentSizeLabel);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
    setIsCartOpen(true);
  };

  const handleOrderNowCOD = () => {
    addToCart(product, 1, undefined, currentSizeLabel);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      name: newReviewAuthor,
      verified: true,
      date: 'Today',
      rating: newReviewRating,
      comment: newReviewText,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewSuccess(true);
    setTimeout(() => {
      setWriteReviewOpen(false);
      setNewReviewSuccess(false);
      setNewReviewAuthor('');
      setNewReviewText('');
    }, 1500);
  };

  return (
    <div className="bg-transparent text-[#1E141D] min-h-screen selection:bg-[#FF2D8D] selection:text-white pb-36 sm:pb-44 font-sans">

      {/* Main Product Container */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-3 space-y-6">

        {/* Live Stock & Authenticity Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#5E3F54]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Original Bodybond BD</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            In Stock (COD Available)
          </span>
        </div>

        {/* Top Slogan Marquee */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-[#F2D3E2]">
          <SloganMarquee 
            slogans={[
              'JUST BOND IT!',
              'ZERO SLIP',
              'STICK WITH CONFIDENCE',
              'SWEAT & DANCE PROOF',
              'NO WARDROBE MALFUNCTION',
              'JUST BOND IT!',
              '100% INVISIBLE FORMULA',
              'LOOK HOT • STAY COVERED',
            ]} 
            speed="normal"
          />
        </div>

        {/* 1. Main Product Showcase Stage */}
        <div className="space-y-3">
          
          {/* Main Visual */}
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#F2D3E2] shadow-md">
            <img
              src={activeProductGallery[activeImageIndex]?.src || activeProductGallery[0]?.src}
              alt={activeProductGallery[activeImageIndex]?.caption || product.name}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Image Counter Pill */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1E141D] border border-[#F2D3E2] shadow-sm">
              {activeImageIndex + 1} / {activeProductGallery.length}
            </div>
          </div>

          {/* 6 Thumbnail Strip */}
          <div className="grid grid-cols-6 gap-2">
            {activeProductGallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                  activeImageIndex === idx
                    ? 'border-[#FF2D8D] ring-2 ring-[#FF2D8D]/30 scale-95'
                    : 'border-[#F2D3E2] opacity-75 hover:opacity-100'
                }`}
              >
                <img 
                  src={img.src} 
                  alt={img.caption} 
                  referrerPolicy="no-referrer" 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>

        </div>

        {/* 2. Full-Width Soft Hot Pink Banner */}
        <div className="w-full bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] text-white py-3 px-4 text-center rounded-xl shadow-md shadow-[#FF2D8D]/20 border border-white/20">
          <span className="font-black text-sm sm:text-base tracking-[0.15em] uppercase">
            BANGLADESH’S #1 BODY ADHESIVE GLUE
          </span>
        </div>

        {/* 3. Product Title, Dynamic Price & Key Value Bullets */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-black text-[#1E141D] tracking-tight">
              Bodybond Glue
            </h1>
            <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-[#FFEBF3] text-[#FF2D8D] border border-[#F2D3E2]">
              {currentSizeLabel} Selected
            </span>
          </div>

          {/* Dynamic Active Price Tag */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-3xl sm:text-4xl font-black text-[#FF2D8D]">
              {formatPrice(currentPriceBDT)}
            </span>
            <span className="text-base sm:text-lg text-[#9E8294] line-through">
              {formatPrice(currentCompareAtBDT)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white shadow-sm">
              {purchaseTier === '1x' ? 'SAVE ৳400' : 'BEST SAVINGS • SAVE ৳500'}
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-medium text-[#5E3F54] pt-1">
            <div className="flex items-center gap-2.5">
              <span className="text-base">👚</span>
              <span>Strong Hold & Sweat Resistant</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base">💃</span>
              <span>No Stains. No Damage. Just Hold.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base">💖</span>
              <span>Gentle on Skin, Loved by 2,000+ Women</span>
            </div>
          </div>
        </div>

        {/* 4. Shipping & Nationwide COD Notice */}
        <div className="flex items-center justify-center gap-3 py-1 text-xs text-[#66465B]">
          <span className="h-px bg-[#F2D3E2] flex-1" />
          <span className="font-semibold tracking-wide flex items-center gap-1.5 text-[#5E3F54]">
            <Truck className="w-3.5 h-3.5 text-[#FF2D8D]" />
            <span>Fast Nationwide Home Delivery • Pay Cash on Delivery</span>
          </span>
          <span className="h-px bg-[#F2D3E2] flex-1" />
        </div>

        {/* 5. Interactive Purchase Tier Cards */}
        <div className="space-y-3">
          
          {/* Tier 1: 20ml Tube */}
          <div
            onClick={() => setPurchaseTier('1x')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
              purchaseTier === '1x'
                ? 'border-[#FF2D8D] bg-[#FFEBF3] ring-1 ring-[#FF2D8D]'
                : 'border-[#F2D3E2] bg-white hover:border-[#FF2D8D]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  purchaseTier === '1x'
                    ? 'border-[#FF2D8D] bg-[#FF2D8D]'
                    : 'border-[#CCA3B8]'
                }`}
              >
                {purchaseTier === '1x' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-[#1E141D] block">
                  20ml Tube
                </span>
                <span className="text-[10px] text-[#7A5E70]">Standard Pack</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-black text-sm sm:text-base text-[#FF2D8D] block">
                {formatPrice(1250)}
              </span>
              <span className="text-[10px] text-[#9E8294] line-through">
                {formatPrice(1650)}
              </span>
            </div>
          </div>

          {/* Tier 2: 30ml Tube (Super Saver) */}
          <div
            onClick={() => setPurchaseTier('2x')}
            className={`rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-sm ${
              purchaseTier === '2x'
                ? 'border-[#FF2D8D] bg-[#FFEBF3] ring-1 ring-[#FF2D8D]'
                : 'border-[#F2D3E2] bg-white hover:border-[#FF2D8D]/50'
            }`}
          >
            <div className="p-4 flex items-center justify-between relative">
              
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    purchaseTier === '2x'
                      ? 'border-[#FF2D8D] bg-[#FF2D8D]'
                      : 'border-[#CCA3B8]'
                  }`}
                >
                  {purchaseTier === '2x' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-[#1E141D] block">
                    30ml Tube <span className="text-xs text-[#FF2D8D] font-bold">(Super Saver)</span>
                  </span>
                  <span className="text-[10px] text-[#7A5E70]">Max Hold Double Size</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1 shadow-sm">
                  Best Offer
                </span>
                <span className="font-black text-sm sm:text-base text-[#FF2D8D]">
                  {formatPrice(1350)}
                </span>
                <span className="text-[10px] text-[#9E8294] line-through">
                  {formatPrice(1850)}
                </span>
              </div>
            </div>

            {/* Bottom Special ribbon */}
            <div className="bg-[#FFDEEC] text-[#D91B74] py-2 px-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider border-t border-[#F2D3E2]">
              <span>🎉 Special Promo: 30ml Double Value Pack</span>
            </div>
          </div>

        </div>

        {/* 6. Loved by 2000+ Women Divider */}
        <div className="flex items-center justify-center gap-3 py-1 text-xs text-[#7A5E70]">
          <span className="h-px bg-[#F2D3E2] flex-1" />
          <span className="font-extrabold text-[11px] tracking-wider uppercase text-[#7A5E70]">LOVED BY 2000+ WOMEN</span>
          <span className="h-px bg-[#F2D3E2] flex-1" />
        </div>

        {/* 7. Action Buttons */}
        <div className="space-y-3 pt-1">
          {product.inStock !== false ? (
            <>
              {/* Primary: Order Now (Cash on Delivery) */}
              <button
                onClick={handleOrderNowCOD}
                className="w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-black tracking-wider uppercase bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white transition-all shadow-xl shadow-[#FF2D8D]/25 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <BadgeCheck className="w-5 h-5 text-white" />
                <span>{t.orderNowCOD} ({currentSizeLabel} • {formatPrice(currentPriceBDT)})</span>
              </button>

              {/* Secondary: Add To Cart */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 border ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white hover:bg-[#FFEBF3] text-[#1E141D] border-[#F2D3E2]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added To Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#FF2D8D]" />
                    <span>{t.addToCart} • {formatPrice(currentPriceBDT)}</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp Order */}
              <button
                type="button"
                onClick={() => {
                  const msg = `Hello Bodybond! I want to order ${product.name} (${currentSizeLabel} at ${formatPrice(currentPriceBDT)}) via Cash on Delivery.`;
                  const waPhone = announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979';
                  window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold bg-[#E6F9EE] hover:bg-[#D1F4DE] text-[#1D9E4E] border border-[#25D366]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.whatsappOrderBtn}</span>
              </button>

              {/* Exact Offer Countdown Card (Matching user reference screenshot) */}
              <OfferCountdownCard className="mt-3.5" />
            </>
          ) : (
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-black tracking-widest uppercase bg-[#F5EDF1] border border-[#E8D4DF] text-[#9E8294] cursor-not-allowed"
              >
                {t.outOfStockBadge}
              </button>
              <p className="text-center text-xs text-[#FF2D8D] font-bold">
                ⚠️ This item is currently sold out. Check back soon for restock!
              </p>
            </div>
          )}

          {/* 100% Cash on Delivery & Money Back Guaranteed Box */}
          <div className="bg-white border border-[#F2D3E2] text-center py-3 px-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-[#FF2D8D] block">
              🛡️ {t.cashOnDelivery}
            </span>
            <span className="text-[11px] text-[#5E3F54] block">
              2-3 Days Fast Delivery Nationwide • 100% Authentic Quality
            </span>
          </div>

          {/* Quick Guide Navigation Links */}
          <div className="pt-4 border-t border-[#F2D3E2]">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => onNavigate('where-to-use')}
                className="p-3 bg-white hover:bg-[#FFEBF3] border border-[#F2D3E2] hover:border-[#FF2D8D] rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-sm"
              >
                <MapPin className="w-5 h-5 text-[#FF2D8D] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] sm:text-xs font-black text-[#1E141D] uppercase tracking-wider">WHERE TO USE</span>
                <span className="text-[10px] text-[#FF2D8D] font-extrabold">কোথায় ব্যবহার করবেন</span>
              </button>

              <button
                onClick={() => onNavigate('how-to-use')}
                className="p-3 bg-white hover:bg-[#FFEBF3] border border-[#F2D3E2] hover:border-[#FF2D8D] rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-sm"
              >
                <Sparkles className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] sm:text-xs font-black text-[#1E141D] uppercase tracking-wider">HOW TO USE</span>
                <span className="text-[10px] text-emerald-600 font-extrabold">কীভাবে ব্যবহার করবেন</span>
              </button>

              <button
                onClick={() => onNavigate('how-to-remove')}
                className="p-3 bg-white hover:bg-[#FFEBF3] border border-[#F2D3E2] hover:border-[#FF2D8D] rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] sm:text-xs font-black text-[#1E141D] uppercase tracking-wider">HOW TO REMOVE</span>
                <span className="text-[10px] text-cyan-600 font-extrabold">কীভাবে তুলবেন</span>
              </button>
            </div>
          </div>

          {/* Collapsible Accordions: Ingredients & FAQs */}
          <div className="space-y-2 pt-2">
            
            {/* Ingredients Accordion */}
            <div className="border border-[#F2D3E2] bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                className="w-full p-4 flex items-center justify-between text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E141D] hover:text-[#FF2D8D] transition-colors"
              >
                <span>INGREDIENTS LIST</span>
                {isIngredientsOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#FF2D8D]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#7A5E70]" />
                )}
              </button>
              
              {isIngredientsOpen && (
                <div className="px-4 pb-4 text-xs text-[#5E3F54] space-y-2 border-t border-[#F2D3E2] pt-3">
                  <p className="leading-relaxed text-[#1E141D] font-medium">
                    100% Hypoallergenic, dermatologist approved & gentle on delicate fabrics:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-[#5E3F54]">
                    <li>Deionized Aqua (Purified Base)</li>
                    <li>Plant-Derived Glycerin (Skin hydration & smoothness)</li>
                    <li>Organic Aloe Barbadensis Leaf Juice (Soothing & calming)</li>
                    <li>Hyaluronic Acid (Moisture-retaining barrier protection)</li>
                    <li>Provitamin B5 (Panthenol skin nourish)</li>
                    <li>VP/VA Medical-Grade Copolymer (Flexible 12+ hr water-soluble bond)</li>
                  </ul>
                  <p className="text-[11px] text-[#7A5E70] pt-1">
                    Free from latex, harsh acrylates, parabens, synthetic fragrances, and gluten.
                  </p>
                </div>
              )}
            </div>

            {/* FAQs Accordion */}
            <div className="border border-[#F2D3E2] bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setIsFaqOpen(!isFaqOpen)}
                className="w-full p-4 flex items-center justify-between text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E141D] hover:text-[#FF2D8D] transition-colors"
              >
                <span>FAQS</span>
                {isFaqOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#FF2D8D]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#7A5E70]" />
                )}
              </button>

              {isFaqOpen && (
                <div className="px-4 pb-4 text-xs text-[#5E3F54] space-y-3 border-t border-[#F2D3E2] pt-3">
                  <div>
                    <span className="font-bold text-[#1E141D] block">How do I wash it out of clothes?</span>
                    <p className="text-[#5E3F54] mt-0.5">Simply rinse fabric in warm water or toss into regular gentle machine wash. Bodybond dissolves 100% without leaving greasy marks or residue on silk, satin, linen, or denim.</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E141D] block">How long does the hold last?</span>
                    <p className="text-[#5E3F54] mt-0.5">Up to 12+ hours through high heat, club dancing, and sweat. When ready to remove, gently peel or wash with warm water and soap.</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E141D] block">Can I use it on sensitive skin?</span>
                    <p className="text-[#5E3F54] mt-0.5">Yes! Unlike painful medical tape that strips your skin layers, Bodybond is enriched with aloe and hyaluronic acid to peel off smoothly with zero redness.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 8. Model Confidence Carousel */}
        <div className="space-y-4 pt-4 border-t border-[#F2D3E2]">
          
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#F2D3E2] shadow-md">
            <img
              src={confidenceSlides[activeConfidenceSlide].img}
              alt="Bodybond Confidence"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />

            {/* Carousel Arrows */}
            <button
              onClick={() => setActiveConfidenceSlide(activeConfidenceSlide === 0 ? confidenceSlides.length - 1 : activeConfidenceSlide - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FF2D8D] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
            </button>

            <button
              onClick={() => setActiveConfidenceSlide(activeConfidenceSlide === confidenceSlides.length - 1 ? 0 : activeConfidenceSlide + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FF2D8D] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 translate-x-0.5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1E141D]">
              {confidenceSlides[activeConfidenceSlide].title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5E3F54] leading-relaxed">
              {confidenceSlides[activeConfidenceSlide].desc}
            </p>
          </div>
        </div>

        {/* 9. Hot Pink Scrolling Banner: NO MORE */}
        <div className="bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] text-white py-4 rounded-2xl overflow-hidden shadow-md space-y-2 border border-white/20">
          <h4 className="font-black text-xl tracking-widest uppercase text-center">NO MORE</h4>
          <div className="overflow-hidden w-full relative">
            <div className="animate-marquee-fast flex items-center gap-4 text-xs sm:text-sm font-black tracking-wider uppercase whitespace-nowrap">
              <span className="flex items-center gap-4">
                <span>SLIPPING</span>
                <span>•</span>
                <span>STAINS</span>
                <span>•</span>
                <span>DISCOMFORT</span>
                <span>•</span>
                <span>FLASHING</span>
                <span>•</span>
                <span>ROLL DOWNS</span>
                <span>•</span>
                <span>WARDROBE ACCIDENTS</span>
                <span>•</span>
              </span>
              <span className="flex items-center gap-4">
                <span>SLIPPING</span>
                <span>•</span>
                <span>STAINS</span>
                <span>•</span>
                <span>DISCOMFORT</span>
                <span>•</span>
                <span>FLASHING</span>
                <span>•</span>
                <span>ROLL DOWNS</span>
                <span>•</span>
                <span>WARDROBE ACCIDENTS</span>
                <span>•</span>
              </span>
            </div>
          </div>
        </div>

        {/* 10. Customer Reviews Section */}
        <div className="space-y-4 pt-4 border-t border-[#F2D3E2]">
          
          {/* Reviews Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-black text-sm text-[#1E141D]">82 Reviews ⌵</span>
            </div>

            <button className="p-2 text-[#7A5E70] hover:text-[#1E141D] border border-[#F2D3E2] rounded-xl bg-white shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Write a Review Button */}
          <button
            onClick={() => setWriteReviewOpen(!writeReviewOpen)}
            className="w-full py-3 px-4 rounded-2xl border border-[#F2D3E2] bg-white hover:bg-[#FFEBF3] text-xs font-bold uppercase tracking-wider text-[#1E141D] transition-all cursor-pointer text-center shadow-sm"
          >
            Write a review
          </button>

          {/* Write a Review Modal/Drawer */}
          {writeReviewOpen && (
            <form onSubmit={handleReviewSubmit} className="p-4 bg-white rounded-2xl border border-[#F2D3E2] space-y-3 shadow-md">
              <span className="font-bold text-xs uppercase tracking-wider text-[#FF2D8D] block">
                Share Your Bodybond Experience
              </span>

              {newReviewSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your verified review has been published.</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] text-[#5E3F54] block mb-1">Your Name & Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samira Ahmed (Dhanmondi, Dhaka)"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFFDFE] border border-[#F2D3E2] rounded-xl text-xs text-[#1E141D] focus:outline-none focus:border-[#FF2D8D]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#5E3F54] block mb-1">Star Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewReviewRating(s)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${s <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#5E3F54] block mb-1">Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share how Bodybond held your saree blouse, lehenga or party dress..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFFDFE] border border-[#F2D3E2] rounded-xl text-xs text-[#1E141D] focus:outline-none focus:border-[#FF2D8D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#FF2D8D] hover:bg-[#D91B74] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md"
                  >
                    Submit Review
                  </button>
                </>
              )}
            </form>
          )}

          {/* Review Cards List */}
          <div className="space-y-3">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#F2D3E2] hover:border-[#FF2D8D]/40 transition-colors rounded-2xl p-4 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-[#1E141D]">{rev.name}</span>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#9E8294] flex-shrink-0">{rev.date}</span>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-[13px] text-[#5E3F54] leading-relaxed pt-0.5">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 11. Sticky Floating Bottom Order Bar */}
      <div className="fixed bottom-[28px] sm:bottom-[32px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#F2D3E2] p-2.5 sm:p-3 shadow-xl">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          {product.inStock !== false ? (
            <>
              <button
                onClick={handleOrderNowCOD}
                className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white shadow-lg shadow-[#FF2D8D]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <BadgeCheck className="w-4 h-4 text-white" />
                <span>{t.orderNowCOD} ({currentSizeLabel} • {formatPrice(currentPriceBDT)})</span>
              </button>
              
              <button
                onClick={handleAddToCart}
                className="p-3 rounded-xl bg-[#FFEBF3] hover:bg-[#FFD6E8] border border-[#F2D3E2] text-[#FF2D8D] shadow-sm transition-all cursor-pointer flex items-center justify-center"
                aria-label="Add to cart"
                title={t.addToCart}
              >
                <ShoppingBag className="w-5 h-5 text-[#FF2D8D]" />
              </button>
            </>
          ) : (
            <button
              disabled
              className="flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-black tracking-widest uppercase bg-[#F5EDF1] border border-[#E8D4DF] text-[#9E8294] shadow-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{t.outOfStockBadge}</span>
            </button>
          )}
        </div>
      </div>

      {/* Video Reel Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-[#381B30] shadow-2xl">
            
            {/* Fallback image */}
            <img
              src={activeVideoModal.poster}
              alt={activeVideoModal.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 w-full h-full">
              <UniversalVideoPlayer
                videoUrl={activeVideoModal.videoUrl}
                poster={activeVideoModal.poster}
                autoPlay={true}
                loop={true}
                controls={true}
                muted={isVideoMuted}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Top controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="bg-[#FF2D8D] text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                {activeVideoModal.badge}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="p-2 rounded-full bg-black/60 text-white border border-white/20 hover:bg-black"
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFA6D5]" />}
                </button>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-2 rounded-full bg-black/60 text-white border border-white/20 hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Caption & Instant Add Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
              <div>
                <span className="font-extrabold text-xs text-[#FFA6D5]">{activeVideoModal.author}</span>
                <p className="text-xs text-white leading-tight mt-0.5">{activeVideoModal.description}</p>
              </div>

              <button
                onClick={() => {
                  addToCart(product, 1, undefined, currentSizeLabel);
                  setActiveVideoModal(null);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-[#FF2D8D]/30"
              >
                <span>Add Bodybond Glue ({currentSizeLabel}) • {formatPrice(currentPriceBDT)}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
