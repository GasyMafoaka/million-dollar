import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { transactionsApi } from "../api/transactions.api";
import { useSession } from "../auth/useSession";
import { Transaction } from "../types/Transaction";
import {
  requestPermission,
  scheduleDailyNotification,
} from "../utils/notifications";

const PAGE_SIZE = 10;
const Ctx = createContext<any>(null);

export const TransactionsProvider = ({
  children,
  walletId,
}: {
  children: React.ReactNode;
  walletId: string | null;
}) => {
  const { accountId } = useSession();

  const [list, setList] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterType, setFilterType] = useState<"IN" | "OUT" | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [notificationHour, setNotificationHour] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMore = async () => {
    if (!accountId || !walletId || !hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const data = await transactionsApi.list(accountId, page, PAGE_SIZE, {
        type: filterType,
        walletId,
      });

      setList((prev) => {
        const merged = [...prev, ...data];

        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => String(t.id) === String(item.id)),
        );

        return unique;
      });

      setHasMore(data.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } finally {
      setLoadingMore(false);
    }
  };

  const add = async (data: Omit<Transaction, "id">) => {
    if (!accountId || !walletId) return;

    const created = await transactionsApi.create(accountId, walletId, data);
    setList((p) => [created, ...p]);
  };

  const updateItem = async (id: string, data: Partial<Transaction>) => {
    if (!accountId || !walletId) return;
    const updated = await transactionsApi.update(accountId, walletId, id, data);
    setList((p) => p.map((t) => (String(t.id) === String(id) ? updated : t)));
  };

  const removeItem = async (id: string) => {
    if (!accountId || !walletId) return;
    await transactionsApi.remove(accountId, walletId, id);
    setList((p) => p.filter((t) => String(t.id) !== String(id)));
  };

  const filteredList = useMemo(() => {
    let result = list;
    if (selectedDate)
      result = result.filter((t) => t.date.startsWith(selectedDate));
    return result;
  }, [list, selectedDate]);

  useEffect(() => {
    if (!accountId || !walletId) return;

    const load = async () => {
      const data = await transactionsApi.list(accountId, 1, PAGE_SIZE, {
        type: filterType,
        walletId,
      });

      setList(data);
      setHasMore(data.length === PAGE_SIZE);
      setPage(2);
    };

    load();
  }, [filterType, accountId, walletId]);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    scheduleDailyNotification(list, notificationHour);
  }, [list, notificationHour]);

  return (
    <Ctx.Provider
      value={{
        list: filteredList,
        fetchMore,
        add,
        update: updateItem,
        remove: removeItem,
        selectedDate,
        setSelectedDate,
        filterType,
        setFilterType,
        notificationHour,
        setNotificationHour,
        loadingMore, // optionnel si tu veux afficher un loader
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useTransactions = () => useContext(Ctx);
