import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bundle } from '../types';
import { fetchBundleById, formatDriveImageUrl } from '../services/api';
import { CheckoutModal } from '../components/CheckoutModal';
import { DemoVideoPlayer } from '../components/DemoVideoPlayer';
import { ProofScreenshotsGallery } from '../components/ProofScreenshotsGallery';
import { EarningProofGallery } from '../components/EarningProofGallery';
import { CustomerProofGallery } from '../components/CustomerProofGallery';
import { MobileStickyBuyBar } from '../components/MobileStickyBuyBar';
import { RecentPurchaseToast } from '../components/RecentPurchaseToast';
import {
  Sparkles,
  Film,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Layers,
  FileVideo,
  MonitorPlay,
  HardDrive,
  Clock,
} from 'lucide-react';

export const BundleDetailsPage: React.FC = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bundleId) {
      fetchBundleById(bundleId)
        .then((data) => {
          setBundle(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Bundle not found or is currently inactive.');
          setLoading(false);
        });
    }
  }, [bundleId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-800 rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-video bg-gray-800 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-800 rounded w-3/4" />
              <div className="h-6 bg-gray-800 rounded w-1/2" />
              <div className="h-32 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center min-h-screen">
        <div className="p-8 rounded-3xl bg-[#11131a] border border-white/10">
          <Film className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Bundle Unavailable</h2>
          <p className="text-gray-400 text-sm mb-6">{error || 'This video bundle is no longer listed.'}</p>
          <Link
            to="/bundles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bundles
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent =
    bundle.originalPrice && bundle.originalPrice > bundle.price
      ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
      : 0;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {showCheckout && (
        <CheckoutModal bundle={bundle} onClose={() => setShowCheckout(false)} />
      )}

      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          to="/bundles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Bundles
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Visual Media & Specs */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white font-bold text-xs">
                {bundle.category}
              </span>
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full bg-pink-600 text-white font-bold text-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <Film className="w-4 h-4 text-purple-400" />
                {bundle.clipCount}
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                {bundle.resolution}
              </span>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#11131a] border border-white/5">
              <MonitorPlay className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Resolution</div>
              <div className="text-sm font-bold text-white mt-0.5">{bundle.resolution}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11131a] border border-white/5">
              <FileVideo className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Format</div>
              <div className="text-sm font-bold text-white mt-0.5">MP4 / ProRes 60FPS</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11131a] border border-white/5">
              <HardDrive className="w-5 h-5 text-pink-400 mb-2" />
              <div className="text-[11px] text-gray-500 uppercase font-semibold">File Size</div>
              <div className="text-sm font-bold text-white mt-0.5">{bundle.fileSize}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11131a] border border-white/5">
              <Clock className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Access Delivery</div>
              <div className="text-sm font-bold text-white mt-0.5">Instant 10-Min Session</div>
            </div>
          </div>

          {/* Section 1: Demo Video Preview Player */}
          {bundle.previewVideo && (
            <DemoVideoPlayer
              videoUrl={bundle.previewVideo}
              title={bundle.title}
              thumbnailUrl={formatDriveImageUrl(bundle.thumbnail)}
            />
          )}

          {/* What's Inside Checklist */}
          <div className="p-6 rounded-3xl bg-[#11131a] border border-white/5">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Package Inclusions & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ready-to-post 9:16 vertical reels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Color-graded Rec.709 & DCI-P3 masters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Synchronized audio & sound effects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Royalty-free commercial monetization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Compatible with Premiere, CapCut, DaVinci</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct high-speed streaming transfer</span>
              </div>
            </div>
          </div>

          {/* Section 2: EARNING PROOF🧾 👇 */}
          {bundle.earningProofScreenshots && bundle.earningProofScreenshots.length > 0 && (
            <EarningProofGallery
              screenshots={bundle.earningProofScreenshots}
              title={bundle.title}
              price={bundle.price}
              onBuyNow={() => setShowCheckout(true)}
            />
          )}

          {/* Section 3: CUSTOMER PROOF🧾 👇 */}
          {bundle.customerProofScreenshots && bundle.customerProofScreenshots.length > 0 && (
            <CustomerProofGallery
              screenshots={bundle.customerProofScreenshots}
              title={bundle.title}
              price={bundle.price}
              onBuyNow={() => setShowCheckout(true)}
            />
          )}

          {/* Section 4: YouTube Dashboard & Analytics Proof */}
          {bundle.dashboardScreenshots && bundle.dashboardScreenshots.length > 0 && (
            <ProofScreenshotsGallery
              screenshots={bundle.dashboardScreenshots}
              title={bundle.title}
            />
          )}
        </div>

        {/* Right Column: Title, Description, Pricing Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-[#11131a] border border-white/10 sticky top-28 shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Instant Delivery
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
              {bundle.title}
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {bundle.description}
            </p>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">₹{bundle.price}</span>
                  {bundle.originalPrice > bundle.price && (
                    <span className="text-sm text-gray-500 line-through">₹{bundle.originalPrice}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">One-time payment • No monthly subscription</p>
            </div>

            {/* Instant Checkout CTA */}
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              <span>Get Instant Access Now</span>
            </button>

            {/* Guarantees */}
            <div className="mt-6 space-y-2.5 text-xs text-gray-400 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Commercial license for YouTube, Reels, TikTok & Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>256-bit encrypted single-use 10-minute download session</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Session does not cut off during an active download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Purchase Social Proof Popups */}
      <RecentPurchaseToast />

      {/* Sticky Bottom Buy Bar on Mobile */}
      <MobileStickyBuyBar
        bundle={bundle}
        onBuy={() => setShowCheckout(true)}
      />
    </div>
  );
};
