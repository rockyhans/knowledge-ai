const API_BASE = 'https://knowledge-ai-qyhm.onrender.com/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  listItems: () => request('/items'),
  ingestNote: (payload) => request('/ingest', { method: 'POST', body: JSON.stringify({ type: 'note', ...payload }) }),
  ingestUrl: (payload) => request('/ingest', { method: 'POST', body: JSON.stringify({ type: 'url', ...payload }) }),
  query: (question) => request('/query', { method: 'POST', body: JSON.stringify({ question }) })
};
