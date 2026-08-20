"use client";

import { useEffect, useState } from 'react';
import { QrCode, Sparkles, Monitor, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onCreateClick: () => void;
}

export default function Header({ onCreateClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const img = new Image();
    img.src = "/logo.png";
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        const isWhite = (x: number, y: number) => {
          const idx = (y * width + x) * 4;
          return data[idx] > 220 && data[idx + 1] > 220 && data[idx + 2] > 220 && data[idx + 3] > 0;
        };

        const pushPixel = (x: number, y: number) => {
          const key = y * width + x;
          if (!visited[key]) {
            visited[key] = 1;
            queue.push(key);
          }
        };

        // Seed borders
        for (let x = 0; x < width; x++) {
          if (isWhite(x, 0)) pushPixel(x, 0);
          if (isWhite(x, height - 1)) pushPixel(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          if (isWhite(0, y)) pushPixel(0, y);
          if (isWhite(width - 1, y)) pushPixel(width - 1, y);
        }

        // BFS flood fill
        let head = 0;
        while (head < queue.length) {
          const key = queue[head++];
          const x = key % width;
          const y = Math.floor(key / width);
          const idx = key * 4;
          data[idx + 3] = 0;

          if (x > 0 && isWhite(x - 1, y)) pushPixel(x - 1, y);
          if (x < width - 1 && isWhite(x + 1, y)) pushPixel(x + 1, y);
          if (y > 0 && isWhite(x, y - 1)) pushPixel(x, y - 1);
          if (y < height - 1 && isWhite(x, y + 1)) pushPixel(x, y + 1);
        }

        ctx.putImageData(imgData, 0, 0);
        setLogoSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Failed to process logo transparency:', err);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Initial theme detection
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src={logoSrc} 
            alt="Qrafter Studio" 
            className="h-15 w-auto object-contain transition-transform hover:scale-[1.02] dark:drop-shadow-[0_0_1.5px_rgba(255,255,255,0.85)]" 
          />
          {/* <div className="hidden sm:flex flex-col">
            <span className="font-bold text-slate-850 dark:text-white text-sm tracking-wide leading-none">Free QR Generator</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Qrafter Studio</span>
          </div> */}
        </div>

        {/* Badge */}
        {/* <div className="hidden md:flex items-center">
          <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-900/30 shadow-sm flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>No Registration Required</span>
          </span>
        </div> */}

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <button
            onClick={onCreateClick}
            className="relative inline-flex items-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] hover:shadow-lg dark:hover:shadow-white/5 shadow-slate-950/10 group cursor-pointer"
          >
            <span>Create My QR</span>
            <Sparkles className="w-4 h-4 text-blue-400 dark:text-violet-600 animate-pulse group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
