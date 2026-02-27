export interface CreationGoal {
  accountId?: string;
  name?: string;
  amount?: number;
  walletId?: string;
  startingDate?: string;
  endingDate?: string;
  color?: string;
  iconRef?: string;
}

export interface Goal extends CreationGoal {
  id?: string;
}

export interface PaginationResult {
  totalPage?: number;
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface GoalListResponse {
  pagination?: PaginationResult;
  values?: Goal[];
}
