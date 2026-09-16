import React, { useState, useEffect } from 'react';
import { Flame, X, CheckCircle2, ShoppingBag } from 'lucide-react';

const RECENT_BUYERS = [
  { name: 'Raushan', city: 'Patna', pack: 'BhaiLOLogy 5000+ Viral Reels', time: '2 mins ago' },
  { name: 'Aman Sharma', city: 'Delhi', pack: 'BhaiLOLogy 5000+ Viral Reels', time: '4 mins ago' },
  { name: 'Priya K.', city: 'Mumbai', pack: '4K Viral Instagram Pack', time: '7 mins ago' },
  { name: 'Vikram S.', city: 'Jaipur', pack: 'BhaiLOLogy 5000+ Viral Reels', time: '11 mins ago' },
  { name: 'Deepak Roy', city: 'Kolkata', pack: 'BhaiLOLogy 5000+ Viral Reels', time: '14 mins ago' },
  { name: 'Rahul V.', city: 'Bengaluru', pack: '4K High-Retention Reels', time: '18 mins ago' },
];

export const RecentPurchaseToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Initial delay before first toast
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Interval to cycle through notifications
    const cycleInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_BUYERS.length);
        setVisible(true);
      }, 1000);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = RECENT_BUYERS[currentIndex];

  return (
    <div className="hidden sm:flex fixed bottom-5 left-5 z-40 max-w-sm rounded-2xl bg-white/95 border border-slate-200/90 p-3.5 shadow-2xl backdrop-blur-md items-center gap-3 animate-slideIn text-slate-800">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-600/25">
        <ShoppingBag className="w-5 h-5" />
      </div>

      <div className="min-w-0 flex-grow pr-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold">
          <span className="text-purple-700 font-extrabold">{current.name}</span>
          <span className="text-slate-500 font-normal">from {current.city}</span>
        </div>
        <p className="text-[11px] text-emerald-700 font-bold truncate flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Purchased {current.pack}
        </p>
        <span className="text-[10px] text-slate-400">{current.time} • Verified Buyer</span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
