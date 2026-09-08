import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, Sparkles, MessageSquarePlus, X, Check, Heart } from 'lucide-react';
import { REVIEWS } from '../data/reviews';
import { Review } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const RealReviews: React.FC = () => {
  const isBn = false;

  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewOutfit, setNewReviewOutfit] = useState('Saree Blouse & Party Dress');
  const [newReviewProduct, setNewReviewProduct] = useState('Bodybond Body Glue (20ml)');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleLike = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (activeFilter === '5-stars') return r.rating === 5;
    if (activeFilter === 'with-photos') return !!r.image;
    if (activeFilter === 'verified') return r.verifiedPurchase;
    return true;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewTitle || !newReviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      location: newReviewLocation || 'Dhaka, Bangladesh',
      rating: newReviewRating,
      title: newReviewTitle,
      comment: newReviewComment,
      date: 'Just now',
      verifiedPurchase: true,
      outfitWorn: newReviewOutfit,
      productName: newReviewProduct,
      likes: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsWriteModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewLocation('');
      setNewReviewTitle('');
      setNewReviewComment('');
    }, 1200);
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-gradient-to-b from-[#0E0B14] via-[#140F1E] to-[#0A080F] text-white relative overflow-hidden">
      {/* Soft feminine ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FF2D8D]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#F43F5E]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF2D8D]/15 border border-[#FF2D8D]/30 text-xs font-bold text-[#FF2D8D] tracking-widest uppercase shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#FF2D8D]" />
            <span>REAL CUSTOMER LOVE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Loved By Thousands of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D8D] via-[#FB7185] to-[#FDA4AF]">Confident Babes</span>
          </h2>
          
          <p className="text-sm sm:text-base text-pink-100/80 max-w-2xl mx-auto leading-relaxed">
            Read verified reviews from real women who put Bodybond to the test at weddings, parties, celebrations, and daily outings.
          </p>
        </div>

        {/* Rating Breakdown Dashboard Card */}
        <div className="bg-[#181324]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#FF2D8D]/25 shadow-[0_8px_32px_rgba(255,45,141,0.1)] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Overall Score */}
            <div className="md:col-span-4 text-center md:text-left space-y-2.5 border-b md:border-b-0 md:border-r border-pink-500/20 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  4.9
                </span>
                <span className="text-pink-300 font-bold text-sm">/ 5.0</span>
              </div>
              
              <div className="flex justify-center md:justify-start text-[#FF2D8D] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FF2D8D] text-[#FF2D8D]" />
                ))}
              </div>
              
              <p className="text-xs text-pink-200/70 font-medium">
                Based on 2,548+ Verified Reviews
              </p>
              
              <div className="text-[12px] text-emerald-400 font-bold flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>99.4% would recommend to a bestie</span>
              </div>
            </div>

            {/* Rating Bars */}
            <div className="md:col-span-5 space-y-2.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-14 font-semibold text-pink-100">5 Stars</span>
                <div className="flex-grow h-2.5 bg-[#251D35] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF2D8D] to-[#FB7185] rounded-full w-[95%]" />
                </div>
                <span className="w-10 text-right text-pink-300 font-bold">95%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 font-semibold text-pink-100">4 Stars</span>
                <div className="flex-grow h-2.5 bg-[#251D35] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF2D8D] to-[#FB7185] rounded-full w-[4%]" />
                </div>
                <span className="w-10 text-right text-pink-300 font-bold">4%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 font-semibold text-pink-100">3 Stars</span>
                <div className="flex-grow h-2.5 bg-[#251D35] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF2D8D] to-[#FB7185] rounded-full w-[1%]" />
                </div>
                <span className="w-10 text-right text-pink-300 font-bold">1%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 font-semibold text-pink-100">2 Stars</span>
                <div className="flex-grow h-2.5 bg-[#251D35] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF2D8D] to-[#FB7185] rounded-full w-[0%]" />
                </div>
                <span className="w-10 text-right text-pink-300 font-bold">0%</span>
              </div>
            </div>

            {/* Write Review CTA */}
            <div className="md:col-span-3 flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-xs font-bold text-pink-200">
                Have you tried Bodybond?
              </p>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-[#FF2D8D] to-[#E11D48] hover:from-[#ff4099] hover:to-[#f43f5e] text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-pink-900/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>

          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#FF2D8D] text-white shadow-md shadow-pink-900/40'
                : 'bg-[#181324] text-pink-200 border border-pink-500/20 hover:bg-pink-950/40'
            }`}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setActiveFilter('5-stars')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === '5-stars'
                ? 'bg-[#FF2D8D] text-white shadow-md shadow-pink-900/40'
                : 'bg-[#181324] text-pink-200 border border-pink-500/20 hover:bg-pink-950/40'
            }`}
          >
            ★ 5 Stars Only
          </button>
          <button
            onClick={() => setActiveFilter('with-photos')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'with-photos'
                ? 'bg-[#FF2D8D] text-white shadow-md shadow-pink-900/40'
                : 'bg-[#181324] text-pink-200 border border-pink-500/20 hover:bg-pink-950/40'
            }`}
          >
            📸 With Photos
          </button>
          <button
            onClick={() => setActiveFilter('verified')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'verified'
                ? 'bg-[#FF2D8D] text-white shadow-md shadow-pink-900/40'
                : 'bg-[#181324] text-pink-200 border border-pink-500/20 hover:bg-pink-950/40'
            }`}
          >
            🛡️ Verified Purchases
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#181324]/90 rounded-3xl p-6 border border-pink-500/20 shadow-md hover:border-[#FF2D8D]/50 hover:shadow-[0_4px_25px_rgba(255,45,141,0.15)] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Header author and stars */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FF2D8D] gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FF2D8D] text-[#FF2D8D]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-pink-300/70">{rev.date}</span>
                </div>

                {/* Review Title */}
                <h4 className="font-bold text-sm text-white leading-snug group-hover:text-[#FDA4AF] transition-colors">
                  {rev.title}
                </h4>

                {/* Comment */}
                <p className="text-xs text-pink-100/85 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Outfit tag */}
                {rev.outfitWorn && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-300">
                    <span>👗 Outfit:</span>
                    <span className="font-semibold text-white">{rev.outfitWorn}</span>
                  </div>
                )}

                {/* Optional Review Image */}
                {rev.image && (
                  <div className="rounded-2xl overflow-hidden aspect-video bg-[#251D35] mt-2 border border-pink-500/20">
                    <img
                      src={rev.image}
                      alt={rev.outfitWorn || 'Review Photo'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>{rev.author}</span>
                    {rev.verifiedPurchase && (
                      <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                        <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-400" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-pink-300/70">{rev.location}</p>
                </div>

                <button
                  onClick={() => handleLike(rev.id)}
                  className="flex items-center gap-1.5 text-[11px] text-pink-200/80 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  title="Helpful"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#FF2D8D]" />
                  <span>{rev.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181324] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#FF2D8D]/40 shadow-2xl relative text-white animate-in zoom-in-95">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white cursor-pointer p-1 rounded-full bg-pink-500/10 hover:bg-pink-500/20"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedMessage ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Thank you! Your review has been added.
                </h3>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    Share Your Review
                  </h3>
                  <p className="text-xs text-pink-200/70">
                    Help other girls find their perfect match
                  </p>
                </div>

                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-pink-100 block">Rating *</label>
                  <div className="flex gap-1 text-[#FF2D8D]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReviewRating ? 'fill-[#FF2D8D] text-[#FF2D8D]' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-pink-100 block">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nusrat Jahan"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#251D35] border border-pink-500/30 rounded-xl text-white placeholder:text-pink-300/40 focus:outline-none focus:border-[#FF2D8D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-pink-100 block">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dhanmondi, Dhaka"
                      value={newReviewLocation}
                      onChange={(e) => setNewReviewLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#251D35] border border-pink-500/30 rounded-xl text-white placeholder:text-pink-300/40 focus:outline-none focus:border-[#FF2D8D]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-pink-100 block">Outfit Worn</label>
                  <input
                    type="text"
                    placeholder="e.g. Deep Back Saree Blouse / Lehenga"
                    value={newReviewOutfit}
                    onChange={(e) => setNewReviewOutfit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#251D35] border border-pink-500/30 rounded-xl text-white placeholder:text-pink-300/40 focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-pink-100 block">Review Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stayed secure all night!"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#251D35] border border-pink-500/30 rounded-xl text-white placeholder:text-pink-300/40 focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-pink-100 block">Detailed Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share how long it lasted, sweat resistance, and skin comfort..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#251D35] border border-pink-500/30 rounded-xl text-white placeholder:text-pink-300/40 focus:outline-none focus:border-[#FF2D8D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF2D8D] to-[#E11D48] hover:from-[#ff4099] hover:to-[#f43f5e] text-white text-xs font-bold tracking-wider uppercase rounded-2xl transition-all cursor-pointer shadow-lg shadow-pink-900/40"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
