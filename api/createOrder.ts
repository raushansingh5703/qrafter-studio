import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
// @ts-ignore
import Razorpay from 'razorpay';
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

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TbMh90k1LPdv0i';
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
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
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

    const { bundleId, customerEmail, customerPhone } = body || {};

    if (!bundleId || typeof bundleId !== 'string') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Valid bundleId is required.' }));
      return;
    }

    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'A valid email address is required.' }));
      return;
    }

    // 1. Fetch Bundle from Firestore directly
    const bundleSnap = await getDoc(doc(db, 'bundles', bundleId));

    if (!bundleSnap.exists()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'The requested video bundle does not exist.' }));
      return;
    }

    const bundleData = bundleSnap.data();
    if (!bundleData.active) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'This bundle is currently unavailable for purchase.' }));
      return;
    }

    const verifiedPrice = Number(bundleData.price);
    if (isNaN(verifiedPrice) || verifiedPrice <= 0) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid bundle pricing configuration.' }));
      return;
    }

    const amountInPaise = Math.round(verifiedPrice * 100);
    const internalOrderId = `ord_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // 2. Create Razorpay Order
    let razorpayOrderId: string;
    try {
      const RazorpayClass: any = (Razorpay as any).default || Razorpay;
      const rzp = new RazorpayClass({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      const rzpOrder: any = await rzp.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: internalOrderId,
        notes: {
          bundleId,
          bundleTitle: bundleData.title || '',
          customerEmail,
        },
      });
      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr: any) {
      console.error('Razorpay order creation error:', rzpErr);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: rzpErr.error?.description || rzpErr.message || 'Payment gateway order creation failed.' }));
      return;
    }

    // 3. Store Pending Order in Firestore
    const orderRecord = {
      orderId: internalOrderId,
      bundleId,
      bundleTitle: bundleData.title || 'Video Bundle',
      amount: verifiedPrice,
      currency: 'INR',
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone ? customerPhone.trim() : null,
      razorpayOrderId,
      paymentStatus: 'pending',
      paymentReference: null,
      paidAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'orders', internalOrderId), orderRecord);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        orderId: internalOrderId,
        razorpayOrderId,
        amount: verifiedPrice,
        currency: 'INR',
        keyId: RAZORPAY_KEY_ID,
        bundle: {
          title: bundleData.title,
          price: verifiedPrice,
        },
      })
    );
  } catch (error: any) {
    console.error('createOrder Serverless Function error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'An unexpected internal error occurred.' }));
  }
}
