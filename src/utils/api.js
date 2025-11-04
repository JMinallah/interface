/**
 * API helper for the AWS-deployed FastAPI backend
 * Handles trauma assessment API calls with proper error handling
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://16.170.164.227';

export async function predict(payload) {
  const url = `${API_BASE}/predict`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      narrative: payload.narrative.trim(),
      age: payload.age ? parseInt(payload.age) : null
    }),
  });
  
  if (!res.ok) {
    // Try to extract JSON error, otherwise throw text
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
  const url = `${API_BASE}/health`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function getInfo() {
  const url = `${API_BASE}/api/info`;
  const res = await fetch(url);
  if (!res.ok) {
    // Info endpoint might not exist, return default
    return { model: "Child Trauma Assessment", version: "1.0" };
  }
  return res.json();
}