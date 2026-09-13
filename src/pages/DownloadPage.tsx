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
        console.error('Session fetch error:', err);
        setError('Failed to contact download verification server.');
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

    // Direct stream download trigger via Cloud Functions endpoint
    const downloadUrl = getDownloadUrl(sessionId);
    const downloadWindow = document.createElement('a');
    downloadWindow.href = downloadUrl;
    downloadWindow.setAttribute('download', '');
    document.body.appendChild(downloadWindow);
    downloadWindow.click();
    document.body.removeChild(downloadWindow);

    // Provide friendly state indicator for download transfer
    setTimeout(() => {
      setIsDownloading(false);
    }, 4000);
  };

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Authenticating secure download session...</p>
      </div>
    );
  }

  // Session Expired State
  const isExpired =
    (remainingSeconds <= 0 && !isDownloading) ||
    sessionData?.expired === true ||
    sessionData?.status === 'expired';

  if (isExpired) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 min-h-screen text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#11131a] border border-rose-500/30 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-black text-white mb-3">Your download session has expired.</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-6">
            For security, temporary download sessions remain active for exactly 10 minutes following purchase.
            The server has closed new access requests for this token.
          </p>

          {sessionData?.orderId && (
            <div className="inline-block p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-400 mb-8 font-mono">
              Order Reference ID: <span className="text-white font-bold">{sessionData.orderId}</span>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/bundles"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
            >
              Browse Other Bundles
            </Link>
            <p className="text-xs text-gray-500 mt-4">
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
        <div className="p-8 rounded-3xl bg-[#11131a] border border-white/10">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Session Error</h2>
          <p className="text-gray-400 text-sm mb-6">{error || 'Could not verify download access.'}</p>
          <Link
            to="/bundles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      {/* 1. Payment Success & Security Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#11131a] to-emerald-950/40 border border-emerald-500/30 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Payment successful</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
                Your secure download session is active for 10 minutes.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-gray-400 font-mono">
            <div>Order: <span className="text-gray-200 font-bold">{sessionData.orderId}</span></div>
            <div className="text-emerald-400 font-medium">Single-Use Encrypted Token</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Download Countdown & Stream Action */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-[#11131a] border border-white/10 shadow-xl">
            {/* Real-Time Server Synced Countdown */}
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Download access:
              </span>

              {/* Animated Countdown Clock */}
              <div className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-black/60 border border-purple-500/40 shadow-inner">
                <Clock className={`w-8 h-8 ${remainingSeconds < 120 ? 'text-rose-400 animate-pulse' : 'text-purple-400'}`} />
                <span className={`text-4xl sm:text-5xl font-mono font-black tracking-widest ${
                  remainingSeconds < 120 ? 'text-rose-400' : 'text-white'
                }`}>
                  {formatTime(remainingSeconds)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    remainingSeconds < 120 ? 'bg-rose-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-400 mt-2">
                Refreshing this page will restore your remaining time without resetting the clock.
              </p>
            </div>

            {/* Download CTA Button */}
            <div className="space-y-3">
              <button
                onClick={handleStartDownload}
                disabled={isExpired || isDownloading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Secure File Stream...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-white" />
                    <span>Download Video Bundle</span>
                  </>
                )}
              </button>

              {/* Active Stream Note */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                <span>
                  <strong>Active Transfer Protection:</strong> If your download begins before the 10-minute timer expires, your active transfer will NOT be interrupted.
                </span>
              </div>
            </div>

            {hasStartedDownload && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Download requested. Check your browser's download manager for status.</span>
              </div>
            )}
          </div>

          {/* Tips for extracting */}
          <div className="p-6 rounded-3xl bg-[#11131a] border border-white/5 text-xs text-gray-400 space-y-2">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Extraction Instructions
            </h4>
            <p>1. The bundle is delivered as an encrypted high-compression <strong className="text-gray-200">.zip</strong> archive.</p>
            <p>2. Double-click the downloaded file or right-click and select <strong className="text-gray-200">"Extract All"</strong> on Windows, or double-click to unzip on Mac.</p>
            <p>3. If downloading to an iPhone or Android, save to the "Files" app before opening.</p>
          </div>
        </div>

        {/* Right Column: Bundle Card & Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#11131a] border border-white/10 shadow-xl">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-900 border border-white/5">
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
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-white/10">
                {bundle.category}
              </div>
            </div>

            <h3 className="font-bold text-base text-white mb-2">{bundle.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">{bundle.description}</p>

            <div className="space-y-2 border-t border-white/5 pt-4 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Clips Included:</span>
                <span className="font-semibold text-white">{bundle.clipCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Master Resolution:</span>
                <span className="font-semibold text-white">{bundle.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Archive Size:</span>
                <span className="font-semibold text-white">{bundle.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Commercial License:</span>
                <span className="font-semibold text-emerald-400">Lifetime Universal</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-[11px] text-gray-400 mb-2">Saved a copy of your purchase?</p>
            <Link
              to="/bundles"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
            >
              Explore more video packs <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
