import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCcw, ArrowLeft, HelpCircle } from 'lucide-react';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was canceled or declined by the bank.';

  return (
    <div className="max-w-xl mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center text-slate-900">
      <div className="w-full p-8 sm:p-10 rounded-3xl bg-white border border-rose-200 text-center shadow-xl shadow-slate-200/50">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Payment Not Completed</h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {reason}
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left mb-6 space-y-2">
          <div className="font-bold text-slate-800">Tips to complete your payment instantly:</div>
          <div className="text-purple-700">• <strong className="text-slate-900">Use UPI QR Code:</strong> When Razorpay opens, choose "UPI QR Code" and scan with PhonePe, Google Pay, or Paytm. It verifies in 5 seconds without timeout delays.</div>
          <div>• If using UPI App Intent, ensure you switch to your payment app and enter your UPI PIN right away.</div>
          <div>• Ensure your internet connection is stable during payment.</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
          >
            <RefreshCcw className="w-4 h-4" /> Return to Store & Retry
          </Link>
          <a
            href="mailto:support@qrafter.online"
            className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> Need Help?
          </a>
        </div>
      </div>
    </div>
  );
};
