import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  Truck, 
  Globe, 
  Sparkles, 
  Check, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Clock,
  Zap
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { OfferCountdownCard } from '../OfferCountdownCard';

interface AdminStoreSettingsTabProps {
  onShowNotification: (msg: string) => void;
  onShowError: (msg: string) => void;
}

export const AdminStoreSettingsTab: React.FC<AdminStoreSettingsTabProps> = ({ onShowNotification, onShowError }) => {
  const { announcement, updateAnnouncement } = useOrders();

  const [topBarText, setTopBarText] = useState(announcement.topBarText);
  const [showTopBar, setShowTopBar] = useState(announcement.showTopBar ?? true);
  const [insideDhakaFee, setInsideDhakaFee] = useState<number>(announcement.insideDhakaFeeBDT ?? 60);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState<number>(announcement.outsideDhakaFeeBDT ?? 120);
  const [highlightBadgeText, setHighlightBadgeText] = useState(announcement.highlightBadgeText || 'CASH ON DELIVERY (COD)');

  // Flash Sale / Countdown Timer States
  const [showOfferCountdown, setShowOfferCountdown] = useState<boolean>(announcement.showOfferCountdown ?? true);
  const [countdownHours, setCountdownHours] = useState<number>(announcement.offerCountdownHours ?? 11);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(announcement.offerCountdownMinutes ?? 51);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(announcement.offerCountdownSeconds ?? 11);
  const [countdownLabel, setCountdownLabel] = useState<string>(announcement.offerCountdownLabel || 'OFFER ENDS IN');

  useEffect(() => {
    setTopBarText(announcement.topBarText);
    setShowTopBar(announcement.showTopBar ?? true);
    setInsideDhakaFee(announcement.insideDhakaFeeBDT ?? 60);
    setOutsideDhakaFee(announcement.outsideDhakaFeeBDT ?? 120);
    setHighlightBadgeText(announcement.highlightBadgeText || 'CASH ON DELIVERY (COD)');
    setShowOfferCountdown(announcement.showOfferCountdown ?? true);
    setCountdownHours(announcement.offerCountdownHours ?? 11);
    setCountdownMinutes(announcement.offerCountdownMinutes ?? 51);
    setCountdownSeconds(announcement.offerCountdownSeconds ?? 11);
    setCountdownLabel(announcement.offerCountdownLabel || 'OFFER ENDS IN');
  }, [announcement]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = Number(countdownHours);
    const mins = Number(countdownMinutes);
    const secs = Number(countdownSeconds);
    const targetMs = Date.now() + (hrs * 3600 + mins * 60 + secs) * 1000;

    updateAnnouncement({
      topBarText: topBarText.trim(),
      showTopBar,
      insideDhakaFeeBDT: Number(insideDhakaFee),
      outsideDhakaFeeBDT: Number(outsideDhakaFee),
      highlightBadgeText: highlightBadgeText.trim(),
      showOfferCountdown,
      offerCountdownHours: hrs,
      offerCountdownMinutes: mins,
      offerCountdownSeconds: secs,
      offerCountdownLabel: countdownLabel.trim() || 'OFFER ENDS IN',
      offerTargetTimestamp: targetMs,
    });
    onShowNotification('Store Settings & Offer Countdown Timer updated successfully!');
  };

  const handleResetDefaults = () => {
    const defaults = {
      topBarText: '🚚 Fast Cash on Delivery Available Across Bangladesh • Pay Upon Receipt',
      showTopBar: true,
      insideDhakaFeeBDT: 60,
      outsideDhakaFeeBDT: 120,
      highlightBadgeText: 'CASH ON DELIVERY (COD)',
      freeShippingThresholdBDT: 4000,
      whatsappNumber: '+8801305273979',
      emergencySupportPhone: '+880 1305-273979',
      showOfferCountdown: true,
      offerCountdownHours: 11,
      offerCountdownMinutes: 51,
      offerCountdownSeconds: 11,
      offerCountdownLabel: 'OFFER ENDS IN'
    };
    setTopBarText(defaults.topBarText);
    setShowTopBar(defaults.showTopBar);
    setInsideDhakaFee(defaults.insideDhakaFeeBDT);
    setOutsideDhakaFee(defaults.outsideDhakaFeeBDT);
    setHighlightBadgeText(defaults.highlightBadgeText);
    setShowOfferCountdown(defaults.showOfferCountdown);
    setCountdownHours(defaults.offerCountdownHours);
    setCountdownMinutes(defaults.offerCountdownMinutes);
    setCountdownSeconds(defaults.offerCountdownSeconds);
    setCountdownLabel(defaults.offerCountdownLabel);
    updateAnnouncement(defaults);
    onShowNotification('স্টোর সেটিংস ডিফল্টে রিসেট করা হয়েছে');
  };

  const applyPreset = (hrs: number, mins: number, secs: number, lbl: string = 'OFFER ENDS IN') => {
    setCountdownHours(hrs);
    setCountdownMinutes(mins);
    setCountdownSeconds(secs);
    setCountdownLabel(lbl);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Top Hot Pink Announcement Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF2D8D]/15 text-[#FF2D8D] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">Top Notice / Announcement Bar</h3>
                <p className="text-xs text-gray-400">Appears at the very top of the storefront</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTopBar(!showTopBar)}
              className="flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
            >
              {showTopBar ? <ToggleRight className="w-6 h-6 text-[#FF2D8D]" /> : <ToggleLeft className="w-6 h-6 text-gray-500" />}
              <span>{showTopBar ? 'Visible' : 'Hidden'}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Announcement Bar Text</label>
            <input
              type="text"
              required
              value={topBarText}
              onChange={(e) => setTopBarText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
              placeholder="e.g. 🚚 Fast Cash on Delivery Available Across Bangladesh..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Highlight Badge Text</label>
            <input
              type="text"
              value={highlightBadgeText}
              onChange={(e) => setHighlightBadgeText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
              placeholder="e.g. CASH ON DELIVERY (COD)"
            />
          </div>
        </div>

        {/* Offer Countdown Timer (Flash Sale Scarcity) Settings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF2D8D]/15 text-[#FF2D8D] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">Offer Countdown Timer (Flash Sale)</h3>
                <p className="text-xs text-gray-400">Controls the countdown box placed under Add to Cart & Buy Now buttons</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowOfferCountdown(!showOfferCountdown)}
              className="flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
            >
              {showOfferCountdown ? <ToggleRight className="w-6 h-6 text-[#FF2D8D]" /> : <ToggleLeft className="w-6 h-6 text-gray-500" />}
              <span>{showOfferCountdown ? 'Active' : 'Disabled'}</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#FF2D8D]" />
              <span>Quick Presets (এক ক্লিকে সময় সেট করুন):</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(11, 51, 11, 'OFFER ENDS IN')}
                className="px-2.5 py-1 rounded-lg bg-[#121217] hover:bg-[#FF2D8D]/20 border border-[#2E2E3C] hover:border-[#FF2D8D] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                11h 51m 11s (Default)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(24, 0, 0, '24 HOURS FLASH DEAL')}
                className="px-2.5 py-1 rounded-lg bg-[#121217] hover:bg-[#FF2D8D]/20 border border-[#2E2E3C] hover:border-[#FF2D8D] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                24 Hours
              </button>
              <button
                type="button"
                onClick={() => applyPreset(6, 0, 0, 'LIMITED TIME OFFER')}
                className="px-2.5 py-1 rounded-lg bg-[#121217] hover:bg-[#FF2D8D]/20 border border-[#2E2E3C] hover:border-[#FF2D8D] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                6 Hours
              </button>
              <button
                type="button"
                onClick={() => applyPreset(2, 30, 0, 'TODAYS SPECIAL')}
                className="px-2.5 py-1 rounded-lg bg-[#121217] hover:bg-[#FF2D8D]/20 border border-[#2E2E3C] hover:border-[#FF2D8D] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                2.5 Hours
              </button>
              <button
                type="button"
                onClick={() => applyPreset(0, 45, 0, 'HURRY! ENDING SOON')}
                className="px-2.5 py-1 rounded-lg bg-[#121217] hover:bg-[#FF2D8D]/20 border border-[#2E2E3C] hover:border-[#FF2D8D] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                45 Minutes
              </button>
            </div>
          </div>

          {/* Time Inputs: Hours, Minutes, Seconds */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Hours (ঘণ্টা)</label>
              <input
                type="number"
                min="0"
                max="99"
                value={countdownHours}
                onChange={(e) => setCountdownHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-sm text-center text-white font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Minutes (মিনিট)</label>
              <input
                type="number"
                min="0"
                max="59"
                value={countdownMinutes}
                onChange={(e) => setCountdownMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-sm text-center text-white font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Seconds (সেকেন্ড)</label>
              <input
                type="number"
                min="0"
                max="59"
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-sm text-center text-white font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Label Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Bottom Label Text (ট্যাগলাইন)</label>
            <input
              type="text"
              value={countdownLabel}
              onChange={(e) => setCountdownLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none"
              placeholder="e.g. OFFER ENDS IN or অফার শেষ হতে বাকি"
            />
          </div>

          {/* Live Interactive Preview */}
          <div className="pt-2 border-t border-[#2A2A38]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400">Live Preview (ওয়েবসাইটে যেমন দেখাবে):</span>
              <span className="text-[10px] text-pink-400 font-bold">{showOfferCountdown ? '● Active' : '○ Disabled'}</span>
            </div>
            <div className="max-w-md mx-auto">
              <OfferCountdownCard
                previewHours={countdownHours}
                previewMinutes={countdownMinutes}
                previewSeconds={countdownSeconds}
                label={countdownLabel}
                forceShow={true}
              />
            </div>
          </div>
        </div>

        {/* Delivery Fee Settings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#181820] border border-[#2B2B38] space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF2D8D]/15 text-[#FF2D8D] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">Nationwide Delivery Fee Rates (BDT)</h3>
              <p className="text-xs text-gray-400">Controls the automatic fee calculation during checkout</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Inside Dhaka Delivery Fee (৳)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={insideDhakaFee}
                  onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-500">Standard: ৳60 Inside Dhaka</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">Outside Dhaka Delivery Fee (৳)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={outsideDhakaFee}
                  onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#121217] border border-[#2E2E3C] focus:border-[#FF2D8D] rounded-xl text-xs text-white focus:outline-none font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-500">Standard: ৳120 Outside Dhaka</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings Defaults</span>
          </button>

          <button
            type="submit"
            className="py-3 px-6 bg-[#FF2D8D] hover:bg-[#E0267B] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};

