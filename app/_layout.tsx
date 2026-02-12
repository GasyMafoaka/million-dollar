import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { TransactionsProvider } from "../context/listTransactionContext";

export default function RootLayout() {
  useEffect(() => {
    const isExpoGo = Constants.executionEnvironment === "storeClient";

    if (Platform.OS !== "web" && !isExpoGo) {
      const Notifications = require("expo-notifications");

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  }, []);

  return (
    <TransactionsProvider>
      <Stack />
    </TransactionsProvider>
  );
}
