import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { TransactionsProvider } from "../context/listTransactionContext";

export default function RootLayout() {
  useEffect(() => {
    const isExpoGo = Constants.executionEnvironment === "storeClient";
    const isNative = Platform.OS !== "web" && !isExpoGo;

    if (!isNative) return;

    try {
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
    } catch (e) {
      console.log("Notifications not available:", e);
    }
  }, []);

  return (
    <TransactionsProvider>
      <Stack />
    </TransactionsProvider>
  );
}
