import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { transactionsApi } from "../api/transactions.api";
import { Transaction } from "../types/Transaction";

const PAGE_SIZE = 20;

type TransactionsContextType = {
  list: Transaction[];
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  add: (tx: Omit<Transaction, "id">) => Promise<void>;
  update: (id: number, data: Partial<Transaction>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  selectedDate: string | null;
  setSelectedDate: (d: string | null) => void;
  markedDates: any;
};

const Ctx = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [list, setList] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const data = await transactionsApi.list(page, PAGE_SIZE);

      setList((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error("Erreur chargement transactions", e);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const add = async (tx: Omit<Transaction, "id">) => {
    const created = await transactionsApi.create(tx);
    setList((prev) => [created, ...prev]);
  };

  const update = async (id: number, data: Partial<Transaction>) => {
    await transactionsApi.update(id, data);
    setList((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx)),
    );
  };

  const remove = async (id: number) => {
    await transactionsApi.remove(id);
    setList((prev) => prev.filter((tx) => tx.id !== id));
  };

  const filtered = useMemo(() => {
    if (!selectedDate) return list;
    return list.filter((tx) => tx.date === selectedDate);
  }, [list, selectedDate]);

  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    list.forEach((tx) => {
      m[tx.date] = { marked: true };
    });

    if (selectedDate) {
      m[selectedDate] = {
        selected: true,
        selectedColor: "#4CAF50",
      };
    }

    return m;
  }, [list, selectedDate]);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  return (
    <Ctx.Provider
      value={{
        list: filtered,
        fetchMore,
        hasMore,
        loading,
        add,
        update,
        remove,
        selectedDate,
        setSelectedDate,
        markedDates,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useTransactions doit être utilisé dans TransactionsProvider",
    );
  }
  return ctx;
};
