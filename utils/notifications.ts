import Constants from "expo-constants";
import { Platform } from "react-native";
import { Transaction } from "../types/Transaction";

const isExpoGo = Constants.executionEnvironment === "storeClient";

const getNotificationsModule = () => {
  if (Platform.OS === "web" || isExpoGo) return null;
  return require("expo-notifications");
};

export const requestPermission = async () => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission refusée");
  }
};

export const calculateTodayExpense = (list: Transaction[]) => {
  const today = new Date().toISOString().split("T")[0];

  return list
    .filter((t) => t.type === "OUT" && t.date.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0);
};

export const scheduleDailyNotification = async (
  list: Transaction[],
  hour: number,
) => {
  const Notifications = getNotificationsModule();
  if (!Notifications) {
    console.log("Notifications désactivées (Expo Go ou Web)");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const total = calculateTodayExpense(list);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Résumé des dépenses",
      body: `Total aujourd'hui : ${total} Ar`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
};
