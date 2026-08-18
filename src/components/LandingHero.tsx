"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface LandingHeroProps {
  onStartClick: () => void;
}

const marketingMessages = [
  "Get More Google Reviews ⭐",
  "Make Payments Easier 💳",
  "Share Your Menu Instantly 🍽️",
  "Connect With Customers 💬",
  "Turn Every Scan Into an Experience 🚀"
];

export default function LandingHero({ onStartClick }: LandingHeroProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [count, setCount] = useState(99450);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % marketingMessages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const end = 100000;
    const start = 99450;
    const duration = 2000; // 2 seconds

    let animationFrameId: number;
    let liveInterval: NodeJS.Timeout;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setCount(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        // Once 100,000 is reached, tick upwards randomly every 4-5 seconds
        liveInterval = setInterval(() => {
          setCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
        }, 4000);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (liveInterval) clearInterval(liveInterval);
    };
  }, []);


  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left side texts */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-blue-100/50 dark:border-blue-900/30">
            <span>No Account Required</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit leading-tight">
              Create QR Codes That <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Look Amazing
              </span>
            </h1>

            {/* Rotating text */}
            <div className="h-10 sm:h-12 relative flex items-center justify-center lg:justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={msgIndex}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="text-lg sm:text-2xl font-semibold text-slate-700 dark:text-slate-350 font-outfit"
                >
                  {marketingMessages[msgIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Design, customize, and generate professional branded QR codes for your business in seconds. Edit patterns, eyes, custom gradients, frames, and embed logos. Download vector PDF/SVG and high-res print outputs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Create My QR</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Explore QR Types
            </button>
          </div>

          {/* Animated live counter badge */}
          <div className="flex items-center justify-center lg:justify-start pt-2">
            <div className="inline-flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200/50 dark:border-slate-850 shadow-sm animate-[fadeIn_0.5s_ease-out]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-lg font-extrabold font-outfit bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent min-w-[70px] text-center">
                {count.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                QR Codes Created Live
              </span>
            </div>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Free Dynamic Preview</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Stateless &amp; Private</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <QrCode className="w-4 h-4 text-violet-500" />
              <span>Vector Print SVG Output</span>
            </div>
          </div>
        </div>

        {/* Right side animated floating QR cards */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-10 lg:mt-0">
          <div className="w-[320px] sm:w-[360px] h-[360px] relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-3xl rotate-6 blur-lg opacity-25" />

            {/* Main Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between items-center"
            >
              <div className="flex justify-between items-center w-full border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <span className="text-xs font-semibold text-slate-400">Design Studio</span>
              </div>

              {/* Mock QR graphic in hero */}
              <div className="w-48 h-48 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-3 relative border border-slate-100 dark:border-slate-900">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-850 dark:fill-slate-150">
                  {/* Outer Eyes */}
                  <rect x="5" y="5" width="25" height="25" rx="5" stroke="url(#heroGrad)" strokeWidth="6" fill="none" />
                  <rect x="13" y="13" width="9" height="9" rx="2" fill="url(#heroGrad)" />

                  <rect x="70" y="5" width="25" height="25" rx="5" stroke="url(#heroGrad)" strokeWidth="6" fill="none" />
                  <rect x="78" y="13" width="9" height="9" rx="2" fill="url(#heroGrad)" />

                  <rect x="5" y="70" width="25" height="25" rx="5" stroke="url(#heroGrad)" strokeWidth="6" fill="none" />
                  <rect x="13" y="78" width="9" height="9" rx="2" fill="url(#heroGrad)" />

                  {/* Random dots representing QR pattern */}
                  <rect x="40" y="5" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="50" y="5" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="40" y="20" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="55" y="25" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="5" y="45" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="15" y="55" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="25" y="45" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="80" y="45" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="70" y="55" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="90" y="55" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="40" y="80" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="55" y="75" width="6" height="6" rx="2" fill="url(#heroGrad)" />
                  <rect x="90" y="80" width="6" height="6" rx="2" fill="url(#heroGrad)" />

                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Central Brand Logo Placeholder */}
                <div className="absolute w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center p-1.5 shadow-md">
                  <QrCode className="w-full h-full text-blue-600 dark:text-violet-500" />
                </div>
              </div>

              {/* Sub-label banner */}
              <div className="w-full bg-slate-900 dark:bg-slate-800 text-white py-2 px-4 rounded-xl text-center text-xs font-semibold tracking-wider font-outfit uppercase">
                SCAN &amp; EXPLORE
              </div>
            </motion.div>

            {/* Small decorative floating card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 shadow-lg flex items-center space-x-3"
            >
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-outfit">✓ Highly Scannable</p>
                <p className="text-[10px] text-slate-400">Contrast Ratio: 12.4:1</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
