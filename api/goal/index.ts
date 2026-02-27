import { API_BASE_URL } from "../../constants/api";
import { CreationGoal, Goal, GoalListResponse } from "./model";

export const getAllGoals = async (
  accountId: string,
  params?: {
    walletId?: string;
    name?: string;
    minAmount?: number;
    maxAmount?: number;
    startingDateBeginning?: string;
    startingDateEnding?: string;
    endingDateBeginning?: string;
    endingDateEnding?: string;
    sort?: "asc" | "desc";
  },
): Promise<GoalListResponse> => {
  const query = new URLSearchParams();
  if (params?.walletId) query.append("walletId", params.walletId);
  if (params?.name) query.append("name", params.name);
  if (params?.minAmount !== undefined)
    query.append("minAmount", params.minAmount.toString());
  if (params?.maxAmount !== undefined)
    query.append("maxAmount", params.maxAmount.toString());
  if (params?.startingDateBeginning)
    query.append("startingDateBeginning", params.startingDateBeginning);
  if (params?.startingDateEnding)
    query.append("startingDateEnding", params.startingDateEnding);
  if (params?.endingDateBeginning)
    query.append("endingDateBeginning", params.endingDateBeginning);
  if (params?.endingDateEnding)
    query.append("endingDateEnding", params.endingDateEnding);
  if (params?.sort) query.append("sort", params.sort);

  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/goal?${query.toString()}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch goals");
  }
  return response.json();
};

export const createOneGoal = async (
  accountId: string,
  walletId: string,
  goal: CreationGoal,
): Promise<GoalListResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/goal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to create goal");
  }
  return response.json();
};

export const getOneGoal = async (
  accountId: string,
  walletId: string,
  goalId: string,
): Promise<Goal> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/goal/${goalId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch goal");
  }
  return response.json();
};

export const updateOneGoal = async (
  accountId: string,
  walletId: string,
  goalId: string,
  goal: Goal,
): Promise<Goal> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/goal/${goalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update goal");
  }
  return response.json();
};

export const archiveOneGoal = async (
  accountId: string,
  walletId: string,
  goalId: string,
): Promise<Goal> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/wallet/${walletId}/goal/${goalId}/archive`,
    {
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to archive goal");
  }
  return response.json();
};
