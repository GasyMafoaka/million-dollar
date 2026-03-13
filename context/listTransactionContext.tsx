import { transactionsApi } from "@/api/transactions.api";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "../auth/useSession";
import { CreationTransaction, Transaction } from "../types/Transaction";
import {
  requestPermission,
  scheduleDailyNotification,
} from "../utils/notifications";

const PAGE_SIZE = 10;

type FilterType = "IN" | "OUT" | null;

interface TransactionsContextType {
  list: Transaction[];
  fetchMore: () => Promise<void>;
  add: (data: CreationTransaction) => Promise<void>;
  update: (id: string, data: Partial<Transaction>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  notificationHour: number;
  setNotificationHour: (hour: number) => void;
  loadingMore: boolean;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

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
  const [filterType, setFilterType] = useState<FilterType>(null);
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
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );
      });

      setHasMore(data.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const add = async (data: CreationTransaction) => {
    if (!accountId || !walletId) return;

    const created = await transactionsApi.create(accountId, walletId, data);

    if (!created) return;

    setList((prev) => [created, ...prev]);
  };

  const update = async (id: string, data: Partial<Transaction>) => {
    if (!accountId || !walletId) return;
    const updated = await transactionsApi.update(accountId, walletId, id, data);
    setList((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const remove = async (id: string) => {
    if (!accountId || !walletId) return;
    await transactionsApi.remove(accountId, walletId, id);
    setList((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredList = useMemo(() => {
    if (!selectedDate) return list;
    return list.filter((t) => t.date?.startsWith(selectedDate));
  }, [list, selectedDate]);

  useEffect(() => {
    if (!accountId || !walletId) return;

    const load = async () => {
      try {
        const data = await transactionsApi.list(accountId, 1, PAGE_SIZE, {
          type: filterType,
          walletId,
        });
        setList(data);
        setHasMore(data.length === PAGE_SIZE);
        setPage(2);
      } catch (error) {
        console.error(error);
      }
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
    <TransactionsContext.Provider
      value={{
        list: filteredList,
        fetchMore,
        add,
        update,
        remove,
        selectedDate,
        setSelectedDate,
        filterType,
        setFilterType,
        notificationHour,
        setNotificationHour,
        loadingMore,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context)
    throw new Error("useTransactions must be used inside TransactionsProvider");
  return context;
};
