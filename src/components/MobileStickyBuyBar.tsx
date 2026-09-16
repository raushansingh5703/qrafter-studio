import React from 'react';
import { Bundle } from '../types';
import { formatDriveImageUrl } from '../services/api';
import { Zap, ShieldCheck, Clock } from 'lucide-react';

interface MobileStickyBuyBarProps {
  bundle: Bundle | null;
  onBuy: (bundle: Bundle) => void;
}

export const MobileStickyBuyBar: React.FC<MobileStickyBuyBarProps> = ({ bundle, onBuy }) => {
  if (!bundle) return null;

  const discountPercent =
    bundle.originalPrice && bundle.originalPrice > bundle.price
      ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
      : 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e17]/95 backdrop-blur-xl border-t border-purple-500/30 px-4 py-3 shadow-[0_-10px_25px_-5px_rgba(147,51,234,0.3)] animate-slideUp">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Bundle Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={formatDriveImageUrl(bundle.thumbnail)}
            alt={bundle.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80';
            }}
            className="w-11 h-11 rounded-xl object-cover border border-purple-500/40 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-black text-white truncate">{bundle.title}</h4>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-white">₹{bundle.price}</span>
              {bundle.originalPrice > bundle.price && (
                <span className="text-[11px] text-gray-400 line-through">₹{bundle.originalPrice}</span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-pink-400 bg-pink-950/60 px-1.5 py-0.2 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={() => onBuy(bundle)}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-purple-600/40 flex items-center gap-1.5 active:scale-95 animate-pulse"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-current" />
          <span>BUY ₹{bundle.price}</span>
        </button>
      </div>
    </div>
  );
};
