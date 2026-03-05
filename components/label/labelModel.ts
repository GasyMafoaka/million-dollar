export interface LabelAutomaticIncome {
  type?: "NOT_SPECIFIED" | "MENSUAL";
  amount?: number;
  paymentDay?: number;
}

export interface CreationLabel {
  name?: string;
  color?: string;
  iconref?: string;
}

export interface Label extends CreationLabel {
  id?: string;
  accountId?: string;
}

export interface PaginationResult {
  totalPage?: number;
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface LabelListResponse {
  pagination?: PaginationResult;
  values?: Label[];
}
