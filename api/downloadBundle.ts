import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './_firebase';
import { setCorsHeaders, extractDriveFileId } from './_utils';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Method Not Allowed');
    return;
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const sessionId = url.searchParams.get('sessionId') || req.headers['x-download-session'];

    if (!sessionId || typeof sessionId !== 'string' || sessionId.length !== 64) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Invalid download session.');
      return;
    }

    const sessionRef = doc(db, 'downloadSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Download session does not exist.');
      return;
    }

    const sessionData = sessionSnap.data();
    const now = Date.now();
    const expiresAtMs = new Date(sessionData.expiresAt).getTime();
    const isPastExpiration = now >= expiresAtMs;

    if (isPastExpiration) {
      if (sessionData.status !== 'in_progress' || sessionData.downloadCompletedAt != null) {
        if (sessionData.status !== 'expired') {
          try {
            await updateDoc(sessionRef, { status: 'expired' });
          } catch (e) {}
        }
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Your 10-minute download access has expired.');
        return;
      }
    }

    // Verify order is paid
    const orderSnap = await getDoc(doc(db, 'orders', sessionData.orderId));
    if (!orderSnap.exists() || orderSnap.data()?.paymentStatus !== 'paid') {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Payment has not been confirmed for this order.');
      return;
    }

    // Retrieve private Google Drive File ID
    let driveFileId = '';
    try {
      const privateSnap = await getDoc(doc(db, 'bundles_private', sessionData.bundleId));
      if (privateSnap.exists()) {
        driveFileId = privateSnap.data()?.driveFileId || '';
      }
    } catch (e) {}

    // Fallback: Check public bundle record if not in private collection
    if (!driveFileId) {
      const bundleSnap = await getDoc(doc(db, 'bundles', sessionData.bundleId));
      if (bundleSnap.exists()) {
        const bData = bundleSnap.data();
        driveFileId = bData?.driveFileId || bData?.downloadLink || '';
      }
    }

    const cleanFileId = extractDriveFileId(driveFileId);

    if (!cleanFileId) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bundle download file is not configured.');
      return;
    }

    // Mark session as in_progress and record download count
    try {
      await updateDoc(sessionRef, {
        status: 'in_progress',
        downloadStartedAt: new Date().toISOString(),
        downloadCount: (sessionData.downloadCount || 0) + 1,
      });
    } catch (e) {}

    // Redirect directly to Google Drive download stream
    // Using confirm=t to bypass >100MB virus scan confirmation screen
    const directDownloadUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(cleanFileId)}&export=download&confirm=t`;

    res.writeHead(302, {
      Location: directDownloadUrl,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    res.end();
  } catch (error: any) {
    console.error('downloadBundle Serverless Function error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal download processing error.');
  }
}
