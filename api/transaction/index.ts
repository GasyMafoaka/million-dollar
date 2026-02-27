import { API_BASE_URL } from "../../constants/api";
import { CreationTransaction, Transaction } from "./model";

export const getAllTransactions = async (
  accountId: string,
  params?: {
    walletId?: string;
    startingDate?: string;
    endingDate?: string;
    type?: "IN" | "OUT";
    label?: string[];
    minAmount?: number;
    maxAmount?: number;
    sortBy?: "date" | "amount";
    sort?: "asc" | "desc";
  },
): Promise<Transaction[]> => {
  const query = new URLSearchParams();
  if (params?.walletId) query.append("walletId", params.walletId);
  if (params?.startingDate) query.append("startingDate", params.startingDate);
  if (params?.endingDate) query.append("endingDate", params.endingDate);
  if (params?.type) query.append("type", params.type);
  if (params?.label) {
    params.label.forEach((l) => query.append("label", l));
  }
  if (params?.minAmount !== undefined)
    query.append("minAmount", params.minAmount.toString());
  if (params?.maxAmount !== undefined)
    query.append("maxAmount", params.maxAmount.toString());
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sort) query.append("sort", params.sort);

  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/transaction?${query.toString()}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
};

export const createOneTransaction = async (
  accountId: string,
  walletId: string,
  transaction: CreationTransaction,
): Promise<Transaction> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }
  return response.json();
};

export const getOneTransaction = async (
  accountId: string,
  walletId: string,
  transactionId: string,
): Promise<Transaction> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch transaction");
  }
  return response.json();
};

export const updateOneTransaction = async (
  accountId: string,
  walletId: string,
  transactionId: string,
  transaction: Transaction,
): Promise<Transaction> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }
  return response.json();
};

export const removeOneTransaction = async (
  accountId: string,
  walletId: string,
  transactionId: string,
): Promise<Transaction> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
  return response.json();
};
