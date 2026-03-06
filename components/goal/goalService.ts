import { Goal, CreateGoal } from "./goalModel";
import { API_BASE_URL } from "@/constants/api";

const BASE_URL = API_BASE_URL;

export const getGoals = async (accountId: string): Promise<Goal[]> => {
  const response = await fetch(`${BASE_URL}/accounts/${accountId}/goal`);

  if (!response.ok) {
    throw new Error("Failed to fetch goals");
  }

  const data = await response.json();

  return data.values;
};

export const createGoal = async (
  accountId: string,
  walletId: string,
  goal: CreateGoal,
): Promise<Goal> => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/wallet/${walletId}/goal`,
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
