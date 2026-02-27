import { API_BASE_URL } from "../../constants/api";
import {
  CreationWallet,
  UpdateWallet,
  Wallet,
  WalletAutomaticIncome,
  WalletListResponse,
} from "./model";

export const getAllWallets = async (
  accountId: string,
  params?: {
    name?: string;
    isActive?: boolean;
    walletType?: string;
  },
): Promise<WalletListResponse> => {
  const query = new URLSearchParams();
  if (params?.name) query.append("name", params.name);
  if (params?.isActive !== undefined)
    query.append("isActive", params.isActive.toString());
  if (params?.walletType) query.append("walletType", params.walletType);

  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet?${query.toString()}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch wallets");
  }
  return response.json();
};

export const createOneWallet = async (
  accountId: string,
  wallet: CreationWallet,
): Promise<Wallet> => {
  const response = await fetch(`${API_BASE_URL}/account/${accountId}/wallet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wallet),
  });
  if (!response.ok) {
    throw new Error("Failed to create wallet");
  }
  return response.json();
};

export const getOneWallet = async (
  accountId: string,
  walletId: string,
): Promise<Wallet> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch wallet");
  }
  return response.json();
};

export const updateOneWallet = async (
  accountId: string,
  walletId: string,
  wallet: UpdateWallet,
): Promise<Wallet> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update wallet");
  }
  return response.json();
};

export const archiveOneWallet = async (
  accountId: string,
  walletId: string,
): Promise<Wallet> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/archive`,
    {
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to archive wallet");
  }
  return response.json();
};

export const updateOneWalletAutomaticIncome = async (
  accountId: string,
  walletId: string,
  automaticIncome: WalletAutomaticIncome,
): Promise<Wallet> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/automaticIncome`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(automaticIncome),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update automatic income");
  }
  return response.json();
};
