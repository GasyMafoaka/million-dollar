import { CreationTransaction, Transaction } from "./model";

export const offlineGetAllTransactions = async (
  _accountId: string,
): Promise<Transaction[]> => {
  return [];
};

export const offlineCreateOneTransaction = async (
  _accountId: string,
  _walletId: string,
  transaction: CreationTransaction,
): Promise<Transaction> => {
  return {
    ...transaction,
    id: Math.random().toString(),
  };
};
