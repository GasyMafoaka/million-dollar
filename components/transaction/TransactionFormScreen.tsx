import { Label, labelsApi } from "@/api/label.api";
import { useSession } from "@/auth/useSession";
import { useTransactions } from "@/context/listTransactionContext";
import { useSelectedWallet } from "@/context/WalletContext";
import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const { accountId } = useSession();
  const { selectedWalletId } = useSelectedWallet();

  const editingItem = route.params?.transaction;
  const returnedLabels = route.params?.selectedLabels;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  /*
  ----------------
  charger labels
  ----------------
  */

  useEffect(() => {
    const load = async () => {
      if (!accountId) return;

      try {
        const data = await labelsApi.list(accountId);
        setLabels(data || []);
      } catch (e) {
        console.log("Erreur chargement labels", e);
      }
    };

    load();
  }, [accountId]);

  /*
  ----------------
  retour labels screen
  ----------------
  */

  useEffect(() => {
    if (returnedLabels && Array.isArray(returnedLabels)) {
      setSelectedLabels(returnedLabels);
    }
  }, [returnedLabels]);

  /*
  ----------------
  edit transaction
  ----------------
  */

  useEffect(() => {
    if (!editingItem) return;

    setDescription(editingItem.description);
    setAmount(String(editingItem.amount));
    setDate(editingItem.date?.split("T")[0]);
    setType(editingItem.type);

    if (editingItem.labels) {
      setSelectedLabels(editingItem.labels.map((l: any) => l.id));
    }
  }, [editingItem]);

  /*
  ----------------
  submit
  ----------------
  */

  const submit = async () => {
    if (!selectedWalletId) {
      Alert.alert("Erreur", "Sélectionner un wallet");
      return;
    }

    if (!description || !amount || !date) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }

    const data = {
      description,
      amount: Number(amount),
      type,
      date: new Date(date).toISOString(),
      labels: selectedLabels.map((id) => ({ id })),
    };

    try {
      if (editingItem?.id) {
        await update(editingItem.id, data);
      } else {
        await add(data);
      }

      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Erreur", "Impossible d'enregistrer");
    }
  };

  /*
  ----------------
  afficher noms labels
  ----------------
  */

  const selectedLabelNames = labels
    .filter((l) => selectedLabels.includes(l.id))
    .map((l) => l.name)
    .join(", ");

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
        placeholder="Date YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      {/* wallet */}

      <Pressable
        style={appStyles.textInput}
        onPress={() => navigation.navigate("SelectWallet")}
      >
        <Text>
          {selectedWalletId
            ? `Wallet: ${selectedWalletId}`
            : "Choisir un wallet"}
        </Text>
      </Pressable>

      {/* labels */}

      <Pressable
        style={appStyles.textInput}
        onPress={() =>
          navigation.navigate("SelectLabels", {
            selectedLabels,
          })
        }
      >
        <Text>
          {selectedLabels.length ? selectedLabelNames : "Choisir labels"}
        </Text>
      </Pressable>

      {/* type */}

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
