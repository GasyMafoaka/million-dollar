import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { transactionsApi } from "../api/transactions.api";
import { Transaction } from "../types/Transaction";
import {
  requestPermission,
  scheduleDailyNotification,
} from "../utils/notifications";

const PAGE_SIZE = 10;

type CtxType = {
  list: Transaction[];
  loading: boolean;
  fetchMore: () => void;
  add: (data: Omit<Transaction, "id">) => Promise<void>;
  update: (id: string, data: Partial<Transaction>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  selectedDate: string | null;
  setSelectedDate: (d: string | null) => void;
  filterType: string | null;
  setFilterType: (t: string | null) => void;
  notificationHour: number;
  setNotificationHour: (h: number) => void;
};

const Ctx = createContext<CtxType | null>(null);

export const TransactionsProvider = ({ children }: any) => {
  const [list, setList] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [notificationHour, setNotificationHour] = useState(20);

  const fetchMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const data = await transactionsApi.list(page, PAGE_SIZE, {
        type: filterType,
      });

      setList((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (e) {
      console.log("Erreur pagination", e);
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<Transaction, "id">) => {
    const created = await transactionsApi.create(data);
    setList((prev) => [created, ...prev]);
  };

  const updateItem = async (id: string, data: Partial<Transaction>) => {
    const updated = await transactionsApi.update(id, data);
    setList((prev) => prev.map((t) => (String(t.id) === id ? updated : t)));
  };

  const removeItem = async (id: string) => {
    await transactionsApi.remove(id);
    setList((prev) => prev.filter((t) => String(t.id) !== id));
  };

  const filteredList = useMemo(() => {
    let result = list;

    if (selectedDate)
      result = result.filter((t) => t.date.startsWith(selectedDate));

    return result;
  }, [list, selectedDate]);

  useEffect(() => {
    setList([]);
    setPage(1);
    setHasMore(true);
  }, [filterType]);

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
        loading,
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
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Provider manquant");
  return ctx;
};
