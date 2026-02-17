import { getToken } from "../auth/auth.store";

const API_URL = "http://localhost:8080";

export const transactionsApi = {
  async list(accountId: string, page: number, pageSize: number, filters?: any) {
    const token = await getToken();
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.walletId ? { walletId: filters.walletId } : {}),
    });

    const res = await fetch(
      `${API_URL}/account/${accountId}/transaction?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) throw new Error("Erreur fetch transactions");
    return res.json();
  },

  async create(accountId: string, walletId: string, data: any) {
    const token = await getToken();
    const res = await fetch(
      `${API_URL}/account/${accountId}/wallet/${walletId}/transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },

  async update(accountId: string, walletId: string, id: string, data: any) {
    const token = await getToken();
    const res = await fetch(
      `${API_URL}/account/${accountId}/wallet/${walletId}/transaction/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },

  async remove(accountId: string, walletId: string, id: string) {
    const token = await getToken();
    await fetch(
      `${API_URL}/account/${accountId}/wallet/${walletId}/transaction/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },
};
