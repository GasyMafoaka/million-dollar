import { CreationWallet, Wallet, WalletListResponse } from "./model";

export const offlineGetAllWallets = async (
  _accountId: string,
): Promise<WalletListResponse> => {
  return {
    pagination: {
      totalPage: 1,
      page: 1,
      hasNext: false,
      hasPrev: false,
    },
    values: [
      {
        id: "1",
        name: "Main Cash (Offline)",
        description: "Personal Cash",
        type: "CASH",
        amount: 500,
        color: "#2a9d8f",
      },
      {
        id: "2",
        name: "Savings Account (Offline)",
        description: "Bank of America",
        type: "BANK",
        amount: 1500,
        color: "#264653",
      },
      {
        id: "3",
        name: "Mobile Money (Offline)",
        description: "Orange Money",
        type: "MOBILE_MONEY",
        amount: 200,
        color: "#e9c46a",
      },
    ],
  };
};

export const offlineCreateOneWallet = async (
  _accountId: string,
  wallet: CreationWallet,
): Promise<Wallet> => {
  return {
    ...wallet,
    id: Math.random().toString(),
    amount: 0,
    isActive: true,
  };
};
