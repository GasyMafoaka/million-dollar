import { RootStackParamList } from "@/navigation";
import { updateGoal } from "@/components/goal/goalService";
import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "EditGoal">;

const color1 = "#264653";

export default function EditGoalScreen({ route, navigation }: Props) {
  const { goal } = route.params;

  const formatDate = (date?: string) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const [name, setName] = useState(goal.name || "");
  const [amount, setAmount] = useState(String(goal.amount || ""));
  const [startingDate, setStartingDate] = useState(formatDate(goal.startingDate));
  const [endingDate, setEndingDate] = useState(formatDate(goal.endingDate));
  const [color, setColor] = useState(goal.color || "#264653");
  const [iconRef, setIconRef] = useState(goal.iconRef || "");

  const accountId = session.getAccount()?.id || "";
  const token = session.getToken() || "";

  const handleUpdate = async () => {
    try {
      if (!goal.id || !goal.walletId) {
        Alert.alert("Erreur", "Goal ID ou Wallet ID manquant");
        return;
      }

      await updateGoal(
        accountId,
        goal.walletId,
        goal.id,
        name,
        Number(amount),
        startingDate,
        endingDate,
        color,
        iconRef,
        token
      );

      Alert.alert("Succès", "Goal updated !");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de modifier le goal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Goal</Text>

      <TextInput
        placeholder="Goal name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Target amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Starting date (YYYY-MM-DD)"
        value={startingDate}
        onChangeText={setStartingDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Ending date (YYYY-MM-DD)"
        value={endingDate}
        onChangeText={setEndingDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Color (#264653)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <TextInput
        placeholder="Icon reference"
        value={iconRef}
        onChangeText={setIconRef}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Goal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontFamily: "MoreSugar",
    fontSize: 35,
    marginBottom: 30,
  },

  input: {
    borderWidth: 2,
    borderColor: color1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontFamily: "MoreSugar",
    fontSize: 16,
    width: "90%",
  },

  button: {
    backgroundColor: color1,
    padding: 20,
    marginTop: 20,
    borderRadius: 15,
    width: "75%",
  },

  buttonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 20,
    textAlign: "center",
  },
});