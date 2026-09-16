import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Film,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Disc,
  CheckCircle2,
  Zap,
  Volume2,
  VolumeX,
  Flame,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DemoVideoPlayerProps {
  videoUrl: string;
  title?: string;
  thumbnailUrl?: string;
  price?: number;
  onBuyNow?: () => void;
}

interface ParsedSource {
  type: 'youtube' | 'drive' | 'direct' | 'unknown';
  driveFileId?: string;
  streamUrl: string;
  streamFallbackUrl?: string;
  iframeUrl: string;
  externalUrl?: string;
  isShort?: boolean;
}

function parseVideoSource(rawUrl: string): ParsedSource {
  if (!rawUrl) {
    return { type: 'unknown', streamUrl: '', iframeUrl: '' };
  }
  const trimmed = rawUrl.trim();

  // 1. YouTube & YouTube Shorts
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytShortsMatch && ytShortsMatch[1]) {
    const videoId = ytShortsMatch[1];
    return {
      type: 'youtube',
      streamUrl: '',
      iframeUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      externalUrl: `https://www.youtube.com/shorts/${videoId}`,
      isShort: true,
    };
  }

  const ytStandardMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/
  );
  if (ytStandardMatch && ytStandardMatch[1]) {
    const videoId = ytStandardMatch[1];
    return {
      type: 'youtube',
      streamUrl: '',
      iframeUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      isShort: false,
    };
  }

  // 2. Google Drive Video Preview
  const driveFileMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return {
      type: 'drive',
      driveFileId: fileId,
      // Direct MP4 stream supported by Google Usercontent CDN
      streamUrl: `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`,
      streamFallbackUrl: `/api/previewVideo?id=${fileId}`,
      iframeUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      externalUrl: `https://drive.google.com/file/d/${fileId}/view`,
      isShort: true,
    };
  }

  // 3. Direct Video File (MP4, WebM, etc.)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('http')) {
    return {
      type: 'direct',
      streamUrl: trimmed,
      iframeUrl: trimmed,
      externalUrl: trimmed,
      isShort: true,
    };
  }

  return { type: 'unknown', streamUrl: trimmed, iframeUrl: trimmed };
}

function formatDuration(sec: number): string {
  if (isNaN(sec) || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({
  videoUrl,
  title = 'BhaiLOLogy Viral Reel Preview',
  thumbnailUrl,
  price = 49,
  onBuyNow,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'phone' | 'theater'>('phone');
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSource = parseVideoSource(videoUrl);

  // Sync play/pause when isPlaying changes
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser policy, muting audio:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Handle video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  // Screen click toggle
  const togglePlayState = () => {
    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 500);
    setIsPlaying((prev) => !prev);
  };

  // Sound toggle
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Share handler
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this Viral Reel Bundle',
          text: `Watch sample video and get 5,000+ viral reels for ₹${price}!`,
          url: window.location.href,
        });
        return;
      } catch (err) {}
    }
    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    } catch (err) {}
  };

  // If native HTML5 video encounters load error, seamlessly switch to Drive iframe
  const handleNativeVideoError = () => {
    console.warn('Native video stream failed on this device, falling back to Google Drive preview iframe.');
    setUseIframeFallback(true);
  };

  if (videoSource.type === 'unknown' || (!videoSource.streamUrl && !videoSource.iframeUrl)) {
    return null;
  }

  const isNativeVideoAvailable =
    !useIframeFallback &&
    (videoSource.type === 'drive' || videoSource.type === 'direct') &&
    Boolean(videoSource.streamUrl);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-200/60 p-4 sm:p-7 md:p-8 transition-all text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-pink-500 fill-current" />
            <span>Sample Reels & Video Preview</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Watch Actual Uncompressed Video Quality
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tap play below to check retention hooks, punchy Hindi dialogue, and 4K 60FPS clarity on your device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setViewMode('phone')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'phone'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>📱 Reel View</span>
            </button>
            <button
              onClick={() => setViewMode('theater')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'theater'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>🖥️ Wide View</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            4K 60FPS
          </span>
        </div>
      </div>

      {/* Main Grid: Smartphone Frame + Key Value Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left/Center: Smartphone Reel Frame */}
        <div className={`mx-auto w-full ${viewMode === 'phone' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <div
            className={`relative mx-auto rounded-[2.3rem] sm:rounded-[2.8rem] p-2.5 sm:p-3.5 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 shadow-2xl shadow-purple-500/20 border-4 sm:border-[6px] border-slate-800 transition-all ${
              viewMode === 'phone'
                ? 'w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[360px]'
                : 'w-full max-w-3xl'
            }`}
          >
            {/* Dynamic Island / Speaker Pill */}
            <div className="flex items-center justify-center mb-2">
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-2.5 gap-1.5 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>
            </div>

            {/* Reel Video Inner Screen */}
            <div
              className={`relative rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden bg-black shadow-inner select-none ${
                viewMode === 'phone' ? 'aspect-[9/16]' : 'aspect-video'
              }`}
            >
              {!isPlaying ? (
                /* Poster Screen with Realistic Reel Overlay */
                <div
                  className="relative w-full h-full cursor-pointer group select-none"
                  onClick={() => setIsPlaying(true)}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-950 to-black flex items-center justify-center">
                      <Film className="w-16 h-16 text-purple-400/40" />
                    </div>
                  )}

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50 pointer-events-none" />

                  {/* Top Bar inside Reel */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-current text-amber-400" />
                      5,000+ MASTER PACK
                    </span>
                    <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      ZERO WATERMARK
                    </span>
                  </div>

                  {/* Center Big Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/70 group-hover:scale-110 group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                    </div>
                    <span className="mt-3 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-black tracking-wide drop-shadow border border-white/20">
                      ▶ Tap to Watch Sample Reel
                    </span>
                  </div>

                  {/* Right Social Action Buttons (Instagram Style) */}
                  <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3 z-10 text-white">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                      }}
                      className="flex flex-col items-center gap-0.5 hover:scale-110 transition-transform"
                    >
                      <div
                        className={`w-9 h-9 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center border border-white/20 ${
                          isLiked ? 'text-rose-500' : 'text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </div>
                      <span className="text-[10px] font-bold drop-shadow">
                        {isLiked ? '148.6K' : '148.5K'}
                      </span>
                    </button>

                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-9 h-9 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold drop-shadow">3,820</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex flex-col items-center gap-0.5 hover:scale-110 transition-transform"
                    >
                      <div className="w-9 h-9 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold drop-shadow">62.4K</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSaved(!isSaved);
                      }}
                      className="flex flex-col items-center gap-0.5 hover:scale-110 transition-transform"
                    >
                      <div
                        className={`w-9 h-9 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center border border-white/20 ${
                          isSaved ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                      </div>
                      <span className="text-[10px] font-bold drop-shadow">Save</span>
                    </button>

                    {/* Vinyl spinning disc */}
                    <div className="w-9 h-9 rounded-full bg-black/75 border border-white/25 flex items-center justify-center animate-spin">
                      <Disc className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>

                  {/* Bottom Caption & Creator Info */}
                  <div className="absolute left-3 right-14 bottom-3 z-10 text-white text-left pointer-events-none">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-black drop-shadow">@bhailology_reels</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-current" />
                      <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-semibold">
                        Viral
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-200 line-clamp-2 drop-shadow leading-snug">
                      {title} — Viral Hindi comedy clips ready to post on Instagram & Shorts! 🔥😂
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-300">
                      <Volume2 className="w-3 h-3 text-purple-300 shrink-0" />
                      <span className="truncate">Original Sound • BhaiLOLogy Viral Audio</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Video Playback State */
                <div
                  className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer"
                  onClick={togglePlayState}
                >
                  {isNativeVideoAvailable ? (
                    /* Tier 1: Universal Native HTML5 Video */
                    <video
                      ref={videoRef}
                      playsInline
                      // @ts-ignore
                      webkit-playsinline="true"
                      autoPlay
                      loop
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onError={handleNativeVideoError}
                      className="w-full h-full object-cover"
                    >
                      <source src={videoSource.streamUrl} type="video/mp4" />
                      {videoSource.streamFallbackUrl && (
                        <source src={videoSource.streamFallbackUrl} type="video/mp4" />
                      )}
                      Your browser does not support HTML5 video streaming.
                    </video>
                  ) : (
                    /* Tier 2: YouTube Embed or Google Drive Preview Iframe */
                    <iframe
                      src={videoSource.iframeUrl}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}

                  {/* Play / Pause Feedback Pulse in Center */}
                  {showPlayPulse && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center scale-110 animate-ping">
                        {isPlaying ? (
                          <Play className="w-8 h-8 fill-current" />
                        ) : (
                          <Pause className="w-8 h-8 fill-current" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Top Floating Controls Bar */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-30 pointer-events-auto">
                    {/* Sound Control Button (Mobile friendly) */}
                    {isNativeVideoAvailable && (
                      <button
                        type="button"
                        onClick={toggleSound}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md border transition-all shadow-lg ${
                          isMuted
                            ? 'bg-pink-600/90 text-white border-pink-400 animate-pulse'
                            : 'bg-black/70 text-white border-white/20'
                        }`}
                      >
                        {isMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Tap to Unmute 🔊</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Sound On</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Exit Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(false);
                      }}
                      className="px-2.5 py-1 rounded-full bg-black/75 hover:bg-black text-white text-[10px] font-bold border border-white/20 backdrop-blur-md ml-auto"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Instagram-style Scrubber Line & Time Display (Native Video Only) */}
                  {isNativeVideoAvailable && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-6">
                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono mb-1.5 drop-shadow">
                        <span>{formatDuration(currentTime)}</span>
                        <span>{formatDuration(duration || 30)}</span>
                      </div>
                      <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Phone Bar / Home Indicator */}
            <div className="flex items-center justify-center mt-2.5">
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>

          {/* Device Fallback Escape Link */}
          {videoSource.externalUrl && (
            <div className="text-center mt-3">
              <a
                href={videoSource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-purple-600 font-semibold transition-colors"
              >
                <span>Facing playback issues on your phone?</span>
                <span className="underline flex items-center gap-0.5">
                  Watch in Google Drive <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>
          )}

          {sharedToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 animate-fade-in">
              ✓ Reel link copied to clipboard!
            </div>
          )}
        </div>

        {/* Right Side: High Converting Quality Proof Points */}
        {viewMode === 'phone' && (
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50/40 to-amber-50/50 border border-purple-200/80">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                Premium Creator Standards
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">
                What Makes Our Reels Go 100K+ Viral?
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every video in our 5,000+ bundle is pre-screened for viral retention, clean dialogue punchlines, and algorithmic appeal.
              </p>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900">100% Watermark-Free:</strong>
                    <span className="text-slate-600 ml-1">No channel names or logos. Raw clips ready for your handle.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900">4K Ultra HD & 60FPS:</strong>
                    <span className="text-slate-600 ml-1">Crystal clear quality that Instagram & YouTube algorithms reward with maximum reach.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900">Pre-Synced Viral Audio & SFX:</strong>
                    <span className="text-slate-600 ml-1">Zero editing needed! Just download, add your caption, and upload.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900">Commercial Monetization Rights:</strong>
                    <span className="text-slate-600 ml-1">100% safe to monetize with creator bonus, ads, and brand deals.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Buy CTA inside Demo Card */}
            {onBuyNow && (
              <div className="p-5 rounded-2xl bg-white border-2 border-purple-500 shadow-xl shadow-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">₹{price}</span>
                    <span className="text-xs text-slate-400 line-through">₹999</span>
                    <span className="text-[10px] font-black bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                      95% OFF FLASH SALE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Instant access to all 5,000+ clips in this exact quality.
                  </p>
                </div>

                <button
                  onClick={onBuyNow}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-current" />
                  <span>Download 5,000+ Bundle for ₹{price}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
