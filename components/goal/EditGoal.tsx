import { updateGoal } from "@/components/goal/goalService";
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
import { RootStackParamList } from "../../navigation/index";

type Props = NativeStackScreenProps<RootStackParamList, "EditGoal">;

export default function EditGoalScreen({ route, navigation }: Props) {
  const { goal } = route.params;

  // États du formulaire
  const [name, setName] = useState(goal.name);
  const [amount, setAmount] = useState(goal.amount.toString());

  // États pour les dates
  const [startDate, setStartDate] = useState<Date>(new Date(goal.startingDate));
  const [endDate, setEndDate] = useState<Date>(new Date(goal.endingDate));

  // Contrôle de l'affichage des calendriers
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handlers pour les dates
  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleUpdate = async () => {
    if (!name || !amount) {
      Alert.alert("Error", "Name and amount are required.");
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
      setLoading(true);
      const accountId = session.getAccount()?.id || "";
      const token = session.getToken() || "";

      const updatedGoalData = {
        ...goal,
        name: name,
        amount: parseFloat(amount),
        startingDate: startDate.toISOString(),
        endingDate: endDate.toISOString(),
      };

      await updateGoal(
        accountId,
        goal.id,
        goal.walletId,
        updatedGoalData,
        token,
      );

      Alert.alert("Success", "Goal updated successfully!");
      navigation.navigate("GoalDetail", { goal: updatedGoalData });
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update the goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Goal</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Goal Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Target Amount (MGA)</Text>
        <TextInput
          style={styles.input}
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
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
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
    marginTop: 20,
    minHeight: 60,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 20,
  },
});
