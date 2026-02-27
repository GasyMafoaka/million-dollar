import React from "react";
import WalletTransactionScreen from "@/components/transaction/WalletTransactionScreen";
import { useRoute } from "@react-navigation/native";
import { Wallet } from "@/api/wallet/model";

export default function WalletTransaction() {
  const route = useRoute();
  const { wallet } = route.params as { wallet: Wallet };

  return <WalletTransactionScreen wallet={wallet} />;
}
