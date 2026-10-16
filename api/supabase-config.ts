import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers so client calls work smoothly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = (
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim();

  const key = (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  if (req.method === 'GET') {
    return res.status(200).json({
      url,
      key,
      isConfigured: Boolean(url && key && url.startsWith('http'))
    });
  }

  if (req.method === 'POST') {
    // In Vercel serverless, dynamic config changes must be set via Vercel Project Settings
    return res.status(200).json({
      success: true,
      message: 'Environment credentials read from server environment variables.',
      config: {
        url,
        key,
        isConfigured: Boolean(url && key && url.startsWith('http'))
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
