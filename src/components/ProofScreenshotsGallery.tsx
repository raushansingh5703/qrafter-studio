import React, { useState } from 'react';
import { BarChart3, CheckCircle2, ZoomIn, X, ShieldCheck, TrendingUp } from 'lucide-react';

interface ProofScreenshotsGalleryProps {
  screenshots: string[];
  title?: string;
}

export const ProofScreenshotsGallery: React.FC<ProofScreenshotsGalleryProps> = ({
  screenshots,
  title = 'Verified Channel Results',
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xl shadow-slate-200/60 p-6 sm:p-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Social Proof & Analytics
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Verified Channel Results & Growth Proof
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real YouTube Studio dashboard statistics, impressions, and viral reach generated with these reel packages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> Viral Retention
          </span>
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Monetization Safe
          </span>
        </div>
      </div>

      {/* Screenshots Grid */}
      <div
        className={`grid gap-4 ${
          screenshots.length === 1
            ? 'grid-cols-1 max-w-2xl mx-auto'
            : screenshots.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {screenshots.map((url, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(url)}
            className="group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-emerald-500 shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={url}
                alt={`${title} Proof ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
                }}
              />
            </div>

            {/* Overlay button on hover */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <span className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xl">
                <ZoomIn className="w-4 h-4 text-emerald-600" />
                Click to Enlarge Full Proof
              </span>
            </div>

            {/* Bottom Caption badge */}
            <div className="p-3 bg-[#0c0e14] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Analytics Screenshot #{idx + 1}
              </span>
              <span className="text-gray-500 font-mono text-[10px]">YouTube Studio</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
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
              title="Close Full View"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl max-h-[85vh] flex items-center justify-center">
              <img
                src={activeImage}
                alt="Full Resolution Proof"
                referrerPolicy="no-referrer"
                className="max-h-[85vh] max-w-full object-contain"
              />
            </div>

            <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Resolution YouTube Studio Dashboard Analytics</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
