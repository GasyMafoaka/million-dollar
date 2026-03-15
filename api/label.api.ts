import { API_BASE_URL } from "@/constants/api";
import { session } from "@/service/session";

export interface Label {
  id: string;
  name: string;
}

export const labelsApi = {
  async list(accountId: string): Promise<Label[]> {
    const token = await session.getToken();

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

    console.log("Labels API =", data);
    return data.values;
  },
};
