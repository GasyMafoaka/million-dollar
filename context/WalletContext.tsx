import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WalletContextType {
  selectedWalletId: string | null;
  setSelectedWalletId: (id: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = "selected_wallet";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selectedWalletId, setSelectedWalletIdState] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setSelectedWalletIdState(saved);
    };

    load();
  }, []);

  const setSelectedWalletId = async (id: string | null) => {
    setSelectedWalletIdState(id);

    if (id) {
      await AsyncStorage.setItem(STORAGE_KEY, id);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <WalletContext.Provider value={{ selectedWalletId, setSelectedWalletId }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useSelectedWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useSelectedWallet must be used inside WalletProvider");
  }

  return context;
}
