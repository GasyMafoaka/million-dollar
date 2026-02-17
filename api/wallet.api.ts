import { getToken } from "../auth/auth.store";

const API_URL = "http://localhost:8080";

export const walletApi = {
  async list(accountId: string, page = 1, pageSize = 10) {
    const token = await getToken();
    const res = await fetch(
      `${API_URL}/account/${accountId}/wallet?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },

  async create(accountId: string, payload: any) {
    const token = await getToken();
    const res = await fetch(`${API_URL}/account/${accountId}/wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },

  async update(accountId: string, walletId: string, payload: any) {
    const token = await getToken();
    const res = await fetch(
      `${API_URL}/account/${accountId}/wallet/${walletId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },

  async archive(accountId: string, walletId: string) {
    const token = await getToken();
    const res = await fetch(
      `${API_URL}/account/${accountId}/wallet/${walletId}/archive`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },

  async updateAutomaticIncome(
    accountId: string,
    walletId: string,
    payload: any,
  ) {
    const token = await getToken();
    const res = await fetch(
      `${API_URL}/account/${accountId}/wallet/${walletId}/automaticIncome`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  },
};
