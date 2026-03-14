export interface CreationGoal {
  accountId?: string;
  walletId?: string;
  name?: string;
  amount?: number;
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

export interface NavigationGoal {
  id: string;
  name?: string;
  amount?: number;
  startingDate?: string;
  endingDate?: string;
  color?: string;
  iconRef?: string;
  walletId?: string;
  accountId?: string;
}