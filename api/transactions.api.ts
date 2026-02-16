import { Transaction } from "../types/Transaction";
import { apiFetch } from "./apiFetch";

export const transactionsApi = {
  async list(accountId: string, page: number, pageSize: number, filters?: any) {
    return apiFetch(
      `/account/${accountId}/transaction?page=${page}&pageSize=${pageSize}&type=${filters?.type ?? ""}`,
    );
  },

  async create(
    accountId: string,
    walletId: string,
    data: Omit<Transaction, "id">,
  ) {
    return apiFetch(`/account/${accountId}/wallet/${walletId}/transaction`, {
      method: "POST",
      body: JSON.stringify({
        amount: data.amount,
        date: data.date,
        description: data.title,
        type: data.type,
        labels: [{ id: "label-food" }],
      }),
    });
  },

  async update(
    accountId: string,
    walletId: string,
    id: string,
    data: Partial<Transaction>,
  ) {
    return apiFetch(
      `/account/${accountId}/wallet/${walletId}/transaction/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          id,
          amount: data.amount,
          date: data.date,
          description: data.title,
          type: data.type,
          labels: [{ id: "label-food" }],
        }),
      },
    );
  },

  async remove(accountId: string, walletId: string, id: string) {
    return apiFetch(
      `/account/${accountId}/wallet/${walletId}/transaction/${id}`,
      {
        method: "DELETE",
      },
    );
  },
};
