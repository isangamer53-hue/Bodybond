import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { useMedia } from '../context/MediaContext';

export const AdminTriggerButton: React.FC = () => {
  const { openAdmin, hasCustomChanges } = useMedia();

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <button
        onClick={openAdmin}
        className="group flex items-center gap-2 bg-[#16161D] hover:bg-[#22222C] text-white px-3.5 py-2.5 rounded-full border border-[#3A3A4A] shadow-2xl hover:shadow-[#FF2D8D]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        title="Open Admin Panel to change photos & videos"
      >
        <div className="relative">
          <Settings className="w-4 h-4 text-[#FF2D8D] group-hover:rotate-45 transition-transform" />
          {hasCustomChanges && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider text-white">
          Admin Media
        </span>
      </button>
    </div>
  );
};
