import { createGoal } from "@/components/goal/goalService";
import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
    Alert,
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

export default function CreateGoalScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [walletId] = useState(session.getAccount()?.id || "");

  const color1 = "#264653";

  const handleCreate = async () => {
    if (!name || !amount) {
      Alert.alert("Erreur", "Veuillez remplir le nom et le montant.");
      return;
    }

    try {
      const accountId = session.getAccount()?.id || "";
      const token = session.getToken() || "";
      const finalStartDate = startDate
        ? new Date(startDate).toISOString()
        : new Date().toISOString();
      const finalEndDate = endDate
        ? new Date(endDate).toISOString()
        : new Date(
            new Date(finalStartDate).getTime() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString();

      const newGoal: CreationGoal = {
        accountId: accountId,
        name: name,
        amount: parseFloat(amount),
        walletId: walletId,
        startingDate: finalStartDate,
        endingDate: finalEndDate,
        color: color1,
        iconRef: "target",
      };

      await createGoal(accountId, walletId, newGoal, token);
      navigation.navigate("GoalListScreen");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Format de date invalide (utilisez AAAA-MM-JJ) ou erreur serveur.",
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Goal</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Goal Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Save for a car"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Target Amount (MGA)</Text>
        <TextInput
          style={styles.input}
          placeholder="500 000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Start Date (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (Default: Today)"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>End Date (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (Default: +30 days)"
          value={endDate}
          onChangeText={setEndDate}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create Goal</Text>
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
    padding: 12,
    marginBottom: 15,
    fontFamily: "MoreSugar",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#264653",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 20,
  },
});
