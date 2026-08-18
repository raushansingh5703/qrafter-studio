"use client";

import { useEffect, useState } from 'react';
import { QrCode, Lock, Zap, FileCode } from 'lucide-react';

export default function Footer() {
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png');

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

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logoSrc} 
                alt="Qrafter Studio Logo" 
                className="h-13 w-auto object-contain dark:drop-shadow-[0_0_1.5px_rgba(255,255,255,0.85)]" 
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Create and customize premium high-quality QR codes for your business in seconds. No registration required. Download vector-grade SVG and HD PNGs instantly.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Core Values</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Stateless &amp; Private</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Zap className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Zero Account Setup</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Vector Print SVG</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Pricing</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-white">Free</span>: Design, live previews, and camera test scans.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">₹1 one-time</span>: Full vector SVG, 300 DPI high-res PNG, no watermarks.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Qrafter Studio. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
