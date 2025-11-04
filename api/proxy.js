// Simple Vercel serverless proxy for forwarding requests to your backend EC2 instance.
//
// Place this file at: api/proxy.js (project root).
// Usage from frontend: fetch(`${VITE_API_URL}/api/proxy/predict`, { method: 'POST', ... })
//
// Note: This code uses the standard Node-compatible Vercel Serverless function format.
// For very large bodies or streaming, check Vercel function limits.

export default async function handler(req, res) {
  // Backend base URL (EC2). Keep it here, or move to Vercel Environment Variable
  // Example: process.env.BACKEND_BASE_URL = 'http://16.170.164.227:8000'
  const BACKEND_BASE = process.env.BACKEND_BASE_URL || 'http://16.170.164.227:8000';

  try {
    // Build backend URL by stripping the /api/proxy prefix
    const backendPath = req.url.replace(/^\/api\/proxy/, '') || '/';
    const targetUrl = BACKEND_BASE.replace(/\/$/, '') + backendPath;

    const fetchOptions = {
      method: req.method,
      headers: { ...req.headers }
    };

    // Do not forward host header; let fetch set it correctly
    delete fetchOptions.headers.host;

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Collect request body
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      if (body.length) fetchOptions.body = body;
    }

    const backendRes = await fetch(targetUrl, fetchOptions);

    // Forward status and selected headers
    res.status(backendRes.status);
    backendRes.headers.forEach((value, key) => {
      // Skip hop-by-hop headers
      if (!['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'upgrade'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const arrayBuffer = await backendRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Bad gateway', details: String(err) });
  }
}
