// API helpers — routes requests through the Vercel serverless proxy.
// Uses VITE_API_URL (public) when provided, otherwise uses relative paths so the browser
// talks to the same origin (and the proxy forwards to the EC2 backend server-side).

// Normalize the public API base (strip trailing slash)
const PUBLIC_API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

/**
 * Build a proxied URL path.
 * If VITE_API_URL is set, use `${VITE_API_URL}/api/proxy/...`
 * Otherwise use relative `/api/proxy/...` so the current origin is used.
 */
function buildProxyUrl(path) {
  // Ensure path starts with a single leading slash
  const p = path.startsWith('/') ? path : `/${path}`;
  if (PUBLIC_API_BASE) {
    return `${PUBLIC_API_BASE}/api/proxy${p}`;
  }
  return `/api/proxy${p}`;
}

export async function predict(payload) {
  const url = buildProxyUrl('/predict');
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      narrative: payload.narrative?.trim(),
      age: payload.age ? parseInt(payload.age) : null
    }),
  });

  if (!res.ok) {
    let text = await res.text();
    try {
      const j = JSON.parse(text);
      const detail = j.detail || j.error || JSON.stringify(j);
      throw new Error(`API ${res.status}: ${detail}`);
    } catch {
      throw new Error(`API ${res.status}: ${text}`);
    }
  }
  return res.json();
}

export async function getHealth() {
  const url = buildProxyUrl('/health');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function getInfo() {
  // backend info endpoint is /api/info; route via proxy as /api/proxy/api/info
  const url = buildProxyUrl('/api/info');
  const res = await fetch(url);
  if (!res.ok) {
    // Info endpoint might not exist; return sensible default
    return { model: "Child Trauma Assessment", version: "1.0" };
  }
  return res.json();
}
