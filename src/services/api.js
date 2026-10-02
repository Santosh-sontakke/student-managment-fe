const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export { API_BASE_URL };

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errorMessage =
      payload?.message ||
      payload?.error ||
      (payload?.details && Object.values(payload.details)[0]) ||
      'Request failed';
    throw new Error(errorMessage);
  }

  return payload;
}
