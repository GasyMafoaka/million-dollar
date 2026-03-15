import { API_BASE_URL } from "../../constants/api";
import { session } from "../../service/session";
import { CreationLabel, Label, LabelListResponse } from "./model";

export const getAllLabels = async (
  accountId: string,
  params?: {
    page?: number;
    pageSize?: number;
    name?: string;
  },
): Promise<LabelListResponse> => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
  if (params?.name) query.append("name", params.name);

  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/label?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch labels");
  }
  return response.json();
};

export const createOneLabel = async (
  accountId: string,
  label: CreationLabel,
): Promise<Label> => {
  const response = await fetch(`${API_BASE_URL}/account/${accountId}/label`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.getToken()}`,
    },
    body: JSON.stringify(label),
  });
  if (!response.ok) {
    throw new Error("Failed to create label");
  }
  return response.json();
};

export const getOneLabel = async (
  accountId: string,
  labelId: string,
): Promise<Label> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/label/${labelId}`,
    {
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch label");
  }
  return response.json();
};

export const updateOneLabel = async (
  accountId: string,
  labelId: string,
  label: Label,
): Promise<Label> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/label/${labelId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.getToken()}`,
      },
      body: JSON.stringify(label),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update label");
  }
  return response.json();
};

export const archiveOneLabel = async (
  accountId: string,
  labelId: string,
): Promise<Label> => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/label/${labelId}/archive`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to archive label");
  }
  return response.json();
};
