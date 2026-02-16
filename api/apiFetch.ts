import { getToken } from "../auth/auth.store";

export async function apiFetch(url: string, options?: RequestInit) {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
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
