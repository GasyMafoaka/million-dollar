import { getToken } from "@/auth/auth.store";
import { API_BASE_URL } from "@/constants/api";

export const walletsApi = {
  async list(accountId: string) {
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}/account/${accountId}/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    return data.values;
  },
};
