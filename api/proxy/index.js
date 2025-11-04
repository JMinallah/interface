// Simple Vercel Serverless Function proxy.
// Place this file at: api/proxy.js (project root).
//
// It forwards requests from /api/proxy/* -> BACKEND_BASE_URL/*
// Keep BACKEND_BASE_URL as a server-side Vercel env var (recommended).
//
// Usage example from frontend:
//   const base = import.meta.env.VITE_API_URL || ''; // e.g. https://your-vercel-app.vercel.app
//   await fetch(`${base}/api/proxy/predict`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...}) });
//
// Notes:
// - Do NOT put secrets (HUGGINGFACE_TOKEN) in frontend envs.
// - This proxy keeps the browser talking HTTPS to Vercel; Vercel calls your HTTP EC2 backend server-side.

export default async function handler(req, res) {
  const BACKEND_BASE = process.env.BACKEND_BASE_URL || 'http://16.170.164.227:8000';

  try {
    // Build the backend path by stripping /api/proxy prefix
    const backendPath = req.url.replace(/^\/api\/proxy/, '') || '/';
    const targetUrl = BACKEND_BASE.replace(/\/$/, '') + backendPath;

    const fetchOptions = {
      method: req.method,
      headers: { ...req.headers },
    };
    // Remove host header to avoid forwarding Vercel's host
    delete fetchOptions.headers.host;

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // collect body
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      if (body.length) fetchOptions.body = body;
    }

    const backendRes = await fetch(targetUrl, fetchOptions);

    // Forward status and headers (filter hop-by-hop headers)
    res.status(backendRes.status);
    backendRes.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (!['transfer-encoding','connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailer','upgrade'].includes(k)) {
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
