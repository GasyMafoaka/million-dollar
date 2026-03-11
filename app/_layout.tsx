import { useSelectedWallet, WalletProvider } from "@/context/WalletContext";
import AppNavigator from "@/navigation";
import { session } from "@/service/session";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { TransactionsProvider } from "../context/listTransactionContext";

SplashScreen.preventAutoHideAsync();

function AppWithWallet() {
  const { selectedWalletId } = useSelectedWallet();

  return (
    <TransactionsProvider walletId={selectedWalletId}>
      <AppNavigator />
    </TransactionsProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });

  const [sessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await session.init();
      setSessionInitialized(true);
    };

    initialize();
  }, []);

  useEffect(() => {
    const initNotifications = async () => {
      const isExpoGo = Constants.executionEnvironment === "storeClient";
      const isNative = Platform.OS !== "web" && !isExpoGo;
      if (!isNative) return;

      try {
        const Notifications = require("expo-notifications");

        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") return;

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
    };

    initNotifications();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && sessionInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, sessionInitialized]);

  if ((!fontsLoaded && !fontError) || !sessionInitialized) {
    return null;
  }

  return (
    <WalletProvider>
      <AppWithWallet />
    </WalletProvider>
  );
}
