import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCcw, ArrowLeft, HelpCircle } from 'lucide-react';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was canceled or declined by the bank.';

  return (
    <div className="max-w-xl mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center">
      <div className="w-full p-8 sm:p-10 rounded-3xl bg-[#11131a] border border-rose-500/30 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Payment Not Completed</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {reason}
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-400 text-left mb-6 space-y-2">
          <div className="font-semibold text-gray-300">Tips to complete your payment instantly:</div>
          <div className="text-purple-300">• <strong className="text-white">Use UPI QR Code:</strong> When Razorpay opens, choose "UPI QR Code" and scan with PhonePe, Google Pay, or Paytm. It verifies in 5 seconds without timeout delays.</div>
          <div>• If using UPI App Intent, ensure you switch to your payment app and enter your UPI PIN right away.</div>
          <div>• Ensure internet connectivity is stable during payment.</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <RefreshCcw className="w-4 h-4" /> Return to Store & Retry
          </Link>
          <a
            href="mailto:support@qrafter.online"
            className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm border border-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> Need Help?
          </a>
        </div>
      </div>
    </div>
  );
};
