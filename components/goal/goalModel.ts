export type Goal = {
  id: string;
  accountId: string;
  walletId: string;
  name: string;
  amount: number;
  startingDate: string;
  endingDate: string;
  color?: string;
  iconRef?: string;
};

export type CreateGoal = {
  accountId: string;
  walletId: string;
  name: string;
  amount: number;
  startingDate: string;
  endingDDate: string;
  color?: string;
  iconRef?: string;
};
