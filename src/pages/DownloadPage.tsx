import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DownloadSessionData } from '../types';
import { getDownloadSession, getDownloadUrl, formatDriveImageUrl } from '../services/api';
import {
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  HardDrive,
  Film,
  Lock,
  Layers,
  HelpCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const [sessionData, setSessionData] = useState<DownloadSessionData | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasStartedDownload, setHasStartedDownload] = useState(false);

  const timerRef = useRef<any>(null);

  // Fetch session status strictly from server
  const loadSession = () => {
    if (!sessionId) {
      setError('No session token provided in URL.');
      setLoading(false);
      return;
    }

    getDownloadSession(sessionId)
      .then((data) => {
        if (!data.valid) {
          setError(data.message || 'Your download session has expired or is invalid.');
          setSessionData(data);
          setLoading(false);
          return;
        }

        setSessionData(data);
        setRemainingSeconds(data.remainingSeconds);
        setLoading(false);

        // Calculate exact target finish based strictly on server's remaining seconds
        const targetExpiryTimestamp = Date.now() + data.remainingSeconds * 1000;

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
          const secondsLeft = Math.max(0, Math.floor((targetExpiryTimestamp - Date.now()) / 1000));
          setRemainingSeconds(secondsLeft);

          if (secondsLeft <= 0) {
            clearInterval(timerRef.current);
          }
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to contact download session verification server.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSession();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId]);

  const handleStartDownload = () => {
    if (!sessionId) return;
    setIsDownloading(true);
    setHasStartedDownload(true);

    const downloadLink = getDownloadUrl(sessionId);

    // Direct browser redirect/trigger to streaming server endpoint
    window.location.href = downloadLink;

    setTimeout(() => {
      setIsDownloading(false);
    }, 4000);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = remainingSeconds <= 0;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center min-h-screen">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Verifying Payment & Download Session...</h2>
          <p className="text-slate-500 text-xs">Authenticating token with secure Firestore vault...</p>
        </div>
      </div>
    );
  }

  if (isExpired || (sessionData && !sessionData.valid && sessionData.status === 'expired')) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 min-h-screen text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-rose-200 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-3">Your download session has expired.</h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
            For security, temporary download sessions remain active for exactly 10 minutes following purchase.
            The server has closed new access requests for this token.
          </p>

          {sessionData?.orderId && (
            <div className="inline-block p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 mb-8 font-mono">
              Order Reference ID: <span className="text-slate-900 font-bold">{sessionData.orderId}</span>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/bundles"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all"
            >
              Browse Other Bundles
            </Link>
            <p className="text-xs text-slate-400 mt-4">
              Need assistance? Email support with your Order Reference ID.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center min-h-screen">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Session Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'Could not verify download access.'}</p>
          <Link
            to="/bundles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-md transition-colors"
          >
            Back to Bundles
          </Link>
        </div>
      </div>
    );
  }

  const { bundle } = sessionData;
  const timerPercentage = Math.max(0, Math.min(100, (remainingSeconds / 600) * 100));

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-slate-900">
      {/* 1. Payment Success & Security Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-purple-50 border-2 border-emerald-500/80 mb-8 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Payment Successful!</h1>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Your secure download session is active for 10 minutes. Click below to start downloading.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 font-mono">
            <div>Order: <span className="text-slate-900 font-bold">{sessionData.orderId}</span></div>
            <div className="text-emerald-700 font-bold">Encrypted Token</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Download Countdown & Stream Action */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50">
            {/* Real-Time Server Synced Countdown */}
            <div className="text-center mb-6">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Download access window:
              </span>

              {/* Animated Countdown Clock */}
              <div className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10">
                <Clock className={`w-8 h-8 ${remainingSeconds < 120 ? 'text-pink-400 animate-pulse' : 'text-amber-400'}`} />
                <span className={`text-4xl sm:text-5xl font-mono font-black tracking-widest ${
                  remainingSeconds < 120 ? 'text-pink-400' : 'text-white'
                }`}>
                  {formatTime(remainingSeconds)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-1000 ${
                    remainingSeconds < 120 ? 'bg-pink-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                Refreshing this page will restore your remaining time without resetting the clock.
              </p>
            </div>

            {/* Download CTA Button */}
            <div className="space-y-3">
              <button
                onClick={handleStartDownload}
                disabled={isExpired || isDownloading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Secure File Stream...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-white" />
                    <span>Download Video Bundle Now</span>
                  </>
                )}
              </button>

              {/* Active Stream Note */}
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
                <span>
                  <strong>Active Transfer Protection:</strong> If your download begins before the 10-minute timer expires, your active transfer will NOT be interrupted.
                </span>
              </div>
            </div>

            {hasStartedDownload && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Download requested. Check your browser's download manager for progress.</span>
              </div>
            )}
          </div>

          {/* Tips for extracting */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Extraction Instructions
            </h4>
            <p>1. The bundle is delivered as a high-speed compressed <strong className="text-slate-900">.zip</strong> archive.</p>
            <p>2. Double-click the downloaded file or right-click and select <strong className="text-slate-900">"Extract All"</strong> on Windows, or double-click to unzip on Mac.</p>
            <p>3. If downloading to an iPhone or Android, save to your device's "Files" or "Downloads" manager before unzipping.</p>
          </div>
        </div>

        {/* Right Column: Bundle Card & Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-slate-200 shadow-sm">
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
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                {bundle.category}
              </div>
            </div>

            <h3 className="font-black text-base text-slate-900 mb-2">{bundle.title}</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">{bundle.description}</p>

            <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Clips Included:</span>
                <span className="font-bold text-slate-900">{bundle.clipCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Master Resolution:</span>
                <span className="font-bold text-slate-900">{bundle.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Archive Size:</span>
                <span className="font-bold text-slate-900">{bundle.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commercial License:</span>
                <span className="font-bold text-emerald-700">Lifetime Universal</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-[11px] text-slate-500 mb-2">Saved a copy of your purchase?</p>
            <Link
              to="/bundles"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
            >
              Explore more creator packs <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
