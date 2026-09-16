import React, { useState } from 'react';
import { Play, PlayCircle, Film, Sparkles } from 'lucide-react';

interface DemoVideoPlayerProps {
  videoUrl: string;
  title?: string;
  thumbnailUrl?: string;
}

function parseVideoSource(rawUrl: string): {
  type: 'youtube' | 'drive' | 'direct' | 'unknown';
  embedUrl: string;
  isShort?: boolean;
} {
  if (!rawUrl) return { type: 'unknown', embedUrl: '' };
  const trimmed = rawUrl.trim();

  // 1. YouTube & YouTube Shorts
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytShortsMatch && ytShortsMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytShortsMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      isShort: true,
    };
  }

  const ytStandardMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/
  );
  if (ytStandardMatch && ytStandardMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytStandardMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      isShort: false,
    };
  }

  // 2. Google Drive Video Preview
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                         trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`,
      isShort: false,
    };
  }

  // 3. Direct Video File (MP4, WebM, etc.)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('http')) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      isShort: false,
    };
  }

  return { type: 'unknown', embedUrl: trimmed };
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({
  videoUrl,
  title = 'Sample Reel Preview',
  thumbnailUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoSource = parseVideoSource(videoUrl);

  if (videoSource.type === 'unknown' || !videoSource.embedUrl) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-[#11131a] border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
            Watch Demo
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sample Reels & Video Preview
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            See the exact editing style, transitions, and audio sync before purchasing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3" /> 4K Ultra HD 60FPS
          </span>
        </div>
      </div>

      {/* Video Container */}
      <div
        className={`relative mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl ${
          videoSource.isShort
            ? 'max-w-[340px] aspect-[9/16]'
            : 'w-full aspect-video'
        }`}
      >
        {!isPlaying ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-950/60 to-black flex items-center justify-center">
                <Film className="w-16 h-16 text-purple-500/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 group-hover:scale-110 group-hover:bg-pink-600 transition-all">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </div>
              <p className="text-white font-bold text-sm sm:text-base mt-4 drop-shadow">
                Click to Play Sample Video
              </p>
              <span className="text-xs text-gray-300 mt-1 opacity-80">
                100% Watermark-Free After Purchase
              </span>
            </div>
          </div>
        ) : (
          <>
            {videoSource.type === 'youtube' || videoSource.type === 'drive' ? (
              <iframe
                src={videoSource.embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={videoSource.embedUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video streaming.
              </video>
            )}
          </>
        )}
      </div>
    </div>
  );
};
