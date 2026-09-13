import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, ShieldAlert } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center">
      <div className="w-full p-8 sm:p-10 rounded-3xl bg-[#11131a] border border-white/10 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Download Session Expired</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          For digital asset protection, download sessions are active for 10 minutes following purchase. 
          This session has reached its server-side expiration limit and has been securely invalidated.
        </p>

        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 mb-6 text-left flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
          <span>
            If you started a download before the timer hit zero, your file stream will finish automatically. 
            If you need an additional download window, please email our support team with your order confirmation.
          </span>
        </div>

        <Link
          to="/bundles"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    </div>
  );
};
