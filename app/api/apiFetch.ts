export async function apiFetch(url: string, options?: RequestInit) {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
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
