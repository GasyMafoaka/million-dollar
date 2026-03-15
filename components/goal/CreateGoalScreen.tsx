import { createGoal } from "@/components/goal/goalService";
import { session } from "@/service/session";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CreationGoal } from "../../api/goal/model/index";
import { RootStackParamList } from "../../navigation/index";

type Props = NativeStackScreenProps<RootStackParamList, "CreateGoal">;

export default function CreateGoalScreen({ navigation, route }: Props) {
  const walletId = (route.params as any)?.walletId || "";

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
  );

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const color1 = "#264653";
  const accountId = session.getAccount()?.id || "";

  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleCreate = async () => {
    if (!name || !amount) {
      Alert.alert("Error", "Please fill in the name and the amount.");
      return;
    }

    if (startDate >= endDate) {
      Alert.alert(
        "Invalid Dates",
        "The start date must be before the end date.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const token = session.getToken() || "";

      const newGoal: CreationGoal = {
        accountId: accountId,
        name: name,
        amount: parseFloat(amount),
        walletId: walletId,
        startingDate: startDate.toISOString(),
        endingDate: endDate.toISOString(),
        iconRef: "target",
      };

      await createGoal(accountId, walletId, newGoal, token);

      Alert.alert("Success", "Your goal has been created!");
      navigation.navigate("GoalListScreen", { walletId: walletId });
    } catch (error: any) {
      console.error("CREATE ERROR:", error);
      Alert.alert("Error", "Could not create the goal.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Goal</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Goal Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Save for a car"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Target Amount (MGA)</Text>
        <TextInput
          style={styles.input}
          placeholder="500,000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.inputText}>{startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showStartPicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartChange}
          />
        )}

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.inputText}>{endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showEndPicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            minimumDate={startDate}
            onChange={onEndChange}
          />
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.7 }]}
          onPress={handleCreate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Goal</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontFamily: "MoreSugar",
    fontSize: 35,
    textAlign: "center",
    marginTop: 20,
    color: "#264653",
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontFamily: "MoreSugar",
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontFamily: "MoreSugar",
    fontSize: 14,
  },
  inputBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
  },
  inputText: {
    fontFamily: "MoreSugar",
    fontSize: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#264653",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    minHeight: 60,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 20,
  },
});
