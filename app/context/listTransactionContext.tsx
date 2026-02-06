import React ,  { createContext, useContext, useEffect, useMemo, useState } from "react";

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
}


const ListTransactionContext =
  createContext<ListTransactionContextType | undefined>(undefined);


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

  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limite}`
      );

      let data = await response.json();

      data = data.map((item: any) => ({
        ...item,
        date: `2026-02-${Math.floor(Math.random() * 28 + 1)
          .toString()
          .padStart(2, "0")}`,
      }));

      

      setListTransaction((prev) => [...prev, ...data]);
      setHasMore(data.length === limite);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(()=>{
          if(!selectedDate) return listTransaction;

          return listTransaction.filter((transaction)=>{
            return transaction.date === selectedDate;
          })
          
   },[listTransaction ,selectedDate]) 

   const markedDates = useMemo(() => {
    const dates: Record<string, any> = {};
    listTransaction.forEach((tx) => {
      if (tx.date) {
        dates[tx.date] = { marked: true, dotColor: "blue" };
      }
    });
    if (selectedDate) {
      dates[selectedDate] = { ...dates[selectedDate], selected: true, selectedColor: "#4CAF50" };
    }
    return dates;
  }, [listTransaction, selectedDate]);

  useEffect(() => {
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

      }}
    >
      {children}
    </ListTransactionContext.Provider>
  );
};


export const useListTransactionContext = () => {
  const context = useContext(ListTransactionContext);

  if (!context) {
    throw new Error(
      "useListTransactionContext must be used inside ListTransactionContextProvider"
    );
  }

  return context;
};
