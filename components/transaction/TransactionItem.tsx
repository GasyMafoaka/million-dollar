import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Transaction } from "@/api/transaction/model";

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === "IN";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? "#2a9d8f20" : "#e76f5120" },
        ]}
      >
        <FontAwesome
          name={isIncome ? "arrow-up" : "arrow-down"}
          size={20}
          color={isIncome ? "#2a9d8f" : "#e76f51"}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          {transaction.description || "No description"}
        </Text>
        <Text style={styles.date}>
          {transaction.date
            ? new Date(transaction.date).toLocaleDateString()
            : ""}
        </Text>
      </View>
      <View
        style={[
          styles.amountContainer,
          { backgroundColor: isIncome ? "#2a9d8f" : "#e76f51" },
        ]}
      >
        <Text style={styles.amount}>
          {isIncome ? "+" : "-"}
          {transaction.amount !== undefined
            ? transaction.amount.toFixed(2)
            : "0.00"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  description: {
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  date: {
    fontSize: 12,
    fontFamily: "MoreSugar",
    color: "#6c757d",
  },
  amountContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  amount: {
    color: "white",
    fontSize: 14,
    fontFamily: "MoreSugar",
  },
});
