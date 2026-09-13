import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bundle } from '../types';
import { createOrder, verifyPayment, formatDriveImageUrl } from '../services/api';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, Lock, Sparkles, Loader2, CreditCard, AlertCircle } from 'lucide-react';

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
          name: 'CineVault Bundles',
          description: `Access for ${bundle.title}`,
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80',
          order_id: orderData.razorpayOrderId,
          prefill: {
            email: email,
            contact: phone,
          },
          theme: {
            color: '#9333ea',
          },
          modal: {
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
          navigate(`/payment-failed?reason=${encodeURIComponent(resp.error?.description || 'Payment rejected')}`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#11131a] border border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Instant Secure Checkout</h3>
            <p className="text-xs text-gray-400">No account required • Instant 10-min download</p>
          </div>
        </div>

        {/* Selected Bundle Summary */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 mb-6">
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
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-grow">
            <h4 className="font-semibold text-sm text-white line-clamp-1">{bundle.title}</h4>
            <p className="text-xs text-purple-400 font-medium">{bundle.category} • {bundle.clipCount}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-extrabold text-white">₹{bundle.price}</span>
              {bundle.originalPrice > bundle.price && (
                <span className="text-xs text-gray-500 line-through">₹{bundle.originalPrice}</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Checkout Form */}
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Address <span className="text-purple-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Your temporary download link and payment invoice will be sent here.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Phone Number <span className="text-gray-500 font-normal">(Optional for SMS receipt)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Securing Order & Session...</span>
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
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-6 text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Razorpay Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
