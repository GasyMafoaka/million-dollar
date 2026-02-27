import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import TransactionList from "./TransactionList";
import { getAllTransactions } from "@/api/transaction/index";
import { offlineGetAllTransactions } from "@/api/transaction/offline";
import { Transaction } from "@/api/transaction/model";
import { Wallet } from "@/api/wallet/model";

interface WalletTransactionScreenProps {
  wallet: Wallet;
}

// Mock accountId as it's not provided by a global state in this context
const MOCK_ACCOUNT_ID = "00000000-0000-0000-0000-000000000000";

export default function WalletTransactionScreen({
  wallet,
}: WalletTransactionScreenProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // The API seems to support filtering by walletId
      const response = await getAllTransactions(MOCK_ACCOUNT_ID, {
        walletId: wallet.id,
      });
      setTransactions(response || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch transactions. Displaying offline data.");
      const offlineResponse = await offlineGetAllTransactions(MOCK_ACCOUNT_ID);
      // Filter offline data by walletId
      const filtered = (offlineResponse || []).filter(
        (t) => t.walletId === wallet.id,
      );
      setTransactions(filtered.length > 0 ? filtered : offlineResponse || []);
    } finally {
      setLoading(false);
    }
  }, [wallet.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
        <TransactionList transactions={transactions} />
      )}
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
