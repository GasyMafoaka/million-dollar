import { useEffect, useState } from "react";
import { getToken } from "./auth.store";
import { decodeJWT } from "./jwt";

export function useSession() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      const payload = decodeJWT(token);
      setAccountId(payload.accountId);
    });
  }, []);

  return { accountId };
}
