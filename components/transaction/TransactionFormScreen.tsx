import { Label, labelsApi } from "@/api/label.api";
import { useSession } from "@/auth/useSession";
import { useTransactions } from "@/context/listTransactionContext";
import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const { accountId } = useSession();

  const editingItem = route.params?.transaction;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  useEffect(() => {
    if (editingItem) {
      setDescription(editingItem.description);
      setAmount(String(editingItem.amount));
      setDate(editingItem.date.split("T")[0]);
      setType(editingItem.type);

      setSelectedLabels(editingItem.labels?.map((l: any) => l.id) || []);
    }
  }, [editingItem]);

  useEffect(() => {
    const load = async () => {
      if (!accountId) return;

      const data = await labelsApi.list(accountId);

      setLabels(data);
    };

    load();
  }, [accountId]);

  const toggleLabel = (id: string) => {
    setSelectedLabels((prev) => {
      if (prev.includes(id)) {
        return prev.filter((l) => l !== id);
      }

      return [...prev, id];
    });
  };

  const submit = async () => {
    if (!description || !amount || !date) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");

      return;
    }

    const data = {
      description,

      amount: Number(amount),

      date,

      type,

      labels: selectedLabels.map((id) => ({ id })),
    };

    try {
      if (editingItem?.id) await update(editingItem.id, data);
      else await add(data);

      navigation.goBack();
    } catch {
      Alert.alert("Erreur", "Impossible d'enregistrer");
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

      <Text style={{ marginTop: 10 }}>Labels</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {labels.map((label) => {
          const selected = selectedLabels.includes(label.id);

          return (
            <Pressable
              key={label.id}
              onPress={() => toggleLabel(label.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: selected ? color1 : "#eee",
              }}
            >
              <Text style={{ color: selected ? "white" : "#333" }}>
                {label.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
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
