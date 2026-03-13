import React, { createContext, useContext, useState } from "react";

interface WalletContextType {
  selectedWalletId: string | null;
  setSelectedWalletId: (id: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

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
