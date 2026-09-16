import React from 'react';
import { Link } from 'react-router-dom';
import { Bundle } from '../types';
import { formatDriveImageUrl } from '../services/api';
import { Film, Sparkles, ArrowRight, CheckCircle2, Play, BarChart3 } from 'lucide-react';

interface BundleCardProps {
  bundle: Bundle;
  onQuickBuy?: (bundle: Bundle) => void;
}

export const BundleCard: React.FC<BundleCardProps> = ({ bundle, onQuickBuy }) => {
  const discountPercent =
    bundle.originalPrice && bundle.originalPrice > bundle.price
      ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
      : 0;

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 text-slate-800">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={formatDriveImageUrl(bundle.thumbnail)}
          alt={bundle.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = 'true';
              target.src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80';
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Pill & Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[70%]">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {bundle.category}
          </div>
          {bundle.previewVideo && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600 backdrop-blur-md text-[10px] font-bold text-white shadow">
              <Play className="w-2.5 h-2.5 fill-current" /> Demo
            </div>
          )}
          {bundle.dashboardScreenshots && bundle.dashboardScreenshots.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 backdrop-blur-md text-[10px] font-bold text-white shadow">
              <BarChart3 className="w-2.5 h-2.5" /> Proof
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs shadow-lg">
            {discountPercent}% OFF
          </div>
        )}

        {/* Clip Count & Resolution Strip */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
          <span className="flex items-center gap-1 font-bold text-white">
            <Film className="w-3.5 h-3.5 text-amber-300" />
            {bundle.clipCount}
          </span>
          <span className="text-gray-200 font-medium">{bundle.resolution}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/bundles/${bundle.id}`}>
          <h3 className="font-black text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-2">
            {bundle.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-grow">
          {bundle.description}
        </p>

        {/* Perks Checklist */}
        <div className="space-y-1 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Commercial Monetization Included</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Instant 10-Minute Secure Delivery</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">₹{bundle.price}</span>
              {bundle.originalPrice > bundle.price && (
                <span className="text-xs text-slate-400 line-through">₹{bundle.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">Lifetime Access</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/bundles/${bundle.id}`}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
              title="View Details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onQuickBuy && onQuickBuy(bundle)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
