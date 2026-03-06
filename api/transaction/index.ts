import { API_BASE_URL } from "../../constants/api";
import { session } from "../../service/session";
import { CreationTransaction, Transaction } from "./model";

export const getAllTransactions = async (
  accountId: string | undefined,
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

  if (accountId == undefined && session.getAccount() == undefined) {
    throw new Error(`bot accountId and session.getAccount() are undefined`);
  }
  accountId = accountId ? accountId : session.getAccount()?.id;
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/transaction?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch transactions with code ${response.status}`,
    );
  }
  return response.json();
};

export const createOneTransaction = async (
  accountId: string | undefined,
  walletId: string,
  transaction: CreationTransaction,
): Promise<Transaction> => {
  if (accountId == undefined && session.getAccount() == undefined) {
    throw new Error(`bot accountId and session.getAccount() are undefined`);
  }
  accountId = accountId ? accountId : session.getAccount()?.id;
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.getToken()}`,
      },
      body: JSON.stringify({ ...transaction, walletId, accountId }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to create transaction with code ${response.status}`,
    );
  }
  return response.json();
};

export const getOneTransaction = async (
  accountId: string | undefined,
  walletId: string,
  transactionId: string,
): Promise<Transaction> => {
  if (accountId == undefined && session.getAccount() == undefined) {
    throw new Error(`bot accountId and session.getAccount() are undefined`);
  }
  accountId = accountId ? accountId : session.getAccount()?.id;
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch transaction");
  }
  return response.json();
};

export const updateOneTransaction = async (
  accountId: string | undefined,
  walletId: string,
  transactionId: string,
  transaction: Transaction,
): Promise<Transaction> => {
  if (accountId == undefined && session.getAccount() == undefined) {
    throw new Error(`bot accountId and session.getAccount() are undefined`);
  }
  accountId = accountId ? accountId : session.getAccount()?.id;
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.getToken()}`,
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
  accountId: string | undefined,
  walletId: string,
  transactionId: string,
): Promise<Transaction> => {
  if (accountId == undefined && session.getAccount() == undefined) {
    throw new Error(`bot accountId and session.getAccount() are undefined`);
  }
  accountId = accountId ? accountId : session.getAccount()?.id;
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
  return response.json();
};
