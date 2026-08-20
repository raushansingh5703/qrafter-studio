"use client";

import { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, Loader2, Sparkles, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    simulated: boolean;
    keyId?: string;
  } | null>(null);

  const [verifying, setVerifying] = useState(false);

  // Initialize the checkout order
  useEffect(() => {
    const createOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/razorpay/order', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
          setOrderData({
            orderId: data.orderId,
            amount: data.amount,
            currency: data.currency,
            simulated: data.simulated,
            keyId: data.keyId,
          });
        } else {
          setError(data.error || 'Failed to initialize payment order');
        }
      } catch (err: any) {
        console.error('Order init fetch error:', err);
        setError('Network error initializing order. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, []);

  // Inject Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Launch checkout (Real or Simulated)
  const handleCheckout = async () => {
    if (!orderData) return;

    if (orderData.simulated) {
      // Simulator mode: trigger verify simulated payment immediately
      setVerifying(true);
      setTimeout(async () => {
        try {
          const res = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 11),
              razorpay_signature: 'sig_mock',
              simulated: true
            })
          });
          const data = await res.json();
          if (data.verified) {
            onSuccess();
          } else {
            setError('Simulated verification failed');
          }
        } catch (e) {
          setError('Failed to contact verification API');
        } finally {
          setVerifying(false);
        }
      }, 1500);
      return;
    }

    // Real Mode: Load script and launch Razorpay Checkout
    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();
    setLoading(false);

    if (!isScriptLoaded) {
      setError('Unable to load Razorpay library. Check internet connectivity.');
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Qrafter Studio',
      description: 'HD Custom QR Code Unlock',
      order_id: orderData.orderId,
      handler: async function (response: any) {
        setVerifying(true);
        try {
          const res = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await res.json();
          if (verifyData.verified) {
            onSuccess();
          } else {
            setError('Payment signature verification failed. Please contact support.');
          }
        } catch (err) {
          setError('Verification connection error. Please do not close this window.');
        } finally {
          setVerifying(false);
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      notes: {
        purpose: 'HD QR Code export',
      },
      theme: {
        color: '#2563eb', // Blue theme
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      setError(`Payment failed: ${response.error.description}`);
    });
    paymentObject.open();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-800 dark:text-white font-outfit">Secure Checkout</span>
          </div>
          <button
            onClick={onClose}
            disabled={verifying}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Initializing transaction details...</p>
            </div>
          )}

          {verifying && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-bold text-emerald-650 dark:text-emerald-400">Verifying secure signature...</p>
              <p className="text-[10px] text-slate-400">Please do not close this window</p>
            </div>
          )}

          {!loading && !verifying && error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs space-y-2">
              <p className="font-bold">Transaction Failed</p>
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  onClose();
                }}
                className="w-full mt-2 bg-red-650 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg text-center cursor-pointer"
              >
                Go Back
              </button>
            </div>
          )}

          {!loading && !verifying && !error && orderData && (
            <div className="space-y-6">
              {/* Sandbox Badge */}
              {orderData.simulated && (
                <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Developer Test Mode Active</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                    No actual payment credentials were found. Click the button below to simulate checkout and test file exports.
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase">Item Description</h4>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">Vector Print HD QR Bundle</p>
                  </div>
                  <span className="text-lg font-extrabold text-blue-600 dark:text-blue-450 font-outfit">₹19</span>
                </div>

                <div className="pt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>SVG format: Scalable print-ready vector file</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>PNG format: Ultra HD 300 DPI print-ready image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>No watermarks, full commercial usage rights</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 cursor-pointer transition-transform active:scale-[0.99]"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{orderData.simulated ? 'Simulate Success Payment' : 'Pay ₹19 with Razorpay'}</span>
                </button>

                <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-400 font-medium">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>100% Stateless Security</span>
                  </div>
                  <span>•</span>
                  <span>Razorpay Verified Gateway</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
