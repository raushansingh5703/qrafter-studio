import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './_firebase';
import { setCorsHeaders, formatDriveImageUrl } from './_utils';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const bundlesCol = collection(db, 'bundles');
    const q = query(bundlesCol, where('active', '==', true));
    const snap = await getDocs(q);

    const bundles = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        thumbnail: formatDriveImageUrl(data.thumbnail),
        previewVideo: data.previewVideo || null,
        price: Number(data.price) || 0,
        originalPrice: Number(data.originalPrice) || 0,
        category: data.category || 'Creator Pack',
        clipCount: data.clipCount || '',
        resolution: data.resolution || '',
        fileSize: data.fileSize || '',
        active: Boolean(data.active),
        createdAt: data.createdAt || new Date().toISOString(),
      };
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ bundles }));
  } catch (error: any) {
    console.error('api/bundles error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to retrieve bundles.' }));
  }
}
