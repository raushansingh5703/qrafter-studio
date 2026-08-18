"use client";

import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
}

export default function QRScannerModal({ onClose }: QRScannerModalProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5Qrcode: Html5Qrcode | null = null;
    const scannerId = "scanner-reader";

    const initScanner = async () => {
      try {
        html5Qrcode = new Html5Qrcode(scannerId);
        setIsScanning(true);

        await html5Qrcode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            }
          },
          (decodedText) => {
            setScanResult(decodedText);
            setIsScanning(false);
            html5Qrcode?.stop().catch((err) => console.error("Failed to stop scanner", err));
          },
          () => {
            // Error callback can be verbose, ignore normal frames seeking QRs
          }
        );
      } catch (err: any) {
        console.error("Camera scan start error:", err);
        setError("Camera permission denied or camera not found. Please allow access to test scan.");
        setIsScanning(false);
      }
    };

    // Delay initialization slightly to let DOM compile completely
    const startTimer = setTimeout(() => {
      initScanner();
    }, 500);

    return () => {
      clearTimeout(startTimer);
      if (html5Qrcode && html5Qrcode.isScanning) {
        html5Qrcode.stop().catch((e) => console.error("Error clean stopping scanner", e));
      }
    };
  }, []);

  const handleCopy = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-850 dark:text-white font-outfit">Camera Test Scan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          {!scanResult && !error && (
            <div className="relative w-full max-w-[280px] aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800">
              <div id="scanner-reader" className="w-full h-full" />
              
              {/* Animated laser alignment guide */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
                  {/* Corners */}
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-4 border-l-4 border-blue-500 rounded-tl" />
                    <div className="w-5 h-5 border-t-4 border-r-4 border-blue-500 rounded-tr" />
                  </div>
                  
                  {/* Moving line */}
                  <div className="w-full h-0.5 bg-blue-500/80 shadow-md shadow-blue-500 animate-[bounce_2.5s_infinite]" />
                  
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-4 border-l-4 border-blue-500 rounded-bl" />
                    <div className="w-5 h-5 border-b-4 border-r-4 border-blue-500 rounded-br" />
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-start space-x-3 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Access Issue</p>
                <p className="mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="w-full space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center space-x-3 text-xs font-semibold">
                <Check className="w-5 h-5 shrink-0" />
                <span>QR scanned successfully!</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scanned Raw Payload</label>
                <div className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-650 dark:text-slate-350 break-all select-all max-h-[140px] overflow-y-auto">
                  {scanResult}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                {scanResult.startsWith('http') && (
                  <a
                    href={scanResult}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <span>Open URL</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <span>Copied!</span>
                      <Check className="w-4 h-4 text-emerald-500" />
                    </>
                  ) : (
                    <>
                      <span>Copy Payload</span>
                      <Copy className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {!scanResult && !error && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center max-w-[240px]">
              Align the QR code on your desktop screen or printed sheet in front of the camera viewport.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
