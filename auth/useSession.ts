import { session } from "@/service/session";
import { useEffect, useState } from "react";

export function useSession() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      await session.init();

      const account = session.getAccount();

      if (account) {
        setAccountId(account.id);
      }
    };

    load();
  }, []);

  return { accountId };
}
