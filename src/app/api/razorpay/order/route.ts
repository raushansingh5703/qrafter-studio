import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const amount = 1900; // Rs. 19 (in paise: 19 * 100)
  const currency = 'INR';

  // Check if API keys exist. If not, run in Simulated Testing Mode.
  if (!keyId || !keySecret) {
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
    return NextResponse.json({
      success: true,
      simulated: true,
      orderId: mockOrderId,
      amount,
      currency,
      message: 'Developer mode: Simulated transaction'
    });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      simulated: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
