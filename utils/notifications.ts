import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Transaction } from "../types/Transaction";

const isExpoGo = Constants.executionEnvironment === "storeClient";

const getNotificationsModule = () => {
  if (Platform.OS === "web" || isExpoGo) return null;
  return Notifications;
};

export const requestPermission = async () => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  await Notifications.requestPermissionsAsync();
};

export const scheduleDailyNotification = async (
  list: Transaction[],
  hour: number,
) => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  if (!list.length) return;

  const today = new Date().toISOString().split("T")[0];

  const total = list
    .filter((t) => t.type === "OUT" && t.date.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0);

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Résumé des dépenses",
      body: `Total aujourd'hui : ${total} Ar`,
    },
    trigger: {
      hour,
      minute: 0,
      repeats: true,
    },
  });
};
