import { getToken } from "../auth/auth.store";
import { API_URL } from "./config";

export async function apiFetch(url: string, options?: RequestInit) {
  const token = await getToken();

  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}
