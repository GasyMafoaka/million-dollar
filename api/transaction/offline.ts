import { CreationTransaction, Transaction } from "./model";

export const offlineGetAllTransactions = async (
  _accountId: string,
): Promise<Transaction[]> => {
  return [
    {
      id: "1",
      amount: 50,
      type: "OUT",
      description: "Groceries",
      date: new Date().toISOString(),
    },
  ];
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
