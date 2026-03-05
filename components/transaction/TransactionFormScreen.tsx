import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTransactions } from "../../context/listTransactionContext";

export default function TransactionFormScreen({ route, navigation }: any) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    const formatted = selectedDate.toISOString().split("T")[0];
    setDate(formatted);
    hideDatePicker();
  };
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
      alert("Tous les champs sont obligatoires");
      return;
    }

    const data = {
      description,
      amount: Number(amount),
      date,
      type,
    };

    if (editingItem) {
      await update(editingItem.id, data);
    } else {
      await add(data);
    }

    navigation.goBack();
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

      <Pressable style={appStyles.textInput} onPress={showDatePicker}>
        <Text>{date || "Choisir une date"}</Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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
