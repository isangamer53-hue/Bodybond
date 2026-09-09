import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const TikTokReels: React.FC = () => {
  const { addToCart, setQuickViewProduct } = useCart();
  const [playingVideoId, setPlayingVideoId] = useState<string | null>('reel-1');
  const [isMuted, setIsMuted] = useState(true);

  const reels = [
    {
      id: 'reel-1',
      author: '@chloe.nz',
      views: '1.4M views',
      title: 'Testing the viral Bodybond glue on my plunging silk cowl back dress 👗✨',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
      productId: 'bodybond-glue',
      likes: '94.2K',
    },
    {
      id: 'reel-2',
      author: '@sienna.styles',
      views: '890K views',
      title: 'Wait these seamless nips look SO invisible under a sheer baby tee?! 😭🖤',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      productId: 'bodybond-nips-seamless',
      likes: '62.8K',
    },
    {
      id: 'reel-3',
      author: '@maddi_melb',
      views: '2.1M views',
      title: 'Throwing away every roll of fashion tape I own. Bodybond is the GOAT.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      productId: 'bodybond-glue',
      likes: '145K',
    },
    {
      id: 'reel-4',
      author: '@tahlia_goldcoast',
      views: '640K views',
      title: 'Sweat test: 30°C club night on the Gold Coast with a strapless bandeau 💃',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      productId: 'bodybond-glue',
      likes: '48.1K',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#E8E1D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F3EDE6] text-xs font-bold text-[#E27D60] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real UGC Moments</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1A1817] font-normal">
              As Seen On <span className="italic">TikTok & Instagram</span>
            </h2>
            <p className="text-sm text-[#6B635C]">
              Join over 10,000+ girls who test, review, and trust Bodybond for every big night out.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1817]">#Bodybond #WardrobeHack</span>
          </div>
        </div>

        {/* Video Reel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel) => {
            const product = PRODUCTS.find((p) => p.id === reel.productId) || PRODUCTS[0];
            const isPlaying = playingVideoId === reel.id;

            return (
              <div
                key={reel.id}
                className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-lg border border-[#E2DAD0] flex flex-col justify-between p-4 cursor-pointer"
                onClick={() => setPlayingVideoId(isPlaying ? null : reel.id)}
              >
                {/* Background Image / Video simulation */}
                <img
                  src={reel.image}
                  alt={reel.title}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105 filter brightness-95' : 'group-hover:scale-105 opacity-80'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

                {/* Top bar in Reel */}
                <div className="relative z-10 flex items-center justify-between text-white text-xs">
                  <span className="font-bold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px]">
                    {reel.views}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Center Play indicator */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className={`w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 transition-transform ${
                    isPlaying ? 'scale-90 opacity-60' : 'group-hover:scale-110'
                  }`}>
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </div>
                </div>

                {/* Bottom Content & Product Link */}
                <div className="relative z-10 space-y-2.5 text-white">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#E27D60]">{reel.author}</p>
                    <p className="text-xs font-medium line-clamp-2 leading-snug">{reel.title}</p>
                  </div>

                  {/* Product Mini Tag */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/95 backdrop-blur-md text-[#1A1817] text-xs hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <span className="font-bold truncate text-[11px]">{product.name}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#E27D60] uppercase ml-1 flex-shrink-0">
                      Shop
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
