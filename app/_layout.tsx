import { session } from "@/service/session";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
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
    if ((loaded || error) && sessionInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, sessionInitialized]);

  if ((!loaded && !error) || !sessionInitialized) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
