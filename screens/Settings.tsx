import React, { useState } from "react";
import { useFonts } from "expo-font";
import {
  View,
  StyleSheet,
  Switch,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomText from "@/components/CustomText";

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [recurrence, setRecurrence] = useState("Weekly");
  const [daysCount, setDaysCount] = useState("30");
  const [currency, setCurrency] = useState("USD");
  const [passwordlessLogin, setPasswordlessLogin] = useState(false);
  const [subscription, setSubscription] = useState("Free");

  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>Settings</CustomText>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 30,
    color: "#264653",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
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
});
