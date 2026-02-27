import { Transaction } from "../types/Transaction";

type TransactionWithWallet = Transaction & {
  walletId: string;
};

let transactions: TransactionWithWallet[] = [
  {
    id: 1,
    title: "Courses",
    description: "",
    amount: 25000,
    date: "2026-02-27T10:00:00",
    type: "OUT",
    walletId: "wallet-1",
  },
  {
    id: 2,
    title: "Salaire",
    description: "",
    amount: 800000,
    date: "2026-02-26T08:00:00",
    type: "IN",
    walletId: "wallet-1",
  },
];

export const mockDB = {
  getAll: () => transactions,

  setAll: (data: TransactionWithWallet[]) => {
    transactions = data;
  },
};
