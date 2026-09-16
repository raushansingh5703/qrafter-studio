export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');

  if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]{20,}$/.test(id)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Valid Google Drive file ID is required' }));
    return;
  }

  // Redirect to direct Google Drive MP4 content stream
  const directStreamUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`;

  res.writeHead(302, {
    Location: directStreamUrl,
    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
  });
  res.end();
}
