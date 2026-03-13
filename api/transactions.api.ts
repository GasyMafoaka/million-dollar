import { API_BASE_URL } from "@/constants/api";
import { getToken } from "../auth/auth.store";
import { CreationTransaction, Transaction } from "../types/Transaction";

export const transactionsApi = {
  async list(
    accountId: string,
    page = 1,
    pageSize = 10,
    filters?: any,
  ): Promise<Transaction[]> {
    try {
      const token = await getToken();
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.walletId ? { walletId: filters.walletId } : {}),
      });

      const res = await fetch(
        `${API_BASE_URL}/account/${accountId}/transaction?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Erreur récupération transactions");
      return res.json();
    } catch (err) {
      console.error("API list transactions error:", err);
      return [];
    }
  },

  async getOne(
    accountId: string,
    walletId: string,
    id: string,
  ): Promise<Transaction | null> {
    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return null;
      return res.json();
    } catch (err) {
      console.error("API getOne transaction error:", err);
      return null;
    }
  },

  async create(
    accountId: string,
    walletId: string,
    data: CreationTransaction,
  ): Promise<Transaction | null> {
    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) throw new Error("Erreur création transaction");
      return res.json();
    } catch (err) {
      console.error("API create transaction error:", err);
      return null;
    }
  },

  async update(
    accountId: string,
    walletId: string,
    id: string,
    data: Partial<Transaction>,
  ): Promise<Transaction | null> {
    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) throw new Error("Erreur modification transaction");
      return res.json();
    } catch (err) {
      console.error("API update transaction error:", err);
      return null;
    }
  },

  async remove(
    accountId: string,
    walletId: string,
    id: string,
  ): Promise<boolean> {
    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.ok;
    } catch (err) {
      console.error("API remove transaction error:", err);
      return false;
    }
  },
};
