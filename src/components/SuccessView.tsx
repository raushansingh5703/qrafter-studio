"use client";

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { QRDesign } from '../types/qr';
import { convertSVGToPNG } from '../utils/qrEngine';

interface SuccessViewProps {
  unifiedSvg: string;
  design: QRDesign;
  onCreateAnother: () => void;
}

export default function SuccessView({ unifiedSvg, design, onCreateAnother }: SuccessViewProps) {
  const [downloadingPNG, setDownloadingPNG] = useState(false);

  // Trigger confetti explosion on success load
  useEffect(() => {
    // Fire a beautiful custom confetti pattern
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563eb', '#7c3aed', '#10b981']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563eb', '#7c3aed', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  // Determine width/height from design frame settings to compute aspect canvas
  const getCanvasDimensions = () => {
    switch (design.frame.style) {
      case 'border':
        return { width: 1100, height: 1100 };
      case 'rounded':
        return { width: 1120, height: 1120 };
      case 'bottom-label':
        return { width: 1100, height: 1350 };
      case 'scan-me':
        return { width: 1100, height: 1380 };
      case 'badge':
        return { width: 1100, height: 1500 };
      case 'modern':
        return { width: 1100, height: 1450 };
      default:
        return { width: 1000, height: 1000 };
    }
  };

  const handleDownloadSVG = () => {
    try {
      const blob = new Blob([unifiedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrafter_${design.type}_qr.svg`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download SVG:', err);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      setDownloadingPNG(true);
      const { width, height } = getCanvasDimensions();
      
      // Use scale = 3 for 300 DPI printing equivalent size
      const pngDataUrl = await convertSVGToPNG(unifiedSvg, width, height, 3);
      
      const link = document.createElement('a');
      link.href = pngDataUrl;
      link.download = `qrafter_${design.type}_qr.png`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download PNG:', err);
      alert('Error generating PNG. Try downloading the SVG vector format.');
    } finally {
      setDownloadingPNG(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Checkmark Banner */}
      <div className="flex flex-col items-center space-y-3">
        <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-full border border-emerald-500/20 shadow-md animate-[bounce_1.5s_infinite]">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold font-outfit text-slate-850 dark:text-white">
            Payment Successful!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your premium, print-ready QR codes are compiled and ready.
          </p>
        </div>
      </div>

      {/* QR Output Preview */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-xl max-w-[280px] w-full aspect-square flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full select-none">
          <div
            className="w-full h-full max-w-[240px] max-h-[240px] flex items-center justify-center drop-shadow-sm [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: unifiedSvg }}
          />
        </div>
      </div>

      {/* Buttons Options */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadSVG}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-violet-500" />
            <span>Download SVG</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={downloadingPNG}
            className="bg-slate-900 dark:bg-white hover:bg-slate-850 dark:hover:bg-slate-100 text-white dark:text-slate-950 py-3 px-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {downloadingPNG ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Compiling 300DPI...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-blue-500" />
                <span>Download PNG</span>
              </>
            )}
          </button>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-2">
          <button
            onClick={onCreateAnother}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-500/10 text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2 cursor-pointer transition-transform active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>Create Another QR Code</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
