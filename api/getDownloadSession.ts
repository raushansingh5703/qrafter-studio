import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

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

function formatDriveImageUrl(url?: string | null): string {
  if (!url) return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                    trimmed.match(/id=([a-zA-Z0-9_-]+)/) ||
                    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }
  return trimmed;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-download-session');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const sessionId = url.searchParams.get('sessionId') || req.headers['x-download-session'];

    if (!sessionId || typeof sessionId !== 'string' || sessionId.length !== 64) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ valid: false, error: 'Invalid or missing session identifier.' }));
      return;
    }

    const sessionRef = doc(db, 'downloadSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ valid: false, error: 'Download session not found.' }));
      return;
    }

    const sessionData = sessionSnap.data();
    const now = Date.now();
    const expiresAtMs = new Date(sessionData.expiresAt).getTime();
    const isPastExpiration = now >= expiresAtMs;
    const isActiveDownload = sessionData.status === 'in_progress';

    if (isPastExpiration && !isActiveDownload) {
      if (sessionData.status !== 'expired') {
        try {
          await updateDoc(sessionRef, { status: 'expired' });
        } catch (e) {}
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          valid: false,
          expired: true,
          message: 'Your 10-minute download session has expired.',
          orderId: sessionData.orderId,
        })
      );
      return;
    }

    const remainingSeconds = Math.max(0, Math.floor((expiresAtMs - now) / 1000));

    // Fetch public bundle metadata
    const bundleSnap = await getDoc(doc(db, 'bundles', sessionData.bundleId));
    const bundleData = bundleSnap.exists() ? bundleSnap.data() : {};

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        valid: true,
        expired: false,
        status: sessionData.status,
        remainingSeconds,
        expiresAt: sessionData.expiresAt,
        orderId: sessionData.orderId,
        downloadCount: sessionData.downloadCount || 0,
        bundle: {
          id: sessionData.bundleId,
          title: bundleData.title || 'Video Bundle Package',
          description: bundleData.description || '',
          thumbnail: formatDriveImageUrl(bundleData.thumbnail),
          category: bundleData.category || 'Creator Pack',
          clipCount: bundleData.clipCount || '500+ Clips',
          resolution: bundleData.resolution || '4K Ultra HD & 9:16 Vertical',
          fileSize: bundleData.fileSize || '1.8 GB Archive',
        },
      })
    );
  } catch (error: any) {
    console.error('getDownloadSession Serverless Function error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ valid: false, error: 'Unable to verify download session.' }));
  }
}
