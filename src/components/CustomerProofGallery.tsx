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
    <div className="rounded-3xl bg-white border border-cyan-200/80 overflow-hidden shadow-xl shadow-cyan-500/5 p-6 sm:p-8 text-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-black uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            Verified Buyer Reviews & Feedback
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>CUSTOMER PROOF 🧾 👇</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real WhatsApp chats, direct messages, and channel growth feedback sent by customers who downloaded this pack.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 text-xs text-amber-800 font-extrabold shadow-sm">
            <div className="flex text-amber-500">
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
            className="group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-cyan-500 shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-100">
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
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xl">
                <ZoomIn className="w-3.5 h-3.5 text-cyan-600" />
                Read Full Chat / Review
              </span>
            </div>

            {/* Bottom Tag */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-bold text-cyan-700">
                <CheckCircle2 className="w-3 h-3 text-cyan-600" /> WhatsApp / DM #{idx + 1}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <Heart className="w-3 h-3 fill-current text-pink-500" /> Verified Buyer
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action CTA Bar */}
      {onBuyNow && (
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-cyan-50 via-blue-50/50 to-purple-50 border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-slate-900 font-extrabold text-sm sm:text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" /> Join hundreds of happy creators scaling daily
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant 10-minute download link delivered to your email right after payment.
            </p>
          </div>

          <button
            onClick={onBuyNow}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>Get Bundle Now {price ? `(₹${price})` : ''}</span>
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
