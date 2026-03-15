import CustomText from "@/components/CustomText";
import { session } from "@/service/session";
import { getData, storeData } from "@/service/storage";
import { Picker } from "@react-native-picker/picker";
import { useFonts } from "expo-font";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

const SETTINGS_KEY = "app_settings";

type AppSettings = {
  pushNotifications: boolean;
  recurrence: string;
  daysCount: string;
  currency: string;
  passwordlessLogin: boolean;
  subscription: string;
};

export default function Settings() {
  const navigation = useNavigation<any>();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [recurrence, setRecurrence] = useState("Weekly");
  const [daysCount, setDaysCount] = useState("30");
  const [currency, setCurrency] = useState("USD");
  const [passwordlessLogin, setPasswordlessLogin] = useState(false);
  const [subscription, setSubscription] = useState("Free");

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getData<AppSettings>(SETTINGS_KEY);

        if (savedSettings) {
          setPushNotifications(savedSettings.pushNotifications);
          setRecurrence(savedSettings.recurrence);
          setDaysCount(savedSettings.daysCount);
          setCurrency(savedSettings.currency);
          setPasswordlessLogin(savedSettings.passwordlessLogin);
          setSubscription(savedSettings.subscription);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    const settings: AppSettings = {
      pushNotifications,
      recurrence,
      daysCount,
      currency,
      passwordlessLogin,
      subscription,
    };

    try {
      await storeData(SETTINGS_KEY, settings);

      setFeedback({
        message: "Settings saved successfully!",
        type: "success",
      });

      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    } catch (error) {
      console.error(error);

      setFeedback({
        message: "Error saving settings.",
        type: "error",
      });

      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    }
  };

  const handleLogout = async () => {
    await session.logout();
    navigation.replace("SignIn", { redirectScreenName: "MainMenu" });
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>Settings</CustomText>

      {/* Toast Message */}
      {feedback && (
        <View
          style={[
            styles.feedbackContainer,
            feedback.type === "success" ? styles.success : styles.error,
          ]}
        >
          <CustomText style={styles.feedbackText}>
            {feedback.message}
          </CustomText>
        </View>
      )}

      {/* Push Notifications */}
      <View style={styles.card}>
        <View style={styles.row}>
          <CustomText style={styles.label}>
            Transaction Push Notifications
          </CustomText>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
        </View>
      </View>

      {/* Recurrence */}
      <View style={styles.card}>
        <CustomText style={styles.sectionTitle}>
          Notification Frequency
        </CustomText>
        <Picker
          selectedValue={recurrence}
          onValueChange={(itemValue) => setRecurrence(itemValue)}
        >
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
        </Picker>
      </View>

      {/* Days Count */}
      <View style={styles.card}>
        <CustomText style={styles.sectionTitle}>
          Expense Tracking Period (Days)
        </CustomText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={daysCount}
          onChangeText={setDaysCount}
        />
      </View>

      {/* Subscription */}
      <View style={styles.card}>
        <CustomText style={styles.sectionTitle}>
          Current Plan: {subscription}
        </CustomText>

        {subscription === "Free" && (
          <Pressable
            style={styles.premiumButton}
            onPress={() => setSubscription("Premium")}
          >
            <CustomText style={styles.buttonText}>
              Upgrade to Premium
            </CustomText>
          </Pressable>
        )}
      </View>

      {/* Currency */}
      <View style={styles.card}>
        <CustomText style={styles.sectionTitle}>Preferred Currency</CustomText>
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
        >
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="MGA" value="MGA" />
          <Picker.Item label="EUR" value="EUR" />
        </Picker>
      </View>

      {/* Passwordless Login */}
      <View style={styles.card}>
        <View style={styles.row}>
          <CustomText style={styles.label}>
            Enable Passwordless Login
          </CustomText>
          <Switch
            value={passwordlessLogin}
            onValueChange={setPasswordlessLogin}
          />
        </View>
      </View>

      {/* Save Button */}
      <View style={{ marginTop: 20 }}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <CustomText style={styles.saveButtonText}>Save Settings</CustomText>
        </Pressable>
      </View>

      {/* Logout Button */}
      <View style={{ marginTop: 15, marginBottom: 40 }}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <CustomText style={styles.logoutButtonText}>Logout</CustomText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30,
    color: "#264653",
    fontFamily: "MoreSugar",
  },

  card: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },

  premiumButton: {
    backgroundColor: "#264653",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: "#264653",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },

  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MoreSugar",
  },

  logoutButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },

  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MoreSugar",
  },

  feedbackContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  success: {
    backgroundColor: "#2ECC71",
  },

  error: {
    backgroundColor: "#E74C3C",
  },

  feedbackText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
