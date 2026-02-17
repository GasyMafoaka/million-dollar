import React, { createContext, useContext, useEffect, useState } from "react";
import { walletApi } from "../api/wallet.api";
import { useSession } from "../auth/useSession";

const Ctx = createContext<any>(null);

export const WalletProvider = ({ children }: any) => {
  const { accountId } = useSession();
  const [wallets, setWallets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = async () => {
    if (!accountId || !hasMore) return;
    const res = await walletApi.list(accountId, page, 10);
    setWallets((p) => [...p, ...res.values]);
    setHasMore(res.values.length === 10);
    setPage((p) => p + 1);
  };

  const create = async (payload: any) => {
    if (!accountId) return;
    const created = await walletApi.create(accountId, payload);
    setWallets((p) => [created, ...p]);
  };

  const update = async (walletId: string, payload: any) => {
    if (!accountId) return;
    const updated = await walletApi.update(accountId, walletId, payload);
    setWallets((p) => p.map((w) => (w.id === walletId ? updated : w)));
  };

  const archive = async (walletId: string) => {
    if (!accountId) return;
    await walletApi.archive(accountId, walletId);
    setWallets((p) => p.filter((w) => w.id !== walletId));
  };

  const updateAutomaticIncome = async (walletId: string, payload: any) => {
    if (!accountId) return;
    const updated = await walletApi.updateAutomaticIncome(
      accountId,
      walletId,
      payload,
    );
    setWallets((p) => p.map((w) => (w.id === walletId ? updated : w)));
  };

  useEffect(() => {
    setWallets([]);
    setPage(1);
    setHasMore(true);
    fetchMore();
  }, [accountId]);

  return (
    <Ctx.Provider
      value={{
        wallets,
        fetchMore,
        create,
        update,
        archive,
        updateAutomaticIncome,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useWallets = () => useContext(Ctx);
