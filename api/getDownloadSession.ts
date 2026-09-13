import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './_firebase';
import { setCorsHeaders, formatDriveImageUrl } from './_utils';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

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
