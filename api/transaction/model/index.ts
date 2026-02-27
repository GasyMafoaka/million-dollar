import { Label } from "../../label/model";

export interface CreationTransaction {
  date?: string;
  labels?: Label[];
  type?: "IN" | "OUT";
  description?: string;
  amount?: number;
  walletId?: string;
  accountId?: string;
}

export interface Transaction extends CreationTransaction {
  id?: string;
}
