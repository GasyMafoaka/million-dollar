import * as Notifications from "expo-notifications";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Transaction = any;

interface ListTransactionContextType {
  listTransaction: Transaction[];
  filteredTransactions: Transaction[];
  markedDates: Record<string, any>;
  loading: boolean;
  page: number;
  hasMore: boolean;
  limite: number;
  selectedDate: string | null;
  fetchData: () => Promise<void>;
  setLimite: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  removeListTransaction: (id: number) => Promise<void>;
}

const ListTransactionContext = createContext<
  ListTransactionContextType | undefined
>(undefined);

export const ListTransactionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listTransaction, setListTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limite, setLimite] = useState(20);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission notification refusée");
    }
  };

  const sendInstantNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const scheduleDailyNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: " Rappel quotidien",
        body: "Consulte tes transactions du jour",
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  };

  const notifyIfTransactionToday = (transactions: Transaction[]) => {
    const today = new Date().toISOString().split("T")[0];

    const hasToday = transactions.some((tx) => tx.date === today);

    if (hasToday) {
      sendInstantNotification(
        " Transaction détectée",
        "Tu as une transaction aujourd’hui",
      );
    }
  };

  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limite}`,
      );

      let data = await response.json();

      data = data.map((item: any) => ({
        ...item,
        date: `2026-02-${Math.floor(Math.random() * 28 + 1)
          .toString()
          .padStart(2, "0")}`,
      }));

      setListTransaction((prev) => {
        const newList = [...prev, ...data];
        notifyIfTransactionToday(newList);
        return newList;
      });

      setHasMore(data.length === limite);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedDate) return listTransaction;
    return listTransaction.filter((tx) => tx.date === selectedDate);
  }, [listTransaction, selectedDate]);

  const markedDates = useMemo(() => {
    const dates: Record<string, any> = {};

    listTransaction.forEach((tx) => {
      dates[tx.date] = { marked: true, dotColor: "blue" };
    });

    if (selectedDate) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
        selectedColor: "#4CAF50",
      };
    }

    return dates;
  }, [listTransaction, selectedDate]);

  const removeListTransaction = async (id: number) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });

    setListTransaction((prev) => prev.filter((tx) => tx.id !== id));
  };

  useEffect(() => {
    requestNotificationPermission();
    scheduleDailyNotification();
    fetchData();
  }, []);

  return (
    <ListTransactionContext.Provider
      value={{
        listTransaction,
        filteredTransactions,
        markedDates,
        loading,
        page,
        hasMore,
        limite,
        fetchData,
        setLimite,
        selectedDate,
        setSelectedDate,
        removeListTransaction,
      }}
    >
      {children}
    </ListTransactionContext.Provider>
  );
};

export const useListTransactionContext = () => {
  const context = useContext(ListTransactionContext);
  if (!context) {
    throw new Error("useListTransactionContext must be used inside provider");
  }
  return context;
};
