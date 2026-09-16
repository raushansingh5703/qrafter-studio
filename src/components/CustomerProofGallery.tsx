import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, ZoomIn, X, Star, Zap, Sparkles, Heart } from 'lucide-react';

interface CustomerProofGalleryProps {
  screenshots: string[];
  title?: string;
  price?: number;
  onBuyNow?: () => void;
}

export const CustomerProofGallery: React.FC<CustomerProofGalleryProps> = ({
  screenshots,
  title = 'Customer Testimonials & Chat Reviews',
  price,
  onBuyNow,
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#11131a] to-[#0c0e17] border border-cyan-500/20 overflow-hidden shadow-2xl p-6 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            Verified Buyer Reviews & Feedback
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>CUSTOMER PROOF 🧾 👇</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real WhatsApp chats, direct messages, and channel growth feedback sent by customers who downloaded this pack.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30 text-xs text-cyan-300 font-bold">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="ml-1">4.9 / 5.0 Rating</span>
          </div>
        </div>
      </div>

      {/* Screenshots Grid */}
      <div
        className={`grid gap-4 ${
          screenshots.length === 1
            ? 'grid-cols-1 max-w-xl mx-auto'
            : screenshots.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : screenshots.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {screenshots.map((url, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(url)}
            className="group relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 hover:border-cyan-500/60 shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10"
          >
            <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-black/80">
              <img
                src={url}
                alt={`${title} Customer Chat ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
                }}
              />
            </div>

            {/* Hover overlay button */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
              <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-cyan-400/40 shadow-xl">
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                Read Full Chat / Review
              </span>
            </div>

            {/* Bottom Tag */}
            <div className="p-2.5 bg-[#0b0e17] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1 font-semibold text-cyan-400">
                <CheckCircle2 className="w-3 h-3" /> WhatsApp / DM #{idx + 1}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <Heart className="w-3 h-3 fill-current text-pink-500" /> Verified Buyer
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action CTA Bar */}
      {onBuyNow && (
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Join hundreds of happy creators scaling daily
            </span>
            <p className="text-xs text-gray-400">
              Instant 10-minute download link delivered to your email right after payment.
            </p>
          </div>

          <button
            onClick={onBuyNow}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>Get Instant Access {price ? `(₹${price})` : ''}</span>
          </button>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-10 p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              title="Close View"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-2xl max-h-[85vh] flex items-center justify-center">
              <img
                src={activeImage}
                alt="Full Customer Review Screenshot"
                referrerPolicy="no-referrer"
                className="max-h-[85vh] max-w-full object-contain"
              />
            </div>

            <p className="text-xs text-cyan-300 mt-3 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Full Resolution Verified Customer Feedback & WhatsApp Chat</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
