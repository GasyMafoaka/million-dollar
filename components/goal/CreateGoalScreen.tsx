import { session } from "@/service/session";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getAllWallets } from "@/api/wallet";
import { Wallet } from "@/api/wallet/model";
import { createGoal } from "@/components/goal/goalService";

type RootStackParamList = {
  Goal: undefined;
  CreateGoal: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CreateGoal">;

export default function CreateGoalScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [color, setColor] = useState("#2a9d8f");
  const [iconRef, setIconRef] = useState("target");

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletId, setWalletId] = useState("");

  const accountId = session.getAccount()?.id || "";

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const data = await getAllWallets(accountId);
      setWallets(data.values || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    if (!name || !amount || !walletId) {
      Alert.alert("Error", "Please fill in the required fields.");
      return;
    }

    try {
      await createGoal(
        accountId,
        walletId,
        name,
        Number(amount),
        startingDate,
        endingDate,
        color,
        iconRef,
        session.getToken() || "",
      );

      Alert.alert("Success", "Goal created!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not create the goal.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>New Goal</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Goal Name</Text>
        <TextInput
          placeholder="e.g. New Car"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Amount (MGA)</Text>
        <TextInput
          placeholder="0"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Wallet</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={walletId}
            onValueChange={(value) => setWalletId(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a wallet..." value="" color="#999" />
            {wallets.map((wallet) => (
              <Picker.Item
                key={wallet.id}
                label={wallet.name}
                value={wallet.id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={startingDate}
              onChangeText={setStartingDate}
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={endingDate}
              onChangeText={setEndingDate}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Hex Color</Text>
        <TextInput
          placeholder="#264653"
          value={color}
          onChangeText={setColor}
          style={styles.input}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  headerTitle: {
    fontFamily: "MoreSugar",
    fontSize: 32,
    color: "#264653",
    textAlign: "center",
    marginVertical: 20,
  },
  formGroup: {
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontFamily: "MoreSugar",
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    borderRadius: 12,
    fontFamily: "MoreSugar",
    backgroundColor: "white",
    fontSize: 16,
    color: "#264653",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    backgroundColor: "white",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createButton: {
    backgroundColor: "#264653",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  createButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 18,
  },
});
