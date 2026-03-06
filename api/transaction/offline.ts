import { getData, storeData } from "../../service/storage";
import { CreationTransaction, Transaction } from "./model";

const TRANSACTION_KEY_PREFIX = "offline_transactions_";

export const offlineGetAllTransactions = async (
  accountId: string,
): Promise<Transaction[]> => {
  const transactions = await getData<Transaction[]>(
    `${TRANSACTION_KEY_PREFIX}${accountId}`,
  );
  return transactions || [];
};

export const offlineCreateOneTransaction = async (
  accountId: string,
  walletId: string,
  transaction: CreationTransaction,
): Promise<Transaction> => {
  const transactions = await offlineGetAllTransactions(accountId);
  const newTransaction: Transaction = {
    ...transaction,
    id: Math.random().toString(),
    walletId,
  };
  await storeData(`${TRANSACTION_KEY_PREFIX}${accountId}`, [
    newTransaction,
    ...transactions,
  ]);
  return newTransaction;
};
