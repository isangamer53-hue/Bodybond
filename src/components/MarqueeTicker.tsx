import React from 'react';
import { Sparkles, ShieldCheck, Heart, Droplets, Check, Zap, Flame, Star, Truck } from 'lucide-react';

/**
 * 1. Slogan Marquee (Matches the "JUST SNAP IT!" vibe from getsnappy.in)
 * Bold, energetic, neon glowing typographic marquee right above product showcase
 */
export const SloganMarquee: React.FC<{
  slogans?: string[];
  className?: string;
  speed?: 'normal' | 'fast' | 'slow';
}> = ({
  slogans = [
    'JUST BOND IT!',
    'ZERO SLIP',
    'STICK WITH CONFIDENCE',
    'SWEAT PROOF',
    'NO ACCIDENTS',
    'JUST BOND IT!',
    '100% INVISIBLE',
    'LOOK HOT • STAY COVERED',
  ],
  className = '',
  speed = 'normal',
}) => {
  const speedClass = 
    speed === 'fast' ? 'animate-marquee-fast' : speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee';

  return (
    <div className={`w-full overflow-hidden py-2.5 bg-white border-y border-[#F2D3E2] shadow-sm select-none ${className}`}>
      <div className={`${speedClass} flex items-center space-x-6 sm:space-x-10`}>
        {[...slogans, ...slogans, ...slogans, ...slogans].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 sm:space-x-10 whitespace-nowrap">
            <span className="font-black text-xs sm:text-sm tracking-[0.2em] uppercase font-brand text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D8D] via-[#E61B78] to-[#FF52A3]">
              {text}
            </span>
            <span className="text-[#FF2D8D] text-xs sm:text-sm font-black">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 2. Top Bar Announcement Marquee (Continuous sliding offers & COD notice)
 */
export const TopAnnouncementMarquee: React.FC<{
  customText?: string;
}> = ({ customText }) => {
  const defaultItems = [
    '⚡ SPECIAL DISCOUNT: SAVE UP TO ৳500 TODAY',
    '🚚 FAST CASH ON DELIVERY ALL OVER BANGLADESH',
    '💖 100% SKIN SAFE & SWEAT RESISTANT ALOE VERA FORMULA',
    '✨ NO RESIDUE & EASY WARM WATER REMOVAL',
    '🔥 10,000+ HAPPY CUSTOMERS IN BD',
    '👗 PERFECT FOR DEEP-V, BACKLESS, SAREE & GOWNS',
  ];

  const items = customText ? [customText, ...defaultItems] : defaultItems;

  return (
    <div className="w-full bg-gradient-to-r from-[#FF4F9E] via-[#FF2D8D] to-[#E61B78] text-white py-1.5 overflow-hidden shadow-sm select-none">
      <div className="animate-marquee-ticker flex items-center space-x-8">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-4 text-[11px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap text-white">
            <span>{item}</span>
            <span className="text-[#FFE6F2] font-black">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 3. As Seen / Social Proof Credibility Marquee (Clean luxury style with icons)
 */
export const CredibilityMarquee: React.FC<{
  className?: string;
  theme?: 'dark' | 'pink';
}> = ({ className = '', theme = 'dark' }) => {
  const proofItems = [
    { text: 'AS SEEN ON TIKTOK & INSTAGRAM', icon: Flame, color: '#FF2D8D' },
    { text: '100% SKIN-SAFE ALOE VERA FORMULA', icon: ShieldCheck, color: '#16A34A' },
    { text: 'ZERO STAINS ON SILK, CHIFFON & COTTON', icon: Check, color: '#D91B74' },
    { text: '12+ HOURS SWEAT & DANCE PROOF', icon: Droplets, color: '#2563EB' },
    { text: 'NO MORE USELESS FASHION TAPE', icon: Sparkles, color: '#D97706' },
    { text: 'EASY PAINLESS WARM WATER REMOVAL', icon: Heart, color: '#E11D48' },
    { text: 'OVER 10,000+ GIRLS OBSESSED IN BD', icon: Zap, color: '#9333EA' },
    { text: 'ORIGINAL BODYBOND ZERO-SLIP FORMULA', icon: Star, color: '#FF2D8D' },
  ];

  const bgStyle = theme === 'pink'
    ? 'bg-gradient-to-r from-[#FF2D8D] via-[#FF65AC] to-[#FF2D8D] text-white border-y border-white/20'
    : 'bg-white text-[#1E141D] border-y border-[#F2D3E2] shadow-sm';

  return (
    <div className={`w-full py-3 overflow-hidden select-none ${bgStyle} ${className}`}>
      <div className="animate-marquee flex items-center space-x-8 sm:space-x-12">
        {[...proofItems, ...proofItems, ...proofItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-3 text-xs sm:text-sm font-extrabold tracking-[0.15em] uppercase whitespace-nowrap">
              <Icon 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: theme === 'pink' ? '#FFFFFF' : item.color }} 
              />
              <span className={theme === 'pink' ? 'text-white' : 'text-[#2D1B28]'}>
                {item.text}
              </span>
              <span className={theme === 'pink' ? 'text-white/60' : 'text-[#FF2D8D] font-black'}>✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 4. Reverse Direction Marquee (For alternating motion ribbons)
 */
export const ReverseSloganMarquee: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const items = [
    '👗 DEEP V-NECKS',
    '👚 STRAPLESS TOPS',
    '🥻 SAREE PALLU & PLEATS',
    '💃 BACKLESS GOWNS',
    '✨ OFF-SHOULDER DRESSES',
    '✨ SLIT SKIRTS & LEHENGAS',
    '💖 COLLAR & BUTTON GAPS',
  ];

  return (
    <div className={`w-full overflow-hidden py-2 bg-white border-y border-[#F2D3E2] select-none ${className}`}>
      <div className="animate-marquee-reverse flex items-center space-x-8 sm:space-x-10">
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 whitespace-nowrap">
            <span className="font-bold text-xs sm:text-xs tracking-wider text-[#6B3F5D] uppercase">
              {text}
            </span>
            <span className="text-[#FF2D8D] font-bold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 5. Fixed Bottom Ticker (Fixed/Sticky at the bottom of the screen always)
 */
export const FixedBottomTicker: React.FC = () => {
  const items = [
    { text: 'AS SEEN ON TIKTOK & VIRAL REELS', icon: Flame, color: '#FF2D8D' },
    { text: '100% SKIN SAFE & SWEAT PROOF', icon: ShieldCheck, color: '#4ADE80' },
    { text: 'CASH ON DELIVERY ALL OVER BANGLADESH', icon: Truck, color: '#FACC15' },
    { text: 'ORIGINAL ZERO-SLIP BODY GLUE FORMULA', icon: Star, color: '#FFA6D5' },
    { text: 'EASY REMOVAL WITH WARM WATER • ZERO STAIN', icon: Droplets, color: '#60A5FA' },
    { text: '10,000+ HAPPY GIRLS IN BD', icon: Heart, color: '#F43F5E' },
  ];

  return (
    <aside 
      aria-label="Promotional announcements"
      className="fixed bottom-0 left-0 right-0 z-30 h-[28px] sm:h-[32px] flex items-center bg-[#1E141D] text-white border-t border-[#3D2536] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] select-none overflow-hidden"
    >
      <div className="animate-marquee-slow flex items-center space-x-8 sm:space-x-12">
        {[...items, ...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2.5 text-[11px] sm:text-xs font-black tracking-[0.18em] uppercase whitespace-nowrap text-white">
              <span className="text-[#FF2D8D] font-black text-xs">✦</span>
              <Icon 
                className="w-3.5 h-3.5 flex-shrink-0" 
                style={{ color: item.color }} 
              />
              <span className="text-[#FFE6F2] tracking-wider">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export const MarqueeTicker: React.FC = () => {
  return <CredibilityMarquee />;
};
