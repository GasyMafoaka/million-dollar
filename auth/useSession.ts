import { useEffect, useState } from "react";

export function useSession() {
  const [accountId, setAccountId] = useState<string | null>(null);

  /* useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      const payload = decodeJWT(token);
      setAccountId(payload.accountId);
    });
  }, []);*/

  useEffect(() => {
    setAccountId("account-1");
  }, []);

  return { accountId };
}
