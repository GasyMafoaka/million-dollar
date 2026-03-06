import { getData, storeData } from "../../service/storage";
import { CreationWallet, Wallet, WalletListResponse } from "./model";

const WALLET_KEY_PREFIX = "offline_wallets_";

export const offlineGetAllWallets = async (
  accountId: string,
): Promise<WalletListResponse> => {
  const wallets = await getData<Wallet[]>(`${WALLET_KEY_PREFIX}${accountId}`);

  if (!wallets) {
    return {
      pagination: {
        totalPage: 1,
        page: 1,
        hasNext: false,
        hasPrev: false,
      },
      values: [],
    };
  }

  return {
    pagination: {
      totalPage: 1,
      page: 1,
      hasNext: false,
      hasPrev: false,
    },
    values: wallets,
  };
};

export const offlineCreateOneWallet = async (
  accountId: string,
  wallet: CreationWallet,
): Promise<Wallet> => {
  const response = await offlineGetAllWallets(accountId);
  const wallets = response.values;

  const newWallet: Wallet = {
    ...wallet,
    id: Math.random().toString(),
    amount: 0,
    isActive: true,
  };

  await storeData(`${WALLET_KEY_PREFIX}${accountId}`, [...wallets, newWallet]);

  return newWallet;
};
