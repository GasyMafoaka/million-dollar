import { API_BASE_URL } from "@/constants/api";
import { getToken } from "../auth/auth.store";

export interface Label {
  id: string;
  name: string;
}

export const labelsApi = {
  async list(accountId: string): Promise<Label[]> {
    const token = await getToken();

    const res = await fetch(
      `${API_BASE_URL}/account/${accountId}/label?page=1&pageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) throw new Error("Erreur récupération labels");

    const data = await res.json();

    return data.values;
  },
};
