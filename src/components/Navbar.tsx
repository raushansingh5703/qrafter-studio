import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Zap, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/90 backdrop-blur-xl">
      {/* Top Flash Sale Urgent Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <span className="bg-black/30 px-2 py-0.5 rounded-full uppercase text-[10px] tracking-wider animate-pulse">🔥 MEGA FLASH SALE</span>
        <span>5,000+ 4K Viral Reels Bundle Only <span className="underline decoration-amber-300 decoration-2 font-black">₹49</span> (Regular ₹999) • Instant Delivery</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                CineVault
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO 4K
              </span>
            </div>
            <p className="text-xs text-gray-400">Viral Reels & Video Assets</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link to="/bundles" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Film className="w-4 h-4 text-purple-400" />
            Browse Bundles
          </Link>
          <a href="/#features" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Why CineVault
          </a>
          <a href="/#licensing" className="hover:text-white transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Commercial Rights
          </a>
          <a href="/#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Instant Access Guarantee Badge (NO customer login button!) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Instant 10-Min Delivery
          </div>

          <Link
            to="/bundles"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Bundles
          </Link>
        </div>
      </div>
    </header>
  );
};
