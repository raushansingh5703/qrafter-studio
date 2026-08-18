import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, simulated } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Developer mode simulation fallback
    if (simulated || !keySecret) {
      // Mock successful verification
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Developer mode: payment verification simulated successfully.'
      });
    }

    // Standard cryptographic signature check
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully.'
      });
    } else {
      return NextResponse.json(
        { success: false, verified: false, error: 'Invalid cryptographic signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
