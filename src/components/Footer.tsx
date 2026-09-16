import React from 'react';
import { Film, Shield, Lock, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-md shadow-purple-600/20">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg text-slate-900">CineVault</span>
            </div>
            <p className="text-slate-600 max-w-md leading-relaxed mb-6 text-xs sm:text-sm">
              The premier marketplace for high-performance 4K video clips, viral Instagram Reels, 
              cinematic drone b-roll, and creator asset packs. Delivered with temporary encrypted access tokens 
              for optimal security.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> 100% Commercial Royalty-Free
              </div>
              <div className="flex items-center gap-1.5 text-purple-800 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 font-semibold">
                <Lock className="w-3.5 h-3.5 text-purple-600" /> 256-Bit Encrypted Delivery
              </div>
              <div className="flex items-center gap-1.5 text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 font-semibold">
                <Zap className="w-3.5 h-3.5 text-indigo-600" /> Razorpay Verified Checkout
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Categories</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li><a href="/bundles?category=Viral%20Reels" className="hover:text-purple-600 transition-colors">Viral Reels (9:16)</a></li>
              <li><a href="/bundles?category=Cinematic%20B-Roll" className="hover:text-purple-600 transition-colors">Cinematic 4K Drone</a></li>
              <li><a href="/bundles?category=3D%20Animations" className="hover:text-purple-600 transition-colors">Cyberpunk & 3D Loops</a></li>
              <li><a href="/bundles?category=Luxury%20Lifestyle" className="hover:text-purple-600 transition-colors">Luxury Entrepreneur</a></li>
              <li><a href="/bundles?category=Audio%20FX" className="hover:text-purple-600 transition-colors">Sound FX & Whooshes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Security & Terms</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li><span>Temporary 10-Min Sessions</span></li>
              <li><span>Direct Stream Encryption</span></li>
              <li><span>No Account Required</span></li>
              <li><span>Full Lifetime Monetization</span></li>
              <li><span className="text-purple-600 font-semibold">support@cinevault.pro</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CineVault Digital Products. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Protected by Cloud Functions & Zero-Trust Session Enforcer.
          </p>
        </div>
      </div>
    </footer>
  );
};
