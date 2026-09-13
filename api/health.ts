import { setCorsHeaders } from './_utils';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      status: 'healthy',
      platform: 'Vercel Serverless',
      timestamp: new Date().toISOString(),
    })
  );
}
