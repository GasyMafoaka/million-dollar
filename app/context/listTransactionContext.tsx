import React ,  { createContext, useContext, useEffect, useState } from "react";

type Transaction = any;

interface ListTransactionContextType {
  listTransaction: Transaction[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  limite: number;
  fetchData: () => Promise<void>;
  setLimite: React.Dispatch<React.SetStateAction<number>>;
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

  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limite}`
      );

      const data = await response.json();

      setListTransaction((prev) => [...prev, ...data]);
      setHasMore(data.length === limite);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ListTransactionContext.Provider
      value={{
        listTransaction,
        loading,
        page,
        hasMore,
        limite,
        fetchData,
        setLimite,
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
