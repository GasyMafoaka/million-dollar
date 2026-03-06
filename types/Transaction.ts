import { Label } from "@/api/label/model";

export interface Transaction {
  id: string;
  accountId: string;
  walletId: string;
  description: string;
  amount: number;
  type: "IN" | "OUT";
  date: string;
  labels?: Label[];
}

export type CreationTransaction = {
  description: string;
  amount: number;
  type: "IN" | "OUT";
  date: string;
  labels?: Label[];
};
