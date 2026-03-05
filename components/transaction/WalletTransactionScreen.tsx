import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import TransactionList from "./TransactionList";
import { FontAwesome } from "@expo/vector-icons";
import CreateTransactionModal from "./CreateTransactionModal";
import {
  getAllTransactions,
  createOneTransaction,
} from "@/api/transaction/index";
import {
  offlineGetAllTransactions,
  offlineCreateOneTransaction,
} from "@/api/transaction/offline";
import { Transaction, CreationTransaction } from "@/api/transaction/model";
import { Wallet } from "@/api/wallet/model";
import { session } from "@/service/session";

interface WalletTransactionScreenProps {
  wallet: Wallet;
}

export default function WalletTransactionScreen({
  wallet,
}: WalletTransactionScreenProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const accountId = session.getAccount()?.id;
    if (!accountId) {
      setError("No account found. Please sign in.");
      setLoading(false);
      return;
    }

    try {
      const response = await getAllTransactions(accountId, {
        walletId: wallet.id,
      });
      setTransactions(response || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch transactions. Displaying offline data.");
      const offlineResponse = await offlineGetAllTransactions(accountId);
      // Filter offline data by walletId
      const filtered = (offlineResponse || []).filter(
        (t) => t.walletId === wallet.id,
      );
      setTransactions(filtered);
    } finally {
      setLoading(false);
    }
  }, [wallet.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateTransaction = async (
    newTransaction: CreationTransaction,
  ) => {
    const accountId = session.getAccount()?.id;
    if (!accountId) {
      Alert.alert("Error", "No account found. Please sign in.");
      return;
    }

    try {
      const created = await createOneTransaction(
        accountId,
        wallet.id!,
        newTransaction,
      );
      setTransactions([created, ...transactions]);
      Alert.alert("Success", "Transaction added successfully");
    } catch (err) {
      console.error(err);
      const created = await offlineCreateOneTransaction(
        accountId,
        wallet.id!,
        newTransaction,
      );
      setTransactions([created, ...transactions]);
      Alert.alert(
        "Notice",
        "API currently unavailable. Transaction added locally.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{wallet.name}</Text>
      <Text style={styles.subtitle}>Transactions</Text>

      {error && (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#264653"
          style={{ marginTop: 50 }}
        />
      ) : (
        <>
          <TransactionList transactions={transactions} />
          <Pressable
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome name="plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </Pressable>
        </>
      )}

      <CreateTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "MoreSugar",
    color: "#264653",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "MoreSugar",
    color: "#6c757d",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#264653",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    position: "absolute",
    bottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 18,
    marginLeft: 10,
  },
  inlineError: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "90%",
  },
  inlineErrorText: {
    color: "#721c24",
    fontFamily: "MoreSugar",
    fontSize: 12,
    textAlign: "center",
  },
});
