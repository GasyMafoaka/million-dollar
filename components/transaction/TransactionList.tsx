import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import TransactionItem from "./TransactionItem";
import { Transaction } from "@/api/transaction/model";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No transactions found for this wallet.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item, index) => item.id || `transaction-${index}`}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      contentContainerStyle={styles.listContainer}
      style={{ width: "100%" }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontFamily: "MoreSugar",
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
