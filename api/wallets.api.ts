import { API_BASE_URL } from "@/constants/api";
import { getToken } from "../auth/auth.store";

export interface Wallet {
  id: string;
  name: string;
  walletType: "CASH" | "MOBILE_MONEY" | "BANK" | "DEBT";
}

export const walletsApi = {
  async list(accountId: string): Promise<Wallet[]> {
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}/account/${accountId}/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Erreur récupération wallets");

    return res.json();
  },
};
