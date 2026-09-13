import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import * as crypto from 'crypto';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyC_NADbpFf8BLNvdMxECOrHTUxcqpeuZkY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'foods-90f69.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'foods-90f69',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'foods-90f69.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '445594432394',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:445594432394:web:30354062c14cfebf0b8e73',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'D1AOBb4otACDUQ0bz2WlNwfY';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-download-session');

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
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    if (!body || Object.keys(body).length === 0) {
      body = await new Promise((resolve) => {
        let raw = '';
        req.on('data', (chunk: any) => { raw += chunk; });
        req.on('end', () => {
          try { resolve(raw ? JSON.parse(raw) : {}); }
          catch { resolve({}); }
        });
        req.on('error', () => resolve({}));
      });
    }

    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body || {};

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
    res.end(JSON.stringify({ error: error.message || 'Payment verification failed.' }));
  }
}
