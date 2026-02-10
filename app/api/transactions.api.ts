import { Transaction } from "../types/Transaction";
import { apiFetch } from "./apiFetch";

const USE_FAKE_API = true;
let FAKE_DB: Transaction[] = [];

const PAGE_SIZE = 20;

const fake = {
  async list(page: number) {
    if (FAKE_DB.length === 0) {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();

      FAKE_DB = data.map((i: any) => ({
        id: i.id,
        title: i.title,
        description: i.body,
        amount: Math.floor(Math.random() * 50000),
        date: `2026-02-${String(Math.floor(Math.random() * 28 + 1)).padStart(
          2,
          "0",
        )}`,
      }));
    }

    const start = (page - 1) * PAGE_SIZE;
    return FAKE_DB.slice(start, start + PAGE_SIZE);
  },

  async create(tx: Omit<Transaction, "id">) {
    const newTx = { ...tx, id: Date.now() };
    FAKE_DB.unshift(newTx);
    return newTx;
  },

  async update(id: number, data: Partial<Transaction>) {
    FAKE_DB = FAKE_DB.map((tx) => (tx.id === id ? { ...tx, ...data } : tx));
  },

  async remove(id: number) {
    FAKE_DB = FAKE_DB.filter((tx) => tx.id !== id);
  },
};

const real = {
  list: (page: number) =>
    apiFetch(`/transactions?page=${page}&limit=${PAGE_SIZE}`),

  create: (tx: Omit<Transaction, "id">) =>
    apiFetch("/transactions", {
      method: "POST",
      body: JSON.stringify(tx),
    }),

  update: (id: number, data: Partial<Transaction>) =>
    apiFetch(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: number) => apiFetch(`/transactions/${id}`, { method: "DELETE" }),
};

export const transactionsApi = USE_FAKE_API ? fake : real;
