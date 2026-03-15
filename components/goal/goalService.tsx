import { API_BASE_URL } from "@/constants/api";
import {
  CreationGoal,
  Goal,
  PaginationResult,
} from "../../api/goal/model/index";

const BASE_URL = API_BASE_URL;

export const getGoals = async (
  accountId: string,
  token: string,
  page: number,
  pageSize: number,
  walletId?: string,
): Promise<PaginationResult> => {
  let url = `${BASE_URL}/account/${accountId}/goal?page=${page}&pageSize=${pageSize}`;
  if (walletId && walletId.trim() !== "") {
    url += `&walletId=${walletId}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error fetching goals");
  }

  return response.json();
};

export const createGoal = async (
  accountId: string,
  walletId: string,
  goalData: CreationGoal,
  token: string,
) => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/wallet/${walletId}/goal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalData),
    },
  );

  if (!response.ok) {
    throw new Error("Error creating goal");
  }

  return response.json();
};

export const archiveGoal = async (
  goalId: string,
  walletId: string,
  token: string,
  accountId: string,
) => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/wallet/${walletId}/goal/${goalId}/archive`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error archiving goal");
  }

  return response.json();
};

export const updateGoal = async (
  accountId: string,
  goalId: string,
  walletId: string,
  goalData: Goal,
  token: string,
) => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/wallet/${walletId}/goal/${goalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalData),
    },
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Error updating goal");
  }

  return responseData;
};
