import { Label, labelsApi } from "@/api/label.api";
import { Wallet, walletsApi } from "@/api/wallets.api";
import { useSession } from "@/auth/useSession";
import { useTransactions } from "@/context/listTransactionContext";
import { useSelectedWallet } from "@/context/WalletContext";
import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const { accountId } = useSession();
  const { selectedWalletId, setSelectedWalletId } = useSelectedWallet();

  const editingItem = route.params?.transaction;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  const [labels, setLabels] = useState<Label[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  /*
  ------------------------
  Charger transaction edit
  ------------------------
  */

  useEffect(() => {
    if (!editingItem) return;

    setDescription(editingItem.description);
    setAmount(String(editingItem.amount));
    setDate(editingItem.date.split("T")[0]);
    setType(editingItem.type);

    setSelectedLabels(editingItem.labels?.map((l: any) => l.id) || []);

    if (editingItem.walletId) {
      setSelectedWalletId(editingItem.walletId);
    }
  }, [editingItem, setSelectedWalletId]);

  /*
  ------------------------
  Charger labels
  ------------------------
  */

  useEffect(() => {
    const loadLabels = async () => {
      if (!accountId) return;

      const data = await labelsApi.list(accountId);

      setLabels(data);
    };

    loadLabels();
  }, [accountId]);

  /*
  ------------------------
  Charger wallets
  ------------------------
  */

  useEffect(() => {
    const loadWallets = async () => {
      if (!accountId) return;

      const data = await walletsApi.list(accountId);

      setWallets(data);
    };

    loadWallets();
  }, [accountId]);

  /*
  ------------------------
  Toggle label
  ------------------------
  */

  const toggleLabel = (id: string) => {
    setSelectedLabels((prev) => {
      if (prev.includes(id)) {
        return prev.filter((l) => l !== id);
      }

      return [...prev, id];
    });
  };

  /*
  ------------------------
  Submit
  ------------------------
  */

  const submit = async () => {
    if (!selectedWalletId) {
      Alert.alert("Erreur", "Veuillez sélectionner un wallet");
      return;
    }

    if (!selectedLabels.length) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un label");
      return;
    }

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
      if (editingItem?.id) {
        await update(editingItem.id, data);
      } else {
        await add(data);
      }

      navigation.goBack();
    } catch {
      Alert.alert("Erreur", "Impossible d'enregistrer");
    }
  };

  /*
  ------------------------
  UI
  ------------------------
  */

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

      {/* WALLET */}

      <Text style={{ marginTop: 15 }}>Wallet</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {wallets.map((wallet) => {
          const selected = selectedWalletId === wallet.id;

          return (
            <Pressable
              key={wallet.id}
              onPress={() => setSelectedWalletId(wallet.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: selected ? color1 : "#eee",
              }}
            >
              <Text style={{ color: selected ? "white" : "#333" }}>
                {wallet.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* LABELS */}

      <Text style={{ marginTop: 15 }}>Labels</Text>

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

      {/* TYPE */}

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

      {/* SUBMIT */}

      <Pressable style={appStyles.button} onPress={submit}>
        <Text style={appStyles.buttonText}>
          {editingItem ? "Modifier" : "Créer"}
        </Text>
      </Pressable>
    </View>
  );
}
