import { API_BASE_URL } from "@/constants/api";
import { LabelResponse } from "./label";

const BASE_URL = API_BASE_URL;

export const getLabels = async (
  accountId: string,
  token: string,
  page: number,
  pageSize: number,
  name: string = ""
): Promise<LabelResponse> => {

  const url = `${BASE_URL}/account/${accountId}/label?page=${page}&pageSize=${pageSize}&name=${name}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur récupération labels");
  }

  return response.json();
};

export const createLabel = async (
  accountId: string,
  name: string,
  color: string,
  iconRef: string,
  token: string
) => {

  const response = await fetch(`${BASE_URL}/account/${accountId}/label`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      color,
      iconRef,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur création label");
  }

  return response.json();
};

export const updateLabel = async (
  accountId: string,
  labelId: string,
  name: string,
  color: string,
  iconRef: string,
  token: string
) => {

  const response = await fetch(
    `${BASE_URL}/account/${accountId}/label/${labelId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        color,
        iconRef,
        accountId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Erreur modification label");
  }

  return response.json();
};

export const archiveLabel = async (
  labelId: string,
  token: string,
  accountId: string
) => {

  const response = await fetch(
    `${BASE_URL}/account/${accountId}/label/${labelId}/archive`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur archivage label");
  }

  return response.json();
};