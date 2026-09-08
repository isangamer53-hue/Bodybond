import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Flame,
  Check,
  Globe,
  Settings,
  Truck,
  Facebook,
  Instagram
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { CURRENCY_RATES } from '../data/products';
import { CurrencyCode } from '../types';

interface HeaderProps {
  onNavigate: (page: string, productId?: string) => void;
  activePage: string;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage, onOpenAdmin }) => {
  const { 
    cart, 
    totalItems, 
    setIsCartOpen, 
    currency, 
    setCurrency, 
    setIsSearchOpen,
    isFreeShippingUnlocked,
    freeShippingRemainingNZD,
    formatPrice
  } = useCart();

  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const { openTrackingModal, announcement } = useOrders();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'shop', label: t.navShopAll, badge: null, disabled: false },
    { id: 'product:bodybond-glue', label: t.navGlue, badge: 'BESTSELLER', disabled: false },
    { id: 'where-to-use', label: 'WHERE TO USE', subLabel: 'কোথায় ব্যবহার করবেন', badge: 'OUTFITS', disabled: false, isSpecial: true },
    { id: 'how-to-use', label: 'HOW TO USE', subLabel: 'কীভাবে ব্যবহার করবেন', badge: 'STEPS', disabled: false, isSpecial: true },
    { id: 'how-to-remove', label: 'HOW TO REMOVE', subLabel: 'কীভাবে রিমুভ করবেন', badge: 'EASY', disabled: false, isSpecial: true },
    { id: 'track-order', label: 'Track Order', badge: 'LIVE', disabled: false, isTrack: true },
    { id: 'reviews', label: t.navReviews, badge: '4.9★', disabled: false },
    { id: 'faq', label: t.navFaq, badge: null, disabled: false },
  ];

  const handleNavClick = (linkId: string, disabled?: boolean, isTrack?: boolean) => {
    if (disabled || linkId.includes('bodybond-nips-seamless')) {
      return; // Do NOT enter sold out product
    }
    if (isTrack || linkId === 'track-order') {
      openTrackingModal();
      setIsMobileMenuOpen(false);
      return;
    }
    if (linkId === 'where-to-use' || linkId === 'how-to-use' || linkId === 'how-to-remove') {
      onNavigate(linkId);
      setIsMobileMenuOpen(false);
      return;
    }
    if (linkId.startsWith('product:')) {
      const pid = linkId.split(':')[1];
      onNavigate('product-detail', pid);
    } else {
      onNavigate(linkId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF5F8]/95 backdrop-blur-xl text-[#1E141D] border-b border-[#F4D2E3] transition-all duration-300 shadow-sm">
      {/* Top Radiant Hot Pink Announcement Bar with Language & COD info */}
      {announcement?.showTopBar !== false && (
        <div className="bg-gradient-to-r from-[#FF52A3] via-[#FF2D8D] to-[#E61974] text-white text-xs font-black py-1.5 px-3 sm:px-6 tracking-wide shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Left: Top announcement */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs truncate">
              <span className="text-sm">🚚</span>
              <span className="truncate">{announcement?.topBarText || 'Fast Cash on Delivery Available Across Bangladesh • Pay Upon Receipt'}</span>
            </div>

            {/* Right: Quick Track Order & COD Badge */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => openTrackingModal()}
                className="hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white font-black text-[10px] sm:text-[11px] transition-colors cursor-pointer"
                title="Track order without login"
              >
                <Truck className="w-3 h-3 text-white" />
                <span>Track Order</span>
              </button>

              {/* COD Tag */}
              <div className="flex items-center gap-1">
                <span className="px-2.5 py-0.5 rounded bg-white text-[#FF2D8D] font-black text-[10px] sm:text-[11px] tracking-tight uppercase shadow-sm">
                  {announcement?.highlightBadgeText || 'CASH ON DELIVERY (COD)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Luxury Blush Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Hamburger menu trigger & Search */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#1E141D] hover:text-[#FF2D8D] transition-colors rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1E141D] hover:text-[#FF2D8D] transition-colors hidden sm:flex cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Center Brand Logo: BODYBOND with cute heart over 'Y' */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <button
              onClick={() => handleNavClick('home')}
              className="text-center group cursor-pointer flex items-center gap-0.5 select-none"
            >
              <span className="font-extrabold text-2xl sm:text-3xl tracking-[0.18em] text-[#FF2D8D] uppercase font-sans">
                BOD<span className="relative inline-block">Y<span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[11px] text-[#E61974]">♥</span></span>BOND
              </span>
            </button>
          </div>

          {/* Right Action Icons: Track, Search & Shopping Bag */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <button
              onClick={() => openTrackingModal()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFEBF3] hover:bg-[#FFD9E9] border border-[#F4BED7] text-[#1E141D] hover:text-[#FF2D8D] rounded-full text-xs font-bold transition-all cursor-pointer"
              title="Track your order live"
            >
              <Truck className="w-3.5 h-3.5 text-[#FF2D8D]" />
              <span className="hidden md:inline">Track Order</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1E141D] hover:text-[#FF2D8D] transition-colors sm:hidden cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Bag Button with badge count */}
            <button
              id="cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#1E141D] hover:text-[#FF2D8D] transition-all rounded-full cursor-pointer group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
              <span className="absolute bottom-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-black bg-[#FF2D8D] text-white rounded-full shadow-md">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Quick Nav Strip */}
      <div className="hidden lg:block border-t border-[#F4D2E3] bg-[#FFF5F8] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 text-xs font-bold uppercase tracking-widest text-[#5C3E52]">
          {navLinks.map((link) => {
            const isActive = activePage === link.id || (link.id === 'shop' && activePage === 'shop');
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.disabled, (link as any).isTrack)}
                disabled={link.disabled}
                className={`py-1 flex items-center gap-1.5 transition-colors ${
                  link.disabled
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : (link as any).isSpecial
                      ? 'text-[#FF2D8D] font-black cursor-pointer hover:scale-105'
                      : isActive 
                        ? 'text-[#FF2D8D] font-black cursor-pointer' 
                        : 'hover:text-[#FF2D8D] cursor-pointer'
                }`}
              >
                <span className={(link as any).isSpecial ? 'font-black tracking-tight text-[#1E141D]' : ''}>{link.label}</span>
                {link.badge && (
                  <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-full ${
                    link.disabled 
                      ? 'bg-[#E5D5DD] text-gray-500' 
                      : (link as any).isSpecial 
                        ? 'bg-[#FF2D8D] text-white shadow-sm' 
                        : 'bg-[#FF2D8D] text-white'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF5F8] border-b border-[#F4D2E3] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 text-[#1E141D] shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {/* Standard Nav Links */}
            {navLinks.filter(l => !l.isSpecial).map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.disabled, (link as any).isTrack)}
                disabled={link.disabled}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-left rounded-xl transition-colors ${
                  link.disabled 
                    ? 'opacity-40 cursor-not-allowed text-gray-400' 
                    : 'text-[#1E141D] hover:bg-[#FFE8F2] cursor-pointer'
                }`}
              >
                <span className="tracking-wider uppercase text-xs">{link.label}</span>
                {link.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${link.disabled ? 'bg-[#E5D5DD] text-gray-500' : 'bg-[#FF2D8D] text-white'}`}>
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            {/* DEDICATED EXTRA-BOLD GUIDES BOX IN SIDEBAR */}
            <div className="my-2 p-3 rounded-2xl bg-gradient-to-br from-[#FFEAF3] via-[#FFF0F6] to-[#FFE6F0] border-2 border-[#FF2D8D]/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#FF2D8D]/20">
                <span className="text-xs font-black uppercase text-[#FF2D8D] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF2D8D]" />
                  STYLING & USAGE GUIDES
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF2D8D] text-white">
                  MUST READ
                </span>
              </div>

              {/* 1. WHERE TO USE */}
              <button
                onClick={() => handleNavClick('where-to-use')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#FFEBF3] text-[#1E141D] border border-[#F4BED7] transition-all text-left cursor-pointer group shadow-sm"
              >
                <div>
                  <span className="font-black text-sm uppercase text-[#1E141D] group-hover:text-[#FF2D8D] block tracking-tight">
                    📍 WHERE TO USE
                  </span>
                  <span className="text-[11px] font-bold text-[#8C5D7D] block">
                    (কোথায় ব্যবহার করবেন)
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-[#FF2D8D] text-white shadow-sm">
                  OUTFITS
                </span>
              </button>

              {/* 2. HOW TO USE */}
              <button
                onClick={() => handleNavClick('how-to-use')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#FFEBF3] text-[#1E141D] border border-[#F4BED7] transition-all text-left cursor-pointer group shadow-sm"
              >
                <div>
                  <span className="font-black text-sm uppercase text-[#1E141D] group-hover:text-[#FF2D8D] block tracking-tight">
                    ✨ HOW TO USE
                  </span>
                  <span className="text-[11px] font-bold text-[#8C5D7D] block">
                    (কীভাবে ব্যবহার করবেন)
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm">
                  30-SEC STEPS
                </span>
              </button>

              {/* 3. HOW TO REMOVE */}
              <button
                onClick={() => handleNavClick('how-to-remove')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#FFEBF3] text-[#1E141D] border border-[#F4BED7] transition-all text-left cursor-pointer group shadow-sm"
              >
                <div>
                  <span className="font-black text-sm uppercase text-[#1E141D] group-hover:text-[#FF2D8D] block tracking-tight">
                    🚿 HOW TO REMOVE
                  </span>
                  <span className="text-[11px] font-bold text-[#8C5D7D] block">
                    (কীভাবে রিমুভ করবেন)
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-cyan-600 text-white shadow-sm">
                  PAIN FREE
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4D2E3] flex flex-col gap-3 px-2">
            <div className="flex items-center justify-between text-xs text-[#6B5061]">
              <span>Cash On Delivery Available Nationwide</span>
              <span className="font-bold text-[#FF2D8D]">100% Skin Safe</span>
            </div>
            
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.facebook.com/share/1QybWhQJCa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-white hover:bg-[#1877F2]/10 border border-[#F4BED7] hover:border-[#1877F2] text-xs font-bold text-[#1E141D] rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/bodybond_glue?stkn=MWg3eGZ6bzhhdnF3Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-white hover:bg-[#E4405F]/10 border border-[#F4BED7] hover:border-[#E4405F] text-xs font-bold text-[#1E141D] rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
