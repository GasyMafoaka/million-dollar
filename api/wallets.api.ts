import { API_BASE_URL } from "@/constants/api";
import { session } from "@/service/session";

export const walletsApi = {
  async list(accountId: string) {
    const token = session.getToken();

    const res = await fetch(`${API_BASE_URL}/account/${accountId}/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Erreur récupération wallets");
    }

    const data = await res.json();

    console.log("Wallets API =", data);
    return data.values ?? [];
  },
};
