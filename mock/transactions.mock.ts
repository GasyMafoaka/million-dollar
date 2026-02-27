import { Transaction } from "../types/Transaction";
import { mockDB } from "./mockDB";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const transactionsMockApi = {
  async list(
    accountId: string,
    page: number,
    pageSize: number,
    filters?: { type?: "IN" | "OUT" | null; walletId?: string },
  ): Promise<Transaction[]> {
    await delay(300);

    let data = mockDB.getAll();

    if (filters?.walletId) {
      data = data.filter((t) => t.walletId === filters.walletId);
    }

    if (filters?.type) {
      data = data.filter((t) => t.type === filters.type);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  },

  async create(
    accountId: string,
    walletId: string,
    payload: Omit<Transaction, "id">,
  ): Promise<Transaction> {
    await delay(300);

    const newTransaction = {
      ...payload,
      id: Date.now(),
      date: payload.date + "T00:00:00",
      walletId,
    };

    const data = mockDB.getAll();
    mockDB.setAll([newTransaction, ...data]);

    return newTransaction;
  },

  async update(
    accountId: string,
    walletId: string,
    id: string,
    payload: Partial<Transaction>,
  ): Promise<Transaction> {
    await delay(300);

    const data = mockDB.getAll();
    const index = data.findIndex(
      (t) => t.id.toString() === id && t.walletId === walletId,
    );

    if (index === -1) throw new Error("Not found");

    const updated = { ...data[index], ...payload };

    data[index] = updated;
    mockDB.setAll([...data]);

    return updated;
  },

  async remove(accountId: string, walletId: string, id: string): Promise<void> {
    await delay(300);

    const data = mockDB
      .getAll()
      .filter((t) => !(t.id.toString() === id && t.walletId === walletId));

    mockDB.setAll(data);
  },
};
