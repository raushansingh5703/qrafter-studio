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
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-slate-50">
        {/* Background glow meshes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/50 via-pink-200/40 to-amber-200/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Top Rating & Social Proof Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold mb-6 shadow-sm">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-slate-900 font-extrabold">4.9 / 5.0 Rating</span>
            <span className="text-slate-300">|</span>
            <span className="text-purple-700 font-bold">4,800+ Indian Creators Scaled</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Explode Your Reach With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600">
              5,000+ 4K Viral Reels
            </span>{' '}
            Bundles.
          </h1>

          <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            Ready-to-upload viral short clips for Instagram Reels & YouTube Shorts. No editing skills required, 100% royalty-free commercial monetization, and instant download to your email.
          </p>

          {/* Real-Time Urgency & Scarcity Countdown Strip */}
          <div className="inline-flex items-center gap-2.5 sm:gap-4 px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-50 via-orange-50 to-pink-50 border-2 border-red-200 text-xs mb-8 shadow-md">
            <span className="flex items-center gap-1.5 text-red-600 font-black">
              <Flame className="w-4 h-4 fill-current text-red-500 animate-pulse" /> 95% MEGA DISCOUNT
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-amber-800 font-mono font-bold">
              <Clock className="w-4 h-4 text-amber-600" /> Ends in {String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:{String(countdownSeconds % 60).padStart(2, '0')}
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-emerald-700 font-bold hidden sm:flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 10M+ Organic Views
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => featuredBundle && setSelectedBundleForCheckout(featuredBundle)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-base shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-current" />
              <span>Get All 5,000+ Clips - Only ₹{featuredBundle?.price || 49}</span>
            </button>
            <a
              href="#proof-showcase"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-md font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current text-pink-600" />
              <span>Watch Video & Earning Proofs</span>
            </a>
          </div>

          {/* Accepted Indian Payments Trust Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-600">
            <span className="text-slate-500 font-bold text-[11px]">Instant UPI Gateway:</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-bold flex items-center gap-1">
              PhonePe
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center gap-1">
              Google Pay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold flex items-center gap-1">
              Paytm
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1">
              UPI QR Code
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
              NetBanking / Cards
            </span>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">10M+</div>
              <div className="text-xs text-purple-600 font-bold">Organic Views Proof</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">5,000+</div>
              <div className="text-xs text-amber-600 font-bold">4K Master Clips</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
              <div className="text-xs text-emerald-600 font-bold">Royalty-Free Monetization</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">10-Sec</div>
              <div className="text-xs text-pink-600 font-bold">Encrypted Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Viral Showcase & Verified Channel Proof */}
      {featuredBundle && (
        <section id="proof-showcase" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Flame className="w-4 h-4 text-pink-600" />
              <span>Live Proof & Sample Reels</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Watch The Editing Quality.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600">
                Inspect Real Channel Growth.
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Don't buy blind. Watch sample vertical reels uncompressed and see verified YouTube Studio analytics from creators who used these packs.
            </p>
          </div>

          {/* Featured Hero Product Card Banner */}
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center justify-between gap-6">
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[11px]">
                    {featuredBundle.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                    {featuredBundle.resolution || '4K UHD 60FPS'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {featuredBundle.clipCount || '5,000+ Clips'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 line-clamp-1">
                  {featuredBundle.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5">
                  {featuredBundle.description}
                </p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="text-left lg:text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">₹{featuredBundle.price}</span>
                  {featuredBundle.originalPrice > featuredBundle.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{featuredBundle.originalPrice}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Lifetime Monetization Rights
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedBundleForCheckout(featuredBundle)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-current" />
                  <span>Get Instant Access (₹{featuredBundle.price})</span>
                </button>

                <Link
                  to={`/bundles/${featuredBundle.id}`}
                  className="hidden sm:inline-flex px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition-colors"
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
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
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
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>EARNING PROOF 🧾 👇</span>
            </button>

            <button
              onClick={() => setActiveProofTab('customer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'customer'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-105'
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
              <span>CUSTOMER PROOF 🧾 👇</span>
            </button>

            <button
              onClick={() => setActiveProofTab('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'video'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 scale-105'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current text-pink-600" />
              <span>Sample Video</span>
            </button>

            <button
              onClick={() => setActiveProofTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeProofTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
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
                price={featuredBundle.price}
                onBuyNow={() => setSelectedBundleForCheckout(featuredBundle)}
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
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50/50 to-amber-50 border border-purple-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-500/5">
            <div className="text-left">
              <h4 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Ready to replicate these viral results on your own channel?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Instant delivery • 100% Watermark-Free • 10-Minute download session opens immediately after payment.
              </p>
            </div>

            <button
              onClick={() => setSelectedBundleForCheckout(featuredBundle)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-current" />
              <span>Download Bundle for ₹{featuredBundle.price}</span>
            </button>
          </div>
        </section>
      )}

      {/* Comparison Section: Free Telegram vs Our Master Bundle */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-pink-600" />
            <span>The Clear Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Why Creators Choose Us Over Free Telegram Packs
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            Don't risk your Instagram account or waste hours editing watermarked, blurry clips. Get professional viral-ready assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Telegram / Random Drives */}
          <div className="p-7 sm:p-8 rounded-3xl bg-rose-50/70 border border-rose-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Risky & Time Wasting</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Free Telegram / Pirated Drives</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Ugly Watermarks & Logos:</strong> Nearly impossible to hide, looks unprofessional.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Blurry 480p Quality:</strong> Algorithms penalize low-resolution video, resulting in zero reach.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Copyright Strike Risk:</strong> Repeated re-uploads trigger instant strikes and channel shadowbans.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Broken Links & Quota Limits:</strong> "Download quota exceeded" errors with dead links.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Disorganized Mess:</strong> Random un-named clips with no hooks, sound effects, or categories.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-200 text-center">
              <span className="text-xs text-rose-700 font-bold">
                Result: Zero views, hours wasted, account shadowbanned ❌
              </span>
            </div>
          </div>

          {/* Card 2: BhaiLOLogy Master Pack */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-emerald-500 relative shadow-xl shadow-emerald-500/10 flex flex-col justify-between">
            {/* Recommended Tag */}
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Recommended Choice</span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Instant Viral Growth</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Our 5,000+ Master Bundle</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Zero Watermarks:</strong> Clean, raw video files ready to publish or edit in CapCut/VN.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Ultra HD 4K 60FPS:</strong> Crystal sharp visual clarity favored by Instagram and YouTube algorithms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Safe For Monetization:</strong> No copyright issues, perfect for Ads, sponsorships & brand deals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Direct High-Speed Access:</strong> High-bandwidth download servers with instant delivery.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Neatly Organized Folders:</strong> Sorted by comedy style, relatable sketches, and viral audio.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              {featuredBundle && (
                <button
                  onClick={() => setSelectedBundleForCheckout(featuredBundle)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-current" />
                  <span>Get Master Bundle Now for ₹{featuredBundle.price}</span>
                  <ArrowRight className="w-4 h-4" />
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
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Ready-to-Use Video Packs
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Featured Video Bundles</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
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
              <div key={n} className="rounded-2xl bg-white border border-slate-200 h-96 animate-pulse" />
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
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">No bundles found in this category.</p>
          </div>
        )}
      </section>

      {/* Why CineVault Features */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              Engineered For Content Creators & Agencies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to create viral Instagram Reels, YouTube Shorts, and high-converting paid ads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pre-Rendered 4K 60FPS</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Rendered with master color grading, HDR support, and optimized for high-bitrate vertical platforms without compression artifacts.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Commercial Rights</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No copyright strikes, no attribution required. Use across YouTube AdSense, Instagram sponsorships, client projects, and TikTok monetization.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant 10-Minute Token Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Zero sign-up hassle. Pay once, receive an encrypted 10-minute temporary download session, and stream the bundle directly to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Licensing Section */}
      <section id="licensing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-purple-50 via-white to-pink-50 border border-purple-200 text-center relative overflow-hidden shadow-xl shadow-purple-500/5">
          <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">Universal Commercial License Included</h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Every bundle includes our permanent commercial license. You can edit, monetize, and publish unlimited videos across any social platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs sm:text-sm text-slate-700 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full YouTube & Meta Monetization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Client Freelance Projects Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Paid Advertising Campaigns</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Lifetime Access With No Recurring Fees</span>
            </div>
          </div>

          <a
            href="#bundles"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm transition-all shadow-md"
          >
            <span>Browse All Bundles</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Everything you need to know about our video bundles and delivery</p>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Do I need to create an account to buy?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              No! We designed the checkout to be frictionless. Simply enter your email for your invoice, pay securely via Razorpay, and you are immediately redirected to your 10-minute encrypted download session.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">How does the 10-minute temporary download session work?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upon successful payment, our backend generates a cryptographically secure 256-bit token valid for 10 minutes. If you refresh the page, the timer resumes from the exact server remaining time. If a download stream is already in progress, it will continue uninterrupted until your file is completely saved.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">What format are the clips provided in?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              All vertical clips are 9:16 (2160x3840) 60FPS MP4 (H.264/H.265), ready for Instagram Reels and TikTok. Horizontal b-roll is 16:9 4K UHD.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">What if my internet disconnected during the download?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
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
