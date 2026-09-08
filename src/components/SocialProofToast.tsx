import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Check, ShieldCheck } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

export const SocialProofToast: React.FC = () => {
  const { recentBuyerActivities, openTrackingModal } = useOrders();
  const { setQuickViewProduct } = useCart();
  
  const [toast, setToast] = useState<{
    id?: string;
    name: string;
    city: string;
    productName: string;
    time: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    if (!recentBuyerActivities || recentBuyerActivities.length === 0) return;

    let index = 0;
    
    // Show first toast after 4s
    const initialTimer = setTimeout(() => {
      const item = recentBuyerActivities[0];
      if (item) {
        setToast({
          id: item.id,
          name: item.name,
          city: item.city,
          productName: item.productName,
          time: item.timeAgo,
          image: item.productImage,
        });
        setTimeout(() => setToast(null), 5500);
      }
    }, 4000);

    const interval = setInterval(() => {
      index = (index + 1) % recentBuyerActivities.length;
      const item = recentBuyerActivities[index];
      if (item) {
        setToast({
          id: item.id,
          name: item.name,
          city: item.city,
          productName: item.productName,
          time: item.timeAgo,
          image: item.productImage,
        });

        // Auto dismiss after 5.5s
        setTimeout(() => setToast(null), 5500);
      }
    }, 16000); // Trigger every 16s

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [recentBuyerActivities]);

  if (!toast) return null;

  return (
    <div 
      className="fixed bottom-24 left-4 sm:bottom-28 sm:left-5 z-40 max-w-xs sm:max-w-sm bg-[#121212] text-white rounded-2xl p-3.5 shadow-2xl border border-[#2B2B2B] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
    >
      <img
        src={toast.image}
        alt={toast.productName}
        referrerPolicy="no-referrer"
        className="w-12 h-12 rounded-xl object-cover border border-[#262626] bg-black flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-extrabold text-white truncate">
          {toast.name} <span className="font-normal text-[#888888]">in</span> {toast.city}
        </p>
        <p className="text-[10px] text-[#A0A0A0] truncate">
          Ordered <span className="font-bold text-[#FF2D8D]">{toast.productName}</span>
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[9px] text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
            <span>Verified Cash On Delivery</span>
          </span>
          <span>•</span>
          <span>{toast.time}</span>
        </div>
      </div>

      <button
        onClick={() => setToast(null)}
        className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

