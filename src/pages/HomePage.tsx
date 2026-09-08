import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Check, 
  Sparkles,
  Instagram,
  Facebook,
  Heart,
  ShieldCheck,
  Droplets,
  Flame,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMedia } from '../context/MediaContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { OfferCountdownCard } from '../components/OfferCountdownCard';

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { addToCart, formatPrice, applyDiscountCode } = useCart();
  const { 
    heroBanner, 
    galleryImages, 
    nipsImages, 
    welcomeImage, 
    featuredGlueImage, 
    followUsImage
  } = useMedia();

  // Buy 1x or 2x selection state for the featured Bodybond Glue section
  const [selectedGlueOption, setSelectedGlueOption] = useState<'1x' | '2x'>('1x');
  const [isGlueAdded, setIsGlueAdded] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // The 2 main products in the MOST LOVED SELLERS section (Glue & Nip Covers)
  const glueProduct = PRODUCTS.find((p) => p.id === 'bodybond-glue') || PRODUCTS[0];
  const nipsSeamlessProduct = PRODUCTS.find((p) => p.id === 'bodybond-nips-seamless') || PRODUCTS[1];

  const mostLovedSellers: Array<Product & { displayName: string; customPrice: string; originalPrice?: string; customImg: string; badgeText: string | null; subText: string }> = [
    {
      ...glueProduct,
      displayName: 'Bodybond Glue (20ml)',
      customPrice: formatPrice(1250),
      originalPrice: formatPrice(1550),
      customImg: galleryImages[0]?.src || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      badgeText: 'Bestseller',
      subText: 'MAX HOLD • SWEAT RESISTANT',
      inStock: true
    },
    {
      ...nipsSeamlessProduct,
      displayName: 'Bodybond Nip Covers',
      customPrice: formatPrice(990),
      originalPrice: formatPrice(1200),
      customImg: nipsImages[0]?.src || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      badgeText: 'SOLD OUT',
      subText: 'LOOK HOT • STAY COVERED',
      inStock: false
    }
  ];

  const handleGlueAddToCart = () => {
    if (selectedGlueOption === '1x') {
      addToCart(glueProduct, 1, undefined, '20ml');
    } else {
      addToCart(glueProduct, 1, undefined, '30ml');
    }
    setIsGlueAdded(true);
    setTimeout(() => setIsGlueAdded(false), 2000);
  };

  const faqItems = [
    {
      q: 'WHAT IS BODYBOND?',
      a: 'Bodybond is BD’s viral pro-grade wardrobe adhesive and body essentials brand. Our signature liquid glue gently and invisibly bonds fabric directly to your skin, preventing plunging necklines, strapless tops, open backs, and high slits from moving or slipping all day and night. It is 100% skin safe, hypoallergenic, sweat-resistant, and rinses off completely with warm water without staining delicate fabrics.'
    },
    {
      q: 'DO YOU SHIP INTERNATIONALLY?',
      a: 'Yes! We ship worldwide. We offer Free Overnight Express Shipping across New Zealand and Australia on orders over $60 NZD, as well as fast DHL/Tracked international delivery worldwide.'
    },
    {
      q: 'HOW LONG DOES SHIPPING TAKE?',
      a: 'New Zealand orders placed before 2pm are dispatched same-day with overnight courier delivery (1-2 business days). Australia orders typically take 3-5 business days. International deliveries take approximately 5-9 business days depending on location.'
    },
    {
      q: 'ARE THERE SOCIAL MEDIA COLLAB OPPORTUNITIES WITH BODYBOND?',
      a: 'We are always looking to partner with creators, stylists, and fashion lovers who love our products! DM us on Instagram @bodybond or email us at collabs@bodybond.com with your portfolio and handles.'
    },
    {
      q: 'DO YOU OFFER WHOLESALE?',
      a: 'Yes, we supply boutiques, bridal ateliers, salon studios, and styling agencies. For wholesale pricing and stocking inquiries, contact wholesale@bodybond.com.'
    }
  ];

  return (
    <div className="bg-transparent text-[#1E141D] min-h-screen font-sans selection:bg-[#FF2D8D] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-black">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85"}
            alt="Girl holding Bodybond product"
            referrerPolicy="no-referrer"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center brightness-[0.75]"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6 pt-8 pb-12">
          {/* Main Display Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.95]"
          >
            SHOP &<br />
            <span className="text-white">SAVE TODAY!</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-white/95 uppercase"
          >
            No More Outfit Anxiety.
          </motion.p>

          {/* Action Button: Hot Pink Luxury Pill Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 sm:pt-4"
          >
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 sm:px-12 py-3.5 sm:py-4 bg-[#FF2D8D] hover:bg-[#E61B78] text-white font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer shadow-[#FF2D8D]/30 btn-press"
            >
              SHOP BODYBOND
            </button>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SOFT PINK BANNER 1 */}
      {/* ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#FF52A3] via-[#FF2D8D] to-[#E61974] py-3.5 px-4 text-center shadow-md">
        <p className="font-extrabold text-xs sm:text-sm tracking-[0.25em] text-white uppercase">
          BD’S #1 GIRL ESSENTIALS
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. WELCOME SECTION */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-10"
      >
        <div className="space-y-6">
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#FF2D8D] tracking-tight">
            Welcome to BODYBOND!
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#442E3F] leading-relaxed max-w-2xl mx-auto font-normal">
            Say goodbye to <strong className="font-bold text-[#1E141D]">wardrobe struggles</strong> and hello to{' '}
            <strong className="font-bold text-[#1E141D]">confidence</strong>. At BODYBOND, we create zero stress essentials
            that actually work. Just wearable, reliable,{' '}
            <strong className="font-bold text-[#1E141D]">hot all day solutions for the girls who get it.</strong>
          </p>

          <p className="font-bold text-sm sm:text-base text-[#1E141D] tracking-wide">
            Look Hot Stay Put @BODYBOND!
          </p>
        </div>

        {/* Studio photo of happy girls holding & testing Bodybond */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-[#F2D3E2] bg-white max-w-3xl mx-auto p-2 group">
          <img
            src={welcomeImage || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"}
            alt="Three happy friends with Bodybond essentials"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover rounded-xl max-h-[500px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 4. FEATURED INSTANT-BUY PRODUCT SECTION */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="space-y-8">
          
          {/* Main Visual */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-[#F2D3E2] shadow-xl">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
              <img
                src={featuredGlueImage || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"}
                alt="Bodybond Glue Application"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Graphic Callout Overlay */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 space-y-1">
                <span className="inline-block font-extrabold text-lg sm:text-2xl text-white tracking-wider uppercase drop-shadow-md">
                  MAX HOLD.
                </span>
                <span className="block text-xs sm:text-sm font-bold text-white/90 drop-shadow-md">
                  Beats Fashion Tape!
                </span>
              </div>

              {/* Pink Badges on image */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] sm:text-xs font-extrabold tracking-wide uppercase shadow-md">
                  HYPO-ALLERGENIC
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] sm:text-xs font-extrabold tracking-wide uppercase shadow-md">
                  SWEAT RESISTANT
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] sm:text-xs font-extrabold tracking-wide uppercase shadow-md">
                  PRECISION TOP
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] sm:text-xs font-extrabold tracking-wide uppercase shadow-md">
                  FABRIC SAFE
                </span>
              </div>
            </div>
          </div>

          {/* Title & Shipping line */}
          <div className="text-center space-y-2 pt-2">
            <h3 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1E141D] uppercase">
              Bodybond Glue
            </h3>
            <p className="text-xs sm:text-sm text-[#FF2D8D] font-bold tracking-wider">
              —— Free Cash On Delivery Across Bangladesh ——
            </p>
          </div>

          {/* Interactive Buy 20ml / 30ml Card Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Option 1: 20ml */}
            <div
              onClick={() => setSelectedGlueOption('1x')}
              className={`relative rounded-xl p-5 cursor-pointer transition-all border-2 bg-white flex items-center justify-between shadow-sm ${
                selectedGlueOption === '1x'
                  ? 'border-[#FF2D8D] bg-[#FFF8FA] shadow-[0_0_15px_rgba(255,45,141,0.15)]'
                  : 'border-[#F2D3E2] hover:border-[#FF2D8D]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedGlueOption === '1x'
                      ? 'border-[#FF2D8D] bg-[#FF2D8D]'
                      : 'border-[#D4BCC8]'
                  }`}
                >
                  {selectedGlueOption === '1x' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-bold text-sm sm:text-base text-[#1E141D] block">20ml Tube</span>
                  <span className="text-[11px] text-[#7A5E70]">Standard Pack</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-base sm:text-lg text-[#FF2D8D]">{formatPrice(1250)}</span>
              </div>
            </div>

            {/* Option 2: 30ml */}
            <div
              onClick={() => setSelectedGlueOption('2x')}
              className={`relative rounded-xl p-5 cursor-pointer transition-all border-2 bg-white overflow-hidden shadow-sm ${
                selectedGlueOption === '2x'
                  ? 'border-[#FF2D8D] bg-[#FFF8FA] shadow-[0_0_15px_rgba(255,45,141,0.15)]'
                  : 'border-[#F2D3E2] hover:border-[#FF2D8D]/40'
              }`}
            >
              {/* Best Offer Pink Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-bl-lg">
                Best Offer
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedGlueOption === '2x'
                        ? 'border-[#FF2D8D] bg-[#FF2D8D]'
                        : 'border-[#D4BCC8]'
                    }`}
                  >
                    {selectedGlueOption === '2x' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-[#1E141D] block">
                      30ml Tube <span className="text-[11px] text-[#FF2D8D] font-bold">(Super Saver)</span>
                    </span>
                    <span className="text-[11px] text-[#7A5E70]">Max Hold Double Size</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-base sm:text-lg text-[#FF2D8D]">{formatPrice(1350)}</span>
                </div>
              </div>

              {/* Bottom Ribbon */}
              <div className="mt-3 pt-2 border-t border-[#F4D8E5] flex items-center justify-between text-[11px] font-bold text-[#FF2D8D]">
                <span>🎁 Special Offer Applied</span>
                <span className="text-[#6E4F63]">Save {formatPrice(500)}</span>
              </div>
            </div>

          </div>

          {/* Social Proof Line */}
          <p className="text-center text-xs font-bold tracking-widest text-[#7A5E70] uppercase pt-2">
            —— LOVED BY 2000+ WOMEN ——
          </p>

          {/* Big Add to Cart Button */}
          <div className="space-y-3">
            <button
              onClick={handleGlueAddToCart}
              className="w-full py-4 bg-gradient-to-r from-[#FF65AC] via-[#FF2D8D] to-[#D91B74] hover:opacity-95 text-white font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase rounded-xl transition-all shadow-xl shadow-[#FF2D8D]/25 cursor-pointer flex items-center justify-center gap-2 btn-press"
            >
              {isGlueAdded ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>ADDED TO BAG!</span>
                </>
              ) : (
                <span>ADD TO CART</span>
              )}
            </button>

            {/* Exact Offer Countdown Card like reference screenshot */}
            <OfferCountdownCard className="mt-3" />

            <div className="text-center pt-1">
              <button
                onClick={() => onNavigate('product-detail', 'bodybond-glue')}
                className="text-xs sm:text-sm font-bold text-[#1E141D] hover:text-[#FF2D8D] underline underline-offset-4 transition-colors cursor-pointer"
              >
                View full details →
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 5. MOST LOVED SELLERS SECTION */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F2D3E2]"
      >
        <div className="space-y-10">
          
          <h2 className="font-extrabold text-3xl sm:text-4xl text-center text-[#1E141D] uppercase tracking-tight">
            MOST LOVED SELLERS
          </h2>

          {/* 2-Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6 sm:gap-8">
            {mostLovedSellers.map((item) => {
              const isSoldOut = item.inStock === false;
              return (
                <div
                  key={item.id}
                  onClick={() => !isSoldOut && onNavigate('product-detail', item.id)}
                  className={`group card-interactive flex flex-col space-y-3 bg-white rounded-2xl overflow-hidden border p-3 sm:p-4 transition-all shadow-sm ${
                    isSoldOut 
                      ? 'border-[#F2D3E2] opacity-80 cursor-not-allowed select-none' 
                      : 'border-[#F2D3E2] hover:border-[#FF2D8D] hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {/* Image Frame with Badge */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FFF5F8]">
                    <img
                      src={item.customImg}
                      alt={item.displayName}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {item.badgeText && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF65AC] to-[#FF2D8D] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-md">
                        {item.badgeText}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1 text-center">
                    <h3 className="font-bold text-xs sm:text-sm text-[#1E141D] group-hover:text-[#FF2D8D] transition-colors leading-tight">
                      {item.displayName}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                      <span className="text-[#1E141D] font-bold">{item.customPrice}</span>
                      {item.originalPrice && (
                        <span className="text-[#9E8294] line-through text-[11px]">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Add on Hover / Mobile Button */}
                  {item.inStock !== false ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="w-full py-2.5 bg-[#FFEBF3] hover:bg-[#FF2D8D] hover:text-white text-[#FF2D8D] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-colors mt-auto cursor-pointer shadow-sm btn-press"
                    >
                      Quick Add
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 bg-[#F5EDF1] text-[#9E8294] text-[11px] font-extrabold uppercase tracking-wider rounded-xl mt-auto cursor-not-allowed border border-[#E8D4DF]"
                    >
                      SOLD OUT
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* View all link */}
          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs sm:text-sm font-bold text-[#1E141D] hover:text-[#FF2D8D] underline underline-offset-4 transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 6. FOLLOW US FOR MORE! */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 overflow-hidden bg-black flex items-center justify-center border-t border-[#F2D3E2]"
      >
        {/* Background photo */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={followUsImage || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1600&q=80"}
            alt="Girls party collage"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-extrabold text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight">
            FOLLOW US FOR MORE!
          </h2>

          <p className="text-sm sm:text-base text-white/90 font-medium">
            Stay in the loop for drops, behind the scenes, and more.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <a
              href="https://www.facebook.com/share/1QybWhQJCa/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white hover:bg-white/90 text-[#1E141D] border border-transparent font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2.5 rounded-xl cursor-pointer btn-press hover:scale-105"
            >
              <Facebook className="w-5 h-5 text-[#1877F2]" />
              <span>Facebook Page</span>
            </a>
            <a
              href="https://www.instagram.com/bodybond_glue?stkn=MWg3eGZ6bzhhdnF3Yw=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white hover:bg-white/90 text-[#1E141D] border border-transparent font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2.5 rounded-xl cursor-pointer btn-press hover:scale-105"
            >
              <Instagram className="w-5 h-5 text-[#E4405F]" />
              <span>Instagram Page</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 7. SOFT PINK BANNER 2 */}
      {/* ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#FF52A3] via-[#FF2D8D] to-[#E61974] py-3.5 px-4 text-center shadow-md">
        <p className="font-extrabold text-xs sm:text-sm tracking-[0.25em] text-white uppercase">
          “LOOK HOT STAY PUT!”
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 8. COMMONLY ASKED.. FAQ SECTION */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto"
      >
        <div className="space-y-8">
          
          <h2 className="font-extrabold text-3xl sm:text-4xl text-center text-[#1E141D] tracking-tight">
            Commonly Asked..
          </h2>

          {/* Accordions */}
          <div className="space-y-3 pt-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#F2D3E2] overflow-hidden transition-colors shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#1E141D] tracking-wider uppercase hover:text-[#FF2D8D] transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <span className="text-[#FF2D8D] ml-3 text-base font-bold transition-transform duration-200">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#503748] leading-relaxed border-t border-[#F4DCE7] pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </motion.section>

    </div>
  );
};
