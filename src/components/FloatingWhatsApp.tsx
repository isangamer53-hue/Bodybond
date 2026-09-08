import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCircle2, PhoneCall, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../context/OrderContext';

export const FloatingWhatsApp: React.FC = () => {
  const { announcement } = useOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [customMsg, setCustomMsg] = useState('');

  const phone = announcement?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801305273979';

  // Auto-trigger a gentle peek after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const quickPrompts = [
    { label: '👗 Which tape/glue for backless dress?', text: 'Hi BODYBOND! I need advice on choosing the right tape/glue for my outfit.' },
    { label: '🚚 Delivery fee & time info?', text: 'Hello! Please tell me delivery details inside & outside Dhaka.' },
    { label: '📦 Track my order', text: 'Hi! I want to know my order tracking update.' },
    { label: '💕 Speak with a female consultant', text: 'Hello BODYBOND team! I would like to chat with a female consultant.' },
  ];

  const handleOpenWhatsApp = (text?: string) => {
    const finalMsg = text || customMsg || 'Hello Bodybond Team! I have a question about Bodybond Body Glue & Tape.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`, '_blank');
    setUnreadCount(0);
    setIsOpen(false);
  };

  return (
    <div id="floating-whatsapp-widget" className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Interactive Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="whatsapp-chat-modal"
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-[330px] sm:w-[360px] bg-[#141218] border border-[#FF2D8D]/30 rounded-3xl shadow-2xl shadow-[#FF2D8D]/15 overflow-hidden backdrop-blur-xl"
          >
            {/* Header with WhatsApp Gradient & Support Info */}
            <div className="bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Support Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/80 overflow-hidden flex items-center justify-center text-xl shadow-md">
                      👩‍💼
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#075E54] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm tracking-wide">BODYBOND Concierge</h4>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    </div>
                    <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                      Online • Replies in ~2 mins
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Feminine welcome tag */}
              <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-emerald-100 font-semibold">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-pink-200 fill-pink-200" /> Female VIP Shopping Assistance
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">24/7 Active</span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3.5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C1622] via-[#141218] to-[#0F0E12] max-h-[360px] overflow-y-auto">
              {/* Message Bubble 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FF2D8D]/20 text-[#FF2D8D] flex items-center justify-center text-xs font-bold flex-shrink-0 border border-[#FF2D8D]/30">
                  🎀
                </div>
                <div className="bg-[#211B28] border border-[#362B40] text-gray-200 text-xs p-3 rounded-2xl rounded-tl-none shadow-sm space-y-1">
                  <p className="font-bold text-white flex items-center gap-1">
                    <span>Hey Beautiful! 👋</span>
                  </p>
                  <p className="leading-relaxed">
                    Welcome to BODYBOND! Need help finding the perfect body glue or seamless nipple covers for your outfits?
                  </p>
                  <span className="text-[9px] text-gray-400 block text-right pt-1">Just now</span>
                </div>
              </div>

              {/* Quick Choice Buttons */}
              <div className="pt-1 space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-[#FF2D8D] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Select a quick option:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOpenWhatsApp(item.text)}
                      className="text-left px-3 py-2 bg-[#201B27] hover:bg-[#FF2D8D] text-gray-200 hover:text-white border border-[#332A3E] hover:border-[#FF2D8D] rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm"
                    >
                      <span>{item.label}</span>
                      <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Message Input & Direct Send */}
            <div className="p-3 bg-[#17141E] border-t border-[#2A2333] flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenWhatsApp()}
                className="flex-1 bg-[#0F0D14] border border-[#2B2336] focus:border-[#FF2D8D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder:text-gray-500"
              />
              <button
                onClick={() => handleOpenWhatsApp()}
                className="p-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-90 text-white rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center"
                title="Send to WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Live Badge & Pulsing Aura */}
      <div className="relative flex items-center gap-3">
        {/* Automatic Teaser Speech Bubble (Visible when chat modal is closed) */}
        {!isOpen && hasPrompted && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-[#1E1826] to-[#14101B] text-white border border-[#FF2D8D]/40 px-3.5 py-2.5 rounded-2xl shadow-2xl cursor-pointer hover:border-[#FF2D8D] transition-all group"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF2D8D] to-[#FF65B2] flex items-center justify-center text-xs">
                🌸
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border border-[#14101B] rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#FF2D8D] transition-colors flex items-center gap-1">
                <span>Need help with outfit glue?</span>
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Chat on WhatsApp
              </p>
            </div>
            {/* Pointer arrow */}
            <div className="w-2.5 h-2.5 bg-[#1E1826] border-r border-t border-[#FF2D8D]/40 rotate-45 -mr-2" />
          </motion.div>
        )}

        {/* Main WhatsApp Toggle Button */}
        <motion.button
          id="floating-whatsapp-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            setUnreadCount(0);
          }}
          initial={{ opacity: 0, scale: 0.2, y: 45, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 15,
            mass: 0.8,
            delay: 0.6,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl cursor-pointer transition-all duration-300 bg-gradient-to-tr from-[#25D366] via-[#20BA56] to-[#128C7E] text-white p-0 border-2 border-emerald-300/40"
          aria-label="Toggle WhatsApp Chat"
        >
          {/* Animated Multiple Pulsing Rings */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] opacity-60 animate-ping group-hover:animate-none" />
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 blur-md group-hover:blur-lg transition-all" />

          {/* Unread Message Badge */}
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 14,
                delay: 1.1,
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF2D8D] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-lg border-2 border-[#121217] z-20"
            >
              1
            </motion.span>
          )}

          {/* Live Online Green Dot */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#121217] rounded-full z-20 shadow-sm" />

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
            )}
          </div>
        </motion.button>
      </div>

    </div>
  );
};
