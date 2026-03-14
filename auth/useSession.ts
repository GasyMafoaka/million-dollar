import { useEffect, useState } from "react";
import { getToken } from "./auth.store";
import { decodeJWT } from "./jwt";

export function useSession() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();

      if (!token) return;

      try {
        const payload = decodeJWT(token);
        setAccountId(payload.accountId);
      } catch {
        setAccountId(null);
      }
    };

    load();
  }, []);

  return { accountId };
}
