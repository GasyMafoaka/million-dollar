import { API_BASE_URL } from "@/constants/api";
import { CreationLabel, Label, LabelResponse } from "./label";

const BASE_URL = API_BASE_URL;

export const getLabels = async (
  accountId: string,
  token: string,
  page: number = 1,
  pageSize: number = 10,
  name: string = "FOOD",
): Promise<LabelResponse> => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/label?page=${page}&pageSize=${pageSize}&name=${name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erreur récupération labels");
  }

  return response.json();
};

export const createLabel = async (
  accountId: string,
  data: CreationLabel,
): Promise<Label> => {
  const response = await fetch(`${BASE_URL}/account/${accountId}/label`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const updateLabel = async (
  accountId: string,
  labelId: string,
  data: Label,
): Promise<Label> => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/label/${labelId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  return response.json();
};

export const archiveLabel = async (
  accountId: string,
  labelId: string,
): Promise<Label> => {
  const response = await fetch(
    `${BASE_URL}/account/${accountId}/label/${labelId}/archive`,
    {
      method: "POST",
    },
  );

  return response.json();
};
