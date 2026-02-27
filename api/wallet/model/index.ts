export interface WalletAutomaticIncome {
  type?: "NOT_SPECIFIED" | "MENSUAL";
  amount?: number;
  paymentDay?: number;
}

export interface CreationWallet {
  name?: string;
  description?: string;
  type?: "CASH" | "MOBILE_MONEY" | "BANK" | "DEBT";
  color?: string;
  iconRef?: string;
}

export interface UpdateWallet extends CreationWallet {
  id?: string;
  accountId?: string;
  isActive?: boolean;
}

export interface Wallet extends UpdateWallet {
  amount?: number;
  walletAutomaticIncome?: WalletAutomaticIncome;
}

export interface PaginationResult {
  totalPage?: number;
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface WalletListResponse {
  pagination?: PaginationResult;
  values?: Wallet[];
}
