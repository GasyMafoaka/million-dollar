import { Label, labelsApi } from "@/api/label.api";
import { Wallet } from "@/api/wallet/model";
import { walletsApi } from "@/api/wallets.api";
import { useSession } from "@/auth/useSession";
import { useTransactions } from "@/context/listTransactionContext";
import { useSelectedWallet } from "@/context/WalletContext";
import { appStyles, color1 } from "@/styles/appStyles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const { accountId } = useSession();
  const { selectedWalletId } = useSelectedWallet();

  // 1. Params retrieval (for data persistence)
  const editingItem = route.params?.transaction;
  const returnedLabels = route.params?.selectedLabels;
  const preservedData = route.params?.currentForm; // Data saved before navigating away

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");
  
  const [labels, setLabels] = useState<Label[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Initial data loading
  const loadData = useCallback(async () => {
    if (!accountId) return;
    try {
      const [labelsData, walletsData] = await Promise.all([
        labelsApi.list(accountId),
        walletsApi.list(accountId)
      ]);
      setLabels(labelsData || []);
      setWallets(walletsData || []);
    } catch (e) {
      console.error("Error loading data", e);
    }
  }, [accountId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 3. PERSISTENCE LOGIC: Recover data after returning from selection screen
  useEffect(() => {
    if (preservedData) {
      setDescription(preservedData.description || "");
      setAmount(preservedData.amount || "");
      setDate(preservedData.date || "");
      setType(preservedData.type || "OUT");
    } 
    else if (editingItem) {
      setDescription(editingItem.description || "");
      setAmount(String(editingItem.amount || ""));
      setDate(editingItem.date ? editingItem.date.split("T")[0] : "");
      setType(editingItem.type || "OUT");
      if (editingItem.labels) {
        setSelectedLabels(editingItem.labels.map((l: any) => l.id));
      }
    }
  }, [preservedData, editingItem]);

  // 4. Handle specific labels return
  useEffect(() => {
    if (returnedLabels && Array.isArray(returnedLabels)) {
      setSelectedLabels(returnedLabels);
    }
  }, [returnedLabels]);

  const selectedWalletName = useMemo(() => {
    if (!selectedWalletId) return "Choose a wallet";
    const wallet = wallets.find((w) => w.id === selectedWalletId);
    return wallet ? wallet.name : "Selected Wallet";
  }, [wallets, selectedWalletId]);

  const selectedLabelNames = useMemo(() => {
    if (selectedLabels.length === 0) return "Choose labels";
    return labels
      .filter((l) => selectedLabels.includes(l.id))
      .map((l) => l.name)
      .join(", ");
  }, [labels, selectedLabels]);

  // Navigation utility to save state
  const navigateWithState = (screenName: string, extraParams = {}) => {
    navigation.navigate(screenName, {
      ...extraParams,
      currentForm: { description, amount, date, type } 
    });
  };

  const handleSubmit = async () => {
    if (!selectedWalletId) return Alert.alert("Error", "Please select a wallet");
    if (!description.trim() || !amount || !date) {
      return Alert.alert("Error", "All fields are required");
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return Alert.alert("Error", "Invalid date format (YYYY-MM-DD)");
    }

    const fullSelectedLabels = labels.filter((l) => selectedLabels.includes(l.id));

    const payload = {
      description: description.trim(),
      amount: Number(amount.replace(',', '.')),
      type,
      date: dateObj.toISOString(),
      labels: fullSelectedLabels,
      walletId: selectedWalletId
    };

    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await update(editingItem.id, payload);
      } else {
        await add(payload);
      }
      navigation.navigate("Transaction");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={appStyles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={localStyles.sectionTitle}>
        {editingItem ? "Edit Transaction" : "New Transaction"}
      </Text>

      <TextInput
        style={appStyles.textInput}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={appStyles.textInput}
        placeholder="Amount"
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

      <Pressable
        style={appStyles.textInput}
        onPress={() => navigateWithState("SelectWallet")}
      >
        <Text style={{ color: selectedWalletId ? "#000" : "#999" }}>
          📁 {selectedWalletName}
        </Text>
      </Pressable>

      <Pressable
        style={appStyles.textInput}
        onPress={() => navigateWithState("SelectLabels", { selectedLabels })}
      >
        <Text style={{ color: selectedLabels.length > 0 ? "#000" : "#999" }}>
          🏷️ {selectedLabelNames}
        </Text>
      </Pressable>

      <View style={localStyles.typeContainer}>
        <Pressable
          style={[
            appStyles.button,
            { flex: 1, backgroundColor: type === "IN" ? "#2a9d8f" : "#ccc", width : 100 },
          ]}
          onPress={() => setType("IN")}
        >
          <Text style={appStyles.buttonText}>Income</Text>
        </Pressable>

        <Pressable
          style={[
            appStyles.button,
            { flex: 1, backgroundColor: type === "OUT" ? "#e76f51" : "#ccc" },
          ]}
          onPress={() => setType("OUT")}
        >
          <Text style={appStyles.buttonText}>Expense</Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          appStyles.button, 
          { marginTop: 30, backgroundColor: isSubmitting ? "#999" : color1 }
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={appStyles.buttonText}>
            {editingItem ? "Save Changes" : "Create Transaction"}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 20,
    textAlign: "center"
  },
  typeContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20
  }
});