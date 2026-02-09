import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React from "react";
import { ListTransactionContextProvider } from "./context/listTransactionContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <ListTransactionContextProvider>
      <Stack />
    </ListTransactionContextProvider>
  );
}
