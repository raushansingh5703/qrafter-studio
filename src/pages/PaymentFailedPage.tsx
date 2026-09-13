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

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-400 text-left mb-6 space-y-1.5">
          <div className="font-semibold text-gray-300">Common reasons for payment issues:</div>
          <div>• Insufficient funds or card limits exceeded</div>
          <div>• Incorrect OTP or bank authentication failure</div>
          <div>• UPI app timeout or network interruption</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/bundles"
            className="flex-1 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Link>
          <a
            href="mailto:support@cinevault.pro"
            className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm border border-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};
