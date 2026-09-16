import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Zap, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
      {/* Top Flash Sale Urgent Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <span className="bg-black/25 px-2 py-0.5 rounded-full uppercase text-[10px] tracking-wider animate-pulse">🔥 MEGA FLASH SALE</span>
        <span>5,000+ 4K Viral Reels Bundle Only <span className="underline decoration-amber-300 decoration-2 font-black">₹49</span> (Regular ₹999) • Instant Delivery</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors">
                CineVault
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                PRO 4K
              </span>
            </div>
            <p className="text-xs text-slate-500">Viral Reels & Creator Bundles</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/bundles" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Film className="w-4 h-4 text-purple-500" />
            Browse Bundles
          </Link>
          <a href="/#features" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Why CineVault
          </a>
          <a href="/#licensing" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Commercial Rights
          </a>
          <a href="/#faq" className="hover:text-purple-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Instant Access Guarantee Badge (NO customer login button!) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Instant 10-Min Delivery
          </div>

          <Link
            to="/bundles"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white text-sm font-bold shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Bundles
          </Link>
        </div>
      </div>
    </header>
  );
};
