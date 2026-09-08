import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Truck,
  Lock,
  Facebook,
  Instagram
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

interface FooterProps {
  onNavigate: (page: string, productId?: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { openTrackingModal } = useOrders();

  const [secretClickCount, setSecretClickCount] = useState(0);

  const handleSecretCopyrightClick = () => {
    const nextCount = secretClickCount + 1;
    if (nextCount >= 4) {
      setSecretClickCount(0);
      if (onOpenAdmin) onOpenAdmin();
      else onNavigate('admin');
    } else {
      setSecretClickCount(nextCount);
      setTimeout(() => setSecretClickCount(0), 3000);
    }
  };

  return (
    <footer className="bg-[#FCEDF3]/95 backdrop-blur-md text-[#1E141D] border-t border-[#F2D3E2]">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="font-extrabold text-2xl tracking-[0.18em] text-[#FF2D8D] uppercase">
                BOD<span className="relative inline-block">Y<span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] text-[#E61974]">♥</span></span>BOND
              </span>
              <p className="text-[10px] tracking-[0.25em] text-[#8C647D] uppercase font-semibold">
                Wardrobe Security Essentials • Bangladesh
              </p>
            </div>
            
            <p className="text-xs text-[#6B5061] leading-relaxed max-w-sm">
              Bodybond empowers women to wear daring, backless, plunge, and strapless silhouettes with 100% confidence and zero wardrobe slips.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-[#8C647D]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF2D8D]" />
                <span className="text-[#1E141D] font-medium">100% Skin Safe Guarantee</span>
              </span>
              <span>•</span>
              <span>Cash On Delivery Nationwide</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-3 flex items-center gap-2.5 flex-wrap">
              <span className="text-xs text-[#8C647D] font-semibold mr-1">Follow Us:</span>
              <a
                href="https://www.facebook.com/share/1QybWhQJCa/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-[#F2D3E2] hover:border-[#1877F2] text-[#1E141D] transition-all flex items-center gap-2 text-xs font-bold group cursor-pointer shadow-sm"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/bodybond_glue?stkn=MWg3eGZ6bzhhdnF3Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-[#F2D3E2] hover:border-[#E4405F] text-[#1E141D] transition-all flex items-center gap-2 text-xs font-bold group cursor-pointer shadow-sm"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4 text-[#E4405F] group-hover:scale-110 transition-transform" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1E141D]">Shop Collection</h4>
            <ul className="space-y-2 text-xs text-[#6B5061]">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product-detail', 'bodybond-glue')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer">
                  Bodybond Glue (20ml) — 1250 Tk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product-detail', 'bodybond-glue')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer">
                  Bodybond Glue (30ml) — 1350 Tk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product-detail', 'bodybond-nips-seamless')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer text-gray-400">
                  Seamless Nipple Covers (Sold Out)
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1E141D]">Help & Guidance</h4>
            <ul className="space-y-2 text-xs text-[#6B5061]">
              <li>
                <button 
                  onClick={() => openTrackingModal()} 
                  className="hover:text-[#FF2D8D] text-[#1E141D] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>Track Order (No Login)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('where-to-use')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer flex items-center gap-1.5 text-[#FF2D8D] font-bold">
                  <span>📍 WHERE TO USE (কোথায় ব্যবহার করবেন)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-to-use')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span>✨ HOW TO USE (কীভাবে ব্যবহার করবেন)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-to-remove')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer flex items-center gap-1.5 text-cyan-700 font-bold">
                  <span>🚿 HOW TO REMOVE (কীভাবে রিমুভ করবেন)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('outfit-matcher')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer">
                  Outfit Problem Solver
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-[#FF2D8D] transition-colors cursor-pointer">
                  Customer Reviews (2,500+)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & Cash On Delivery guarantee */}
        <div className="mt-14 pt-8 border-t border-[#F2D3E2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C647D]">
          <div className="flex items-center gap-3">
            <p 
              onClick={handleSecretCopyrightClick}
              className="select-none cursor-default"
              title=""
            >
              © {new Date().getFullYear()} BODYBOND Bangladesh. All Rights Reserved.
            </p>
            <span>•</span>
            <button
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                else onNavigate('admin');
              }}
              className="text-[#8C647D] hover:text-[#FF2D8D] transition-colors cursor-pointer text-[11px] font-semibold"
            >
              Admin Login
            </button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-3.5 py-1.5 bg-white border border-[#F2D3E2] rounded-full text-[11px] font-bold text-[#1E141D] flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              100% Cash On Delivery Across Bangladesh (No Online Payment Needed)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
