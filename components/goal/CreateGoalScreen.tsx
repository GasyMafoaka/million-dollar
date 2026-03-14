import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { createGoal } from "@/components/goal/goalService";
import { getAllWallets } from "@/api/wallet";
import { Wallet } from "@/api/wallet/model";

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
  const [color, setColor] = useState("");
  const [iconRef, setIconRef] = useState("");

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
    try {
      if (!walletId) {
        Alert.alert("Erreur", "Veuillez choisir un wallet");
        return;
      }

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

      Alert.alert("Succès", "Goal created !");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de créer le goal");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Goal name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* WALLET SELECTOR */}

      <Picker
        selectedValue={walletId}
        onValueChange={(value) => setWalletId(value)}
        style={styles.input}
      >
        <Picker.Item label="Choose a wallet..." value="" />

        {wallets.map((wallet) => (
          <Picker.Item
            key={wallet.id}
            label={wallet.name}
            value={wallet.id}
          />
        ))}
      </Picker>

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
        placeholder="Color"
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

      <Button title="Create goal" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: "MoreSugar",
  },
});