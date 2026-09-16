import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bundle } from '../types';
import { createOrder, verifyPayment, formatDriveImageUrl } from '../services/api';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, Lock, Sparkles, Loader2, CreditCard, AlertCircle, Zap, RefreshCcw } from 'lucide-react';

interface CheckoutModalProps {
  bundle: Bundle;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ bundle, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address to receive your order receipt.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order on Backend (Validates price strictly on server)
      const orderData = await createOrder(bundle.id, email, phone);

      // Check if Razorpay script is loaded
      const Razorpay = (window as any).Razorpay;

      if (!orderData.isDemoMode && typeof Razorpay === 'function') {
        // Live / Test Mode with Razorpay SDK
        const options = {
          key: orderData.keyId,
          amount: Math.round(bundle.price * 100),
          currency: 'INR',
          name: bundle.title,
          description: `${bundle.category || 'Creator Pack'} • ${bundle.clipCount || 'Video Bundle'} (Instant Download)`,
          image: formatDriveImageUrl(bundle.thumbnail),
          order_id: orderData.razorpayOrderId,
          prefill: {
            email: email,
            contact: phone,
          },
          theme: {
            color: '#9333ea',
          },
          retry: {
            enabled: true,
            max_count: 4,
          },
          modal: {
            backdropclose: false,
            escape: false,
            handleback: true,
            ondismiss: () => {
              setLoading(false);
            },
          },
          handler: async (response: any) => {
            try {
              // 2. Cryptographically verify signature on server
              const verifyRes = await verifyPayment(
                orderData.orderId,
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );

              if (verifyRes.success) {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });
                onClose();
                navigate(`/download?session=${verifyRes.sessionId}`);
              } else {
                setError('Payment verification failed.');
              }
            } catch (verErr: any) {
              setError(verErr.message || 'Payment signature verification error.');
            } finally {
              setLoading(false);
            }
          },
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setLoading(false);
          const errorReason = resp.error?.reason;
          const errorDesc = resp.error?.description || 'Payment rejected';
          const isTimeout =
            errorReason === 'payment_timed_out' ||
            errorDesc.toLowerCase().includes('timed out') ||
            errorDesc.toLowerCase().includes('timeout');

          if (isTimeout) {
            setError(
              '⚠️ Payment timed out while waiting for UPI authorization. Click below to try again — we recommend scanning the Instant UPI QR Code with PhonePe, GPay, or Paytm for immediate approval.'
            );
          } else {
            setError(`${errorDesc}. Please try again or select another payment method.`);
          }
        });
        rzp.open();
      } else {
        // Sandbox Simulation Mode (works out-of-the-box before entering live Razorpay API keys)
        // Wait 1 second to simulate smooth secure payment gateway processing
        await new Promise((r) => setTimeout(r, 1200));

        const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 10)}`;
        const verifyRes = await verifyPayment(
          orderData.orderId,
          mockPaymentId,
          orderData.razorpayOrderId,
          'demo_verified_signature'
        );

        if (verifyRes.success) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
          onClose();
          navigate(`/download?session=${verifyRes.sessionId}`);
        } else {
          setError('Demo verification failed.');
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Instant Secure Checkout</h3>
            <p className="text-xs text-slate-500">No account required • Instant 10-min download</p>
          </div>
        </div>

        {/* Selected Bundle Summary */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 mb-6">
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
            className="w-16 h-16 rounded-xl object-cover border border-purple-200"
          />
          <div className="flex-grow">
            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{bundle.title}</h4>
            <p className="text-xs text-purple-700 font-semibold">{bundle.category} • {bundle.clipCount}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-slate-900">₹{bundle.price}</span>
              {bundle.originalPrice > bundle.price && (
                <span className="text-xs text-slate-400 line-through">₹{bundle.originalPrice}</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Checkout Form */}
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address <span className="text-purple-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Your temporary download link and invoice will be sent here.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Phone Number <span className="text-slate-400 font-normal">(Optional for SMS receipt)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
            />
          </div>

          {/* Fastest Checkout Tip */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-extrabold text-amber-950">⚡ Instant UPI Tip:</span> Select <span className="text-amber-800 font-black">UPI QR Code</span> on the payment screen & scan with PhonePe, GPay, or Paytm for 5-second instant approval.
            </div>
          </div>

          {loading && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-2 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-purple-900 font-bold text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Awaiting Payment Confirmation...</span>
              </div>
              <p className="text-xs text-slate-600">
                Please complete the payment in the Razorpay window or in your UPI mobile app.
              </p>
              <p className="text-[11px] text-amber-800 font-semibold">
                ⚠️ Keep this window open. Your download session will automatically launch upon confirmation!
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ₹{bundle.price} Securely</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Razorpay Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
