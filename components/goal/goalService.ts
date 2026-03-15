import { API_BASE_URL } from "@/constants/api";
import { GoalListResponse } from "./goalModel";

const BASE_URL = API_BASE_URL;

export const getGoals = async (
  accountId: string,
  token: string,
  page: number,
  pageSize: number,
): Promise<GoalListResponse> => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/goal?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erreur récupération goals");
  }

  return response.json();
};

export const createGoal = async (
  accountId: string,
  walletId: string,
  name: string,
  amount: number,
  startingDate: string,
  endingDate: string,
  color: string,
  iconRef: string,
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
      body: JSON.stringify({
        accountId,
        walletId,
        name,
        amount,
        startingDate,
        endingDate,
        color,
        iconRef,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log("Erreur API :", errorData);
    throw new Error("Erreur création goal");
  }

  return response.json();
};

export const updateGoal = async (
  accountId: string,
  walletId: string,
  goalId: string,
  name: string,
  amount: number,
  startingDate: string,
  endingDate: string,
  color: string,
  iconRef: string,
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
      body: JSON.stringify({
        accountId,
        name,
        amount,
        walletId,
        startingDate,
        endingDate,
        color,
        iconRef,
        goalId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Erreur modification goal");
  }

  return response.json();
};

export const archiveGoal = async (
  accountId: string,
  walletId: string,
  goalId: string,
  token: string,
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
    throw new Error("Erreur archivage goal");
  }

  return response.json();
};
