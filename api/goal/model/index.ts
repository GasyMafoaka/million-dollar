export interface CreationGoal {
  accountId: string;
  name: string;
  amount: number;
  walletId: string;
  startingDate: string;
  endingDate: string;
  iconRef?: string;
}

export interface Goal extends CreationGoal {
  id: string;
  color: string;
}

export interface PaginationResult {
  totalPage: number;
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  values: [];
}

export interface GoalListResponse {
  values?: Goal[];
  pagination?: PaginationResult;
}
