import { Stack } from "expo-router";
import React from "react";
import { ListTransactionContextProvider } from "./context/listTransactionContext";

export default function RootLayout() {
  return (
    <ListTransactionContextProvider>
      <Stack />
    </ListTransactionContextProvider>
  );
}
