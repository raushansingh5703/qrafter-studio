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
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);

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
    bundles.find((b) => b.previewVideo || (b.dashboardScreenshots && b.dashboardScreenshots.length > 0)) ||
    bundles[0];

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
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-pink-500" />
            <span>2026 High-Engagement Video Assets</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Scale Your Content With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              4K Viral Video
            </span>{' '}
            Bundles.
          </h1>

          <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Download curated, cinematic 4K video clips, aesthetic vertical reels, and studio sound effects. 
            Instant delivery, royalty-free commercial license, and zero login friction.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#proof-showcase"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current text-pink-300" />
              <span>Watch Sample Reels & Proof</span>
            </a>
            <a
              href="#bundles"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-semibold text-base flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              <span>Explore All Bundles</span>
            </a>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-14 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-white">10M+</div>
              <div className="text-xs text-purple-400 font-semibold">Organic Views Proof</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">5,000+</div>
              <div className="text-xs text-gray-500">4K Master Clips</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-emerald-400 font-semibold">Royalty-Free Monetization</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">Instant</div>
              <div className="text-xs text-gray-500">Encrypted Delivery</div>
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

          {/* Media Showcase: Demo Player, Earning Proof, Customer Proof & Analytics Proof */}
          <div className="space-y-10">
            {/* 1. Demo Video Preview Player */}
            {featuredBundle.previewVideo && (
              <DemoVideoPlayer
                videoUrl={featuredBundle.previewVideo}
                title={featuredBundle.title}
                thumbnailUrl={formatDriveImageUrl(featuredBundle.thumbnail)}
              />
            )}

            {/* 2. EARNING PROOF🧾 👇 */}
            {featuredBundle.earningProofScreenshots && featuredBundle.earningProofScreenshots.length > 0 && (
              <EarningProofGallery
                screenshots={featuredBundle.earningProofScreenshots}
                title={featuredBundle.title}
                price={featuredBundle.price}
                onBuyNow={() => setSelectedBundleForCheckout(featuredBundle)}
              />
            )}

            {/* 3. CUSTOMER PROOF🧾 👇 */}
            {featuredBundle.customerProofScreenshots && featuredBundle.customerProofScreenshots.length > 0 && (
              <CustomerProofGallery
                screenshots={featuredBundle.customerProofScreenshots}
                title={featuredBundle.title}
                price={featuredBundle.price}
                onBuyNow={() => setSelectedBundleForCheckout(featuredBundle)}
              />
            )}

            {/* 4. YouTube Channel Reach & Analytics Proof */}
            {featuredBundle.dashboardScreenshots && featuredBundle.dashboardScreenshots.length > 0 && (
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
    </div>
  );
};
