import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React from "react";
import { TransactionsProvider } from "./context/listTransactionContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return (
    <TransactionsProvider>
      <Stack />
    </TransactionsProvider>
  );
}
