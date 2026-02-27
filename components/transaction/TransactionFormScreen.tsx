import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useTransactions } from "../../context/listTransactionContext";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const editingItem = route.params?.transaction;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setAmount(String(editingItem.amount));
      setDate(editingItem.date.split("T")[0]);
      setType(editingItem.type);
    }
  }, [editingItem]);

  const submit = async () => {
    if (!title || !amount || !date)
      return alert("Tous les champs sont obligatoires");

    if (editingItem) {
      await update(editingItem.id, {
        title,
        amount: Number(amount),
        date,
        type,
      });
    } else {
      await add({
        title,
        description: "",
        amount: Number(amount),
        date,
        type,
      });
    }

    navigation.goBack();
  };

  return (
    <View style={appStyles.container}>
      <TextInput
        style={appStyles.textInput}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
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
        placeholder="YYYY-MM-DD"
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
