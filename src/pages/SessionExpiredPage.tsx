import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, ShieldAlert } from 'lucide-react';

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center text-slate-900">
      <div className="w-full p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 text-center shadow-xl shadow-slate-200/50">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Download Session Expired</h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          For digital asset protection, download sessions are active for 10 minutes following purchase. 
          This session has reached its server-side expiration limit and has been securely invalidated.
        </p>

        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 mb-6 text-left flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
          <span>
            If you started a download before the timer hit zero, your file stream will finish automatically. 
            If you need an additional download window, please email our support team with your order confirmation.
          </span>
        </div>

        <Link
          to="/bundles"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    </div>
  );
};
