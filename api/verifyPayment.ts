import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './_firebase';
import { setCorsHeaders, parseRequestBody } from './_utils';
import * as crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'D1AOBb4otACDUQ0bz2WlNwfY';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing mandatory payment verification fields.' }));
      return;
    }

    // Cryptographic HMAC SHA256 Signature Verification
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const isMatch =
      expectedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(razorpaySignature, 'utf-8')
      );

    if (!isMatch) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid payment signature. Verification failed.' }));
      return;
    }

    // Fetch order from Firestore
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Referenced order could not be located.' }));
      return;
    }

    const orderData = orderSnap.data();

    // 1. Mark Order as Paid
    const nowIso = new Date().toISOString();
    await updateDoc(orderRef, {
      paymentStatus: 'paid',
      paymentReference: razorpayPaymentId,
      paidAt: nowIso,
      updatedAt: nowIso,
    });

    // 2. Generate 256-Bit Cryptographic Download Session Token (64 hex characters)
    const sessionId = crypto.randomBytes(32).toString('hex');
    const nowMs = Date.now();
    const tenMinutesMs = 10 * 60 * 1000;
    const expiresAtIso = new Date(nowMs + tenMinutesMs).toISOString();

    // 3. Save Download Session in Firestore
    await setDoc(doc(db, 'downloadSessions', sessionId), {
      sessionId,
      orderId,
      bundleId: orderData.bundleId,
      customerEmail: orderData.customerEmail,
      createdAt: nowIso,
      expiresAt: expiresAtIso,
      status: 'active',
      downloadStartedAt: null,
      downloadCompletedAt: null,
      downloadCount: 0,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully.',
        sessionId,
        expiresAt: expiresAtIso,
        orderId,
      })
    );
  } catch (error: any) {
    console.error('verifyPayment Serverless Function error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'An unexpected internal error occurred during payment verification.' }));
  }
}
