import React, { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';

interface OfferCountdownCardProps {
  className?: string;
  label?: string;
  previewHours?: number;
  previewMinutes?: number;
  previewSeconds?: number;
  forceShow?: boolean;
}

export const OfferCountdownCard: React.FC<OfferCountdownCardProps> = ({
  className = '',
  label,
  previewHours,
  previewMinutes,
  previewSeconds,
  forceShow = false,
}) => {
  const { announcement } = useOrders();

  const isVisible = forceShow || (announcement.showOfferCountdown ?? true);
  const displayLabel = label || announcement.offerCountdownLabel || 'OFFER ENDS IN';

  // Calculate base duration in seconds
  const configHours = previewHours !== undefined ? previewHours : (announcement.offerCountdownHours ?? 11);
  const configMinutes = previewMinutes !== undefined ? previewMinutes : (announcement.offerCountdownMinutes ?? 51);
  const configSeconds = previewSeconds !== undefined ? previewSeconds : (announcement.offerCountdownSeconds ?? 11);

  const totalDurationSeconds = Math.max(
    10,
    configHours * 3600 + configMinutes * 60 + configSeconds
  );

  const isPreviewMode = previewHours !== undefined || previewMinutes !== undefined || previewSeconds !== undefined;

  const dbTargetTimestamp = announcement.offerTargetTimestamp;

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (isPreviewMode) return totalDurationSeconds;
    if (dbTargetTimestamp) {
      const diff = Math.floor((dbTargetTimestamp - Date.now()) / 1000);
      return diff > 0 ? diff : totalDurationSeconds;
    }
    return totalDurationSeconds;
  });

  // Sync and tick countdown based on real database target timestamp
  useEffect(() => {
    if (isPreviewMode) {
      setRemainingSeconds(totalDurationSeconds);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const target = dbTargetTimestamp || (now + totalDurationSeconds * 1000);
      const diff = Math.floor((target - now) / 1000);

      if (diff > 0) {
        setRemainingSeconds(diff);
      } else {
        // Fallback smooth loop if expired
        const loopRemaining = totalDurationSeconds > 0 ? Math.max(0, totalDurationSeconds + (diff % totalDurationSeconds)) : 0;
        setRemainingSeconds(loopRemaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dbTargetTimestamp, totalDurationSeconds, isPreviewMode]);

  if (!isVisible) return null;

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      id="offer-countdown-card"
      className={`w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#21111F] via-[#170B16] to-[#10060F] border border-[#FF2D8D]/35 p-4 sm:p-5 shadow-lg shadow-[#FF2D8D]/10 text-center relative overflow-hidden ${className}`}
    >
      {/* Subtle ambient pink background glow */}
      <div className="absolute inset-0 bg-radial from-[#FF2D8D]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Digits row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          
          {/* Hours block */}
          <div className="flex flex-col items-center justify-center bg-[#0C040B] border border-white/10 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 min-w-[58px] sm:min-w-[68px] shadow-inner">
            <span className="text-white font-extrabold text-2xl sm:text-3xl font-mono leading-none tracking-tight">
              {pad(hours)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-pink-300/70 mt-1">
              HRS
            </span>
          </div>

          {/* Colon */}
          <span className="text-[#FF2D8D] font-black text-xl sm:text-2xl pb-3 select-none animate-pulse-soft">
            :
          </span>

          {/* Minutes block */}
          <div className="flex flex-col items-center justify-center bg-[#0C040B] border border-white/10 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 min-w-[58px] sm:min-w-[68px] shadow-inner">
            <span className="text-white font-extrabold text-2xl sm:text-3xl font-mono leading-none tracking-tight">
              {pad(minutes)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-pink-300/70 mt-1">
              MIN
            </span>
          </div>

          {/* Colon */}
          <span className="text-[#FF2D8D] font-black text-xl sm:text-2xl pb-3 select-none animate-pulse-soft">
            :
          </span>

          {/* Seconds block */}
          <div className="flex flex-col items-center justify-center bg-[#0C040B] border border-white/10 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 min-w-[58px] sm:min-w-[68px] shadow-inner">
            <span className="text-[#FF2D8D] font-extrabold text-2xl sm:text-3xl font-mono leading-none tracking-tight">
              {pad(seconds)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-pink-300/70 mt-1">
              SEC
            </span>
          </div>

        </div>

        {/* Footer label with sparkles */}
        <p className="font-extrabold text-[11px] sm:text-xs tracking-[0.25em] text-[#FF459E] uppercase flex items-center justify-center gap-2 mt-3 text-center">
          <span className="text-pink-400/80 text-[10px]">✦</span>
          <span>{displayLabel}</span>
          <span className="text-pink-400/80 text-[10px]">✦</span>
        </p>
      </div>
    </div>
  );
};
