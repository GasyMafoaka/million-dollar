import MoreSugar from "@/assets/fonts/MoreSugar-Thin.ttf";
import { useSelectedWallet, WalletProvider } from "@/context/WalletContext";
import AppNavigator from "@/navigation";
import { session } from "@/service/session";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
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
  const [fontsLoaded] = useFonts({
    MoreSugar,
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
    if (fontsLoaded && sessionInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, sessionInitialized]);

  if (!fontsLoaded || !sessionInitialized) {
    return null;
  }

  return (
    <WalletProvider>
      <AppWithWallet />
    </WalletProvider>
  );
}
