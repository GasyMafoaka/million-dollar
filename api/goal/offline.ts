import { CreationGoal, Goal, GoalListResponse } from "./model";

export const offlineGetAllGoals = async (
  _accountId: string,
): Promise<GoalListResponse> => {
  return {
    pagination: {
      totalPage: 1,
      page: 1,
      hasNext: false,
      hasPrev: false,
    },
    values: [
      {
        id: "1",
        name: "Buy a car",
        amount: 5000,
        startingDate: new Date().toISOString(),
      },
    ],
  };
};

export const offlineCreateOneGoal = async (
  _accountId: string,
  _walletId: string,
  goal: CreationGoal,
): Promise<GoalListResponse> => {
  return {
    pagination: {
      totalPage: 1,
      page: 1,
      hasNext: false,
      hasPrev: false,
    },
    values: [
      {
        ...goal,
        id: Math.random().toString(),
      },
    ],
  };
};
