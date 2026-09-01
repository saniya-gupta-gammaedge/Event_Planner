import { API_URL } from "./api";

/**
 * Every admin fetch goes through this so a 401 (bad/expired token) logs us
 * out in one place, wherever the call originates (AdminLawn, LawnRequestsPanel, ...).
 */
export async function adminFetch(path, token, onExpired, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    onExpired();
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Request failed");
  }

  return res.status === 204 ? null : res.json();
}
