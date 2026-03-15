import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Wallet } from "@/api/wallet/model";

interface WalletItemProps {
  wallet: Wallet;
}

export default function WalletItem({ wallet }: WalletItemProps) {
  const getIconName = (type?: string) => {
    switch (type) {
      case "CASH":
        return "money";
      case "BANK":
        return "bank";
      case "MOBILE_MONEY":
        return "mobile";
      case "DEBT":
        return "minus-circle";
      default:
        return "credit-card";
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          wallet.color ? { backgroundColor: wallet.color + "20" } : null,
        ]}
      >
        <FontAwesome
          name={getIconName(wallet.type) as any}
          size={24}
          color={wallet.color || "#264653"}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{wallet.name}</Text>
        <Text style={styles.description}>{wallet.description}</Text>
      </View>
      <View
        style={[
          styles.amountContainer,
          wallet.color ? { backgroundColor: wallet.color } : null,
        ]}
      >
        <Text style={styles.amount}>
          {wallet.amount !== undefined ? wallet.amount.toFixed(2) : "0.00"}
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(38, 70, 83, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  description: {
    fontSize: 14,
    fontFamily: "MoreSugar",
    color: "#6c757d",
  },
  amountContainer: {
    backgroundColor: "#264653",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  amount: {
    color: "white",
    fontSize: 12,
    fontFamily: "MoreSugar",
  },
});
