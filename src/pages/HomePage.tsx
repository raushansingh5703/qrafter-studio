import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bundle } from '../types';
import { fetchBundles, formatDriveImageUrl } from '../services/api';
import { BundleCard } from '../components/BundleCard';
import { CheckoutModal } from '../components/CheckoutModal';
import { DemoVideoPlayer } from '../components/DemoVideoPlayer';
import { ProofScreenshotsGallery } from '../components/ProofScreenshotsGallery';
import { EarningProofGallery } from '../components/EarningProofGallery';
import { CustomerProofGallery } from '../components/CustomerProofGallery';
import { MobileStickyBuyBar } from '../components/MobileStickyBuyBar';
import { RecentPurchaseToast } from '../components/RecentPurchaseToast';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle,
  Download,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  HelpCircle,
  Play,
  Flame,
  CheckCircle2,
  Clock,
  Star,
  Receipt,
  MessageSquare,
  BarChart3,
  XCircle,
  Eye,
  Lock,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState(892); // ~14m 52s
  const [activeProofTab, setActiveProofTab] = useState<'all' | 'earning' | 'customer' | 'video' | 'analytics'>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 10 ? prev - 1 : 892));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchBundles()
      .then((data) => {
        setBundles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load bundles:', err);
        setLoading(false);
      });
  }, []);

  const featuredBundle =
    bundles.find(
      (b) =>
        b.previewVideo ||
        (b.earningProofScreenshots && b.earningProofScreenshots.length > 0) ||
        (b.customerProofScreenshots && b.customerProofScreenshots.length > 0) ||
        (b.dashboardScreenshots && b.dashboardScreenshots.length > 0)
    ) || bundles[0];

  const categories = ['All', 'Viral Reels', 'Cinematic B-Roll', '3D Animations', 'Luxury Lifestyle', 'Audio FX'];

  const filteredBundles =
    selectedCategory === 'All'
      ? bundles
      : bundles.filter((b) => b.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen">
      {/* Checkout Modal */}
      {selectedBundleForCheckout && (
        <CheckoutModal
          bundle={selectedBundleForCheckout}
          onClose={() => setSelectedBundleForCheckout(null)}
        />
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Top Rating & Social Proof Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-pink-500/15 border border-amber-500/30 text-xs font-bold mb-6 shadow-lg shadow-amber-500/10">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-white font-extrabold">4.9 / 5.0 Rating</span>
            <span className="text-gray-400">|</span>
            <span className="text-purple-300 font-semibold">4,800+ Indian Creators Scaled</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Explode Your Reach With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              5,000+ 4K Viral Reels
            </span>{' '}
            Bundles.
          </h1>

          <p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            Ready-to-upload viral short clips for Instagram Reels & YouTube Shorts. No editing skills required, 100% royalty-free commercial monetization, and instant download to your email.
          </p>

          {/* Real-Time Urgency & Scarcity Countdown Strip */}
          <div className="inline-flex items-center gap-2.5 sm:gap-4 px-4 sm:px-6 py-2.5 rounded-2xl bg-black/70 border border-pink-500/40 text-xs mb-8 shadow-xl">
            <span className="flex items-center gap-1.5 text-pink-400 font-black">
              <Flame className="w-4 h-4 fill-current text-pink-500 animate-pulse" /> 95% MEGA DISCOUNT
            </span>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-1.5 text-amber-300 font-mono font-bold">
              <Clock className="w-4 h-4 text-amber-400" /> Ends in {String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:{String(countdownSeconds % 60).padStart(2, '0')}
            </span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="text-emerald-400 font-semibold hidden sm:flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 10M+ Organic Views
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => featuredBundle && setSelectedBundleForCheckout(featuredBundle)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-base shadow-2xl shadow-purple-600/40 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5 text-amber-200 fill-current" />
              <span>Get All 5,000+ Clips - Only ₹{featuredBundle?.price || 49}</span>
            </button>
            <a
              href="#proof-showcase"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current text-pink-400" />
              <span>Watch Video & Earning Proofs</span>
            </a>
          </div>

          {/* Accepted Indian Payments Trust Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs text-gray-400">
            <span className="text-gray-500 font-semibold text-[11px]">Instant UPI Gateway:</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1">
              PhonePe
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 font-bold flex items-center gap-1">
              Google Pay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1">
              Paytm
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
              UPI QR Code
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium">
              NetBanking / Cards
            </span>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">10M+</div>
              <div className="text-xs text-purple-400 font-bold">Organic Views Proof</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">5,000+</div>
              <div className="text-xs text-amber-400 font-bold">4K Master Clips</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-xs text-emerald-400 font-bold">Royalty-Free Monetization</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">10-Sec</div>
              <div className="text-xs text-pink-400 font-bold">Encrypted Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Viral Showcase & Verified Channel Proof */}
      {featuredBundle && (
        <section id="proof-showcase" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
              <Flame className="w-4 h-4 text-pink-500" />
              <span>Live Proof & Sample Reels</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Watch The Editing Quality.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                Inspect Real Channel Growth.
              </span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Don't buy blind. Watch sample vertical reels uncompressed and see verified YouTube Studio analytics from creators who used these packs.
            </p>
          </div>

          {/* Featured Hero Product Card Banner */}
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-purple-950/40 via-[#11131a] to-indigo-950/40 border border-purple-500/25 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <img
                src={formatDriveImageUrl(featuredBundle.thumbnail)}
                alt={featuredBundle.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80';
                  }
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/10 shrink-0 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600/80 text-white font-bold text-[11px]">
                    {featuredBundle.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
                    {featuredBundle.resolution || '4K UHD 60FPS'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {featuredBundle.clipCount || '5,000+ Clips'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white line-clamp-1">
                  {featuredBundle.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 mt-0.5">
                  {featuredBundle.description}
                </p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
              <div className="text-left lg:text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">₹{featuredBundle.price}</span>
                  {featuredBundle.originalPrice > featuredBundle.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{featuredBundle.originalPrice}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Lifetime Monetization Rights
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedBundleForCheckout(featuredBundle)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Get Instant Access (₹{featuredBundle.price})</span>
                </button>

                <Link
                  to={`/bundles/${featuredBundle.id}`}
                  className="hidden sm:inline-flex px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Proof Filter Switcher */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none flex-wrap">
            <button
              onClick={() => setActiveProofTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                  : 'bg-[#11131a] text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>All Proofs & Demo</span>
            </button>

            <button
              onClick={() => setActiveProofTab('earning')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'earning'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-emerald-950/30 text-emerald-300 hover:text-white border border-emerald-500/30'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>EARNING PROOF 🧾 👇</span>
            </button>

            <button
              onClick={() => setActiveProofTab('customer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'customer'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-105'
                  : 'bg-cyan-950/30 text-cyan-300 hover:text-white border border-cyan-500/30'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>CUSTOMER PROOF 🧾 👇</span>
            </button>

            <button
              onClick={() => setActiveProofTab('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'video'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 scale-105'
                  : 'bg-purple-950/30 text-pink-300 hover:text-white border border-pink-500/30'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current text-pink-400" />
              <span>Sample Video</span>
            </button>

            <button
              onClick={() => setActiveProofTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                  : 'bg-indigo-950/30 text-indigo-300 hover:text-white border border-indigo-500/30'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Channel Stats</span>
            </button>
          </div>

          {/* Media Showcase: Demo Player, Earning Proof, Customer Proof & Analytics Proof */}
          <div className="space-y-10">
            {/* 1. Demo Video Preview Player */}
            {(activeProofTab === 'all' || activeProofTab === 'video') && featuredBundle.previewVideo && (
              <DemoVideoPlayer
                videoUrl={featuredBundle.previewVideo}
                title={featuredBundle.title}
                thumbnailUrl={formatDriveImageUrl(featuredBundle.thumbnail)}
              />
            )}

            {/* 2. EARNING PROOF🧾 👇 */}
            {(activeProofTab === 'all' || activeProofTab === 'earning') &&
              featuredBundle.earningProofScreenshots &&
              featuredBundle.earningProofScreenshots.length > 0 && (
                <EarningProofGallery
                  screenshots={featuredBundle.earningProofScreenshots}
                  title={featuredBundle.title}
                  price={featuredBundle.price}
                  onBuyNow={() => setSelectedBundleForCheckout(featuredBundle)}
                />
              )}

            {/* 3. CUSTOMER PROOF🧾 👇 */}
            {(activeProofTab === 'all' || activeProofTab === 'customer') &&
              featuredBundle.customerProofScreenshots &&
              featuredBundle.customerProofScreenshots.length > 0 && (
                <CustomerProofGallery
                  screenshots={featuredBundle.customerProofScreenshots}
                  title={featuredBundle.title}
                  price={featuredBundle.price}
                  onBuyNow={() => setSelectedBundleForCheckout(featuredBundle)}
                />
              )}

            {/* 4. YouTube Channel Reach & Analytics Proof */}
            {(activeProofTab === 'all' || activeProofTab === 'analytics') &&
              featuredBundle.dashboardScreenshots &&
              featuredBundle.dashboardScreenshots.length > 0 && (
                <ProofScreenshotsGallery
                  screenshots={featuredBundle.dashboardScreenshots}
                  title={featuredBundle.title}
                />
              )}
          </div>

          {/* Direct Buy Bar at bottom of proof */}
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-[#11131a] to-pink-900/40 border border-purple-500/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                Ready to replicate these viral results on your own channel?
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Instant delivery • 100% Watermark-Free • 10-Minute download session opens immediately after payment.
              </p>
            </div>

            <button
              onClick={() => setSelectedBundleForCheckout(featuredBundle)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Download Bundle for ₹{featuredBundle.price}</span>
            </button>
          </div>
        </section>
      )}

      {/* Comparison Section: Free Telegram vs Our Master Bundle */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>The Clear Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Why Creators Choose Us Over Free Telegram Packs
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-2">
            Don't risk your Instagram account or waste hours editing watermarked, blurry clips. Get professional viral-ready assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Telegram / Random Drives */}
          <div className="p-7 sm:p-8 rounded-3xl bg-rose-950/15 border border-rose-500/25 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Risky & Time Wasting</span>
                  <h3 className="text-xl font-black text-white mt-1">Free Telegram / Pirated Drives</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Ugly Watermarks & Logos:</strong> Nearly impossible to hide, looks unprofessional.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Blurry 480p Quality:</strong> Algorithms penalize low-resolution video, resulting in zero reach.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Copyright Strike Risk:</strong> Repeated re-uploads trigger instant strikes and channel shadowbans.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Broken Links & Quota Limits:</strong> "Download quota exceeded" errors with dead links.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Disorganized Mess:</strong> Random un-named clips with no hooks, sound effects, or categories.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-500/20 text-center">
              <span className="text-xs text-rose-300/80 font-semibold">
                Result: Zero views, hours wasted, account shadowbanned ❌
              </span>
            </div>
          </div>

          {/* Card 2: BhaiLOLogy Master Pack */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-950/50 via-[#11131a] to-emerald-950/30 border-2 border-emerald-500/50 relative shadow-[0_0_45px_rgba(16,185,129,0.18)] flex flex-col justify-between">
            {/* Recommended Tag */}
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Recommended Choice</span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Instant Viral Growth</span>
                  <h3 className="text-xl font-black text-white mt-1">Our 5,000+ Master Bundle</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Zero Watermarks:</strong> Clean, raw video files ready to publish or edit in CapCut/VN.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Ultra HD 4K 60FPS:</strong> Crystal sharp visual clarity favored by Instagram and YouTube algorithms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Safe For Monetization:</strong> No copyright issues, perfect for Ads, sponsorships & brand deals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Direct High-Speed Access:</strong> High-bandwidth download servers with instant delivery.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Neatly Organized Folders:</strong> Sorted by comedy style, relatable sketches, and viral audio.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-500/30">
              {featuredBundle && (
                <button
                  onClick={() => setSelectedBundleForCheckout(featuredBundle)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 hover:from-emerald-400 hover:to-purple-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Get Master Bundle Now for ₹{featuredBundle.price}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bundles Catalog */}
      <section id="bundles" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Ready-to-Use Video Packs
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Featured Video Bundles</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bundle Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-[#11131a] border border-white/5 h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBundles.map((bundle) => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                onQuickBuy={(b) => setSelectedBundleForCheckout(b)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#11131a] rounded-3xl border border-white/5">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No bundles found in this category.</p>
          </div>
        )}
      </section>

      {/* Why CineVault Features */}
      <section id="features" className="py-20 bg-[#0d0e14] border-y border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Engineered For Content Creators & Agencies
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Everything you need to create viral Instagram Reels, YouTube Shorts, and high-converting paid ads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#11131a] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pre-Rendered 4K 60FPS</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rendered with master color grading, HDR support, and optimized for high-bitrate vertical platforms without compression artifacts.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#11131a] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Commercial Rights</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No copyright strikes, no attribution required. Use across YouTube AdSense, Instagram sponsorships, client projects, and TikTok monetization.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#11131a] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant 10-Minute Token Access</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Zero sign-up hassle. Pay once, receive an encrypted 10-minute temporary download session, and stream the bundle directly to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Licensing Section */}
      <section id="licensing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-purple-950/40 via-[#11131a] to-indigo-950/40 border border-purple-500/20 text-center relative overflow-hidden">
          <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-4">Universal Commercial License Included</h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Every bundle includes our permanent commercial license. You can edit, monetize, and publish unlimited videos across any social platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs sm:text-sm text-gray-300 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full YouTube & Meta Monetization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Client Freelance Projects Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Paid Advertising Campaigns</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lifetime Access With No Recurring Fees</span>
            </div>
          </div>

          <a
            href="#bundles"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black hover:bg-gray-200 font-bold text-sm transition-all"
          >
            <span>Browse All Bundles</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm">Everything you need to know about our video bundles and delivery</p>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5">
            <h4 className="font-bold text-white mb-2">Do I need to create an account to buy?</h4>
            <p className="text-gray-400 text-sm">
              No! We designed the checkout to be frictionless. Simply enter your email for your invoice, pay securely via Razorpay, and you are immediately redirected to your 10-minute encrypted download session.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5">
            <h4 className="font-bold text-white mb-2">How does the 10-minute temporary download session work?</h4>
            <p className="text-gray-400 text-sm">
              Upon successful payment, our backend generates a cryptographically secure 256-bit token valid for 10 minutes. If you refresh the page, the timer resumes from the exact server remaining time. If a download stream is already in progress, it will continue uninterrupted until your file is completely saved.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5">
            <h4 className="font-bold text-white mb-2">What format are the clips provided in?</h4>
            <p className="text-gray-400 text-sm">
              All vertical clips are 9:16 (2160x3840) 60FPS MP4 (H.264/H.265), ready for Instagram Reels and TikTok. Horizontal b-roll is 16:9 4K UHD.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5">
            <h4 className="font-bold text-white mb-2">What if my internet disconnected during the download?</h4>
            <p className="text-gray-400 text-sm">
              If you experience any connectivity difficulties before your 10-minute session concludes, you can immediately restart the download. If your session expires before completing your download, our support team is available 24/7 with your Order ID.
            </p>
          </div>
        </div>
      </section>

      {/* Real-time Purchase Social Proof Popups */}
      <RecentPurchaseToast />

      {/* Sticky Bottom Buy Bar on Mobile */}
      {featuredBundle && (
        <MobileStickyBuyBar
          bundle={featuredBundle}
          onBuy={(bundle) => setSelectedBundleForCheckout(bundle)}
        />
      )}
    </div>
  );
};
