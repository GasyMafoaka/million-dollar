import axios from "axios";
import { Transaction } from "../types/Transaction";

const API_URL = "http://localhost:8080";

export const transactionsApi = {
  async list(page: number, pageSize: number, filters?: any) {
    const res = await axios.get(`${API_URL}/transactions`, {
      params: { page, pageSize, ...filters },
    });
    return res.data.data;
  },

  async create(data: Omit<Transaction, "id">) {
    const res = await axios.post(`${API_URL}/transactions`, data);
    return res.data;
  },

  async update(id: string, data: Partial<Transaction>) {
    const res = await axios.put(`${API_URL}/transactions/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    await axios.delete(`${API_URL}/transactions/${id}`);
  },
};
