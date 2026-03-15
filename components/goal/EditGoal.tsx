import { updateGoal } from "@/components/goal/goalService";
import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
    Alert,
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
  const [name, setName] = useState(goal.name);
  const [amount, setAmount] = useState(goal.amount.toString());

  const handleUpdate = async () => {
    try {
      const accountId = session.getAccount()?.id || "";
      const token = session.getToken() || "";

      const updatedData = {
        ...goal,
        name,
        amount: parseFloat(amount),
      };

      await updateGoal(accountId, goal.id, goal.walletId, updatedData, token);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Echec de la mise à jour");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Goal</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: 40,
  },
  label: {
    fontFamily: "MoreSugar",
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontFamily: "MoreSugar",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#264653",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 20,
  },
});
