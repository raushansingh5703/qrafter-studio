import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Bundle, OrderInitResponse, PaymentVerifyResponse, DownloadSessionData } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function toDateString(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  return new Date().toISOString();
}

export function formatDriveImageUrl(url?: string | null): string {
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

export async function fetchBundles(): Promise<Bundle[]> {
  try {
    const bundlesCol = collection(db, 'bundles');
    const q = query(bundlesCol, where('active', '==', true));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => {
        const data = d.data();
        const rawScreenshots = data.dashboardScreenshots || (data.dashboardScreenshot ? [data.dashboardScreenshot] : []);
        const dashboardScreenshots = Array.isArray(rawScreenshots)
          ? rawScreenshots.map((url: string) => formatDriveImageUrl(url))
          : [];

        return {
          id: d.id,
          title: data.title || '',
          description: data.description || '',
          thumbnail: formatDriveImageUrl(data.thumbnail),
          previewVideo: data.previewVideo || undefined,
          dashboardScreenshots,
          price: Number(data.price) || 0,
          originalPrice: Number(data.originalPrice) || 0,
          category: data.category || 'Creator Pack',
          clipCount: data.clipCount || '',
          resolution: data.resolution || '',
          fileSize: data.fileSize || '',
          active: Boolean(data.active),
          createdAt: toDateString(data.createdAt),
        };
      });
    }
  } catch (err) {
    console.warn('Direct Firestore fetch error, falling back to API:', err);
  }

  // Fallback to backend API
  const res = await fetch(`${API_BASE}/bundles`);
  if (!res.ok) throw new Error('Failed to fetch video bundles');
  const data = await res.json();
  const rawList: Bundle[] = data.bundles || [];
  return rawList.map((b) => ({ ...b, thumbnail: formatDriveImageUrl(b.thumbnail) }));
}

export async function fetchBundleById(bundleId: string): Promise<Bundle> {
  try {
    const docRef = doc(db, 'bundles', bundleId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const rawScreenshots = data.dashboardScreenshots || (data.dashboardScreenshot ? [data.dashboardScreenshot] : []);
      const dashboardScreenshots = Array.isArray(rawScreenshots)
        ? rawScreenshots.map((url: string) => formatDriveImageUrl(url))
        : [];

      return {
        id: snap.id,
        title: data.title || '',
        description: data.description || '',
        thumbnail: formatDriveImageUrl(data.thumbnail),
        previewVideo: data.previewVideo || undefined,
        dashboardScreenshots,
        price: Number(data.price) || 0,
        originalPrice: Number(data.originalPrice) || 0,
        category: data.category || 'Creator Pack',
        clipCount: data.clipCount || '',
        resolution: data.resolution || '',
        fileSize: data.fileSize || '',
        active: Boolean(data.active),
        createdAt: toDateString(data.createdAt),
      };
    }
  } catch (err) {
    console.warn('Direct Firestore fetch error, falling back to API:', err);
  }

  const res = await fetch(`${API_BASE}/bundles/${bundleId}`);
  if (!res.ok) throw new Error('Bundle not found');
  const b = await res.json();
  return { ...b, thumbnail: formatDriveImageUrl(b.thumbnail) };
}

export async function createOrder(
  bundleId: string,
  customerEmail: string,
  customerPhone?: string
): Promise<OrderInitResponse> {
  const res = await fetch(`${API_BASE}/createOrder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bundleId, customerEmail, customerPhone }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to initialize order');
  }

  return res.json();
}

export async function verifyPayment(
  orderId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
): Promise<PaymentVerifyResponse> {
  const res = await fetch(`${API_BASE}/verifyPayment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Payment verification failed');
  }

  return res.json();
}

export async function getDownloadSession(sessionId: string): Promise<DownloadSessionData> {
  const res = await fetch(`${API_BASE}/getDownloadSession?sessionId=${encodeURIComponent(sessionId)}`);
  const data = await res.json();
  return data;
}

export function getDownloadUrl(sessionId: string): string {
  return `${API_BASE}/downloadBundle?sessionId=${encodeURIComponent(sessionId)}`;
}
