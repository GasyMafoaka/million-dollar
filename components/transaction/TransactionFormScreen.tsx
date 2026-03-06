import { useTransactions } from "@/context/listTransactionContext";
import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const editingItem = route.params?.transaction;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  useEffect(() => {
    if (editingItem) {
      setDescription(editingItem.description);
      setAmount(String(editingItem.amount));
      setDate(editingItem.date.split("T")[0]);
      setType(editingItem.type);
    }
  }, [editingItem]);

  const submit = async () => {
    if (!description || !amount || !date) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert("Erreur", "Le montant doit être un nombre");
      return;
    }

    const data = { description, amount: Number(amount), date, type };

    try {
      if (editingItem?.id) await update(editingItem.id, data);
      else await add(data);

      navigation.goBack();
    } catch {
      Alert.alert("Erreur", "Impossible d'enregistrer la transaction");
    }
  };

  return (
    <View style={appStyles.container}>
      <TextInput
        style={appStyles.textInput}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={appStyles.textInput}
        placeholder="Montant"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={appStyles.textInput}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={[
            appStyles.button,
            { backgroundColor: type === "IN" ? color1 : "#ccc" },
          ]}
          onPress={() => setType("IN")}
        >
          <Text style={appStyles.buttonText}>Entrée</Text>
        </Pressable>
        <Pressable
          style={[
            appStyles.button,
            { backgroundColor: type === "OUT" ? color1 : "#ccc" },
          ]}
          onPress={() => setType("OUT")}
        >
          <Text style={appStyles.buttonText}>Sortie</Text>
        </Pressable>
      </View>

      <Pressable style={appStyles.button} onPress={submit}>
        <Text style={appStyles.buttonText}>
          {editingItem ? "Modifier" : "Créer"}
        </Text>
      </Pressable>
    </View>
  );
}
