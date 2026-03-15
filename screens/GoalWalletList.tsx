import { getAllWallets } from "@/api/wallet/index";
import { Wallet } from "@/api/wallet/model";
import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../navigation/index";

type Props = NativeStackScreenProps<RootStackParamList, "GoalWalletList">;

export default function GoalWalletList({ navigation }: Props) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      const accountId = session.getAccount()?.id || "";
      const response = await getAllWallets(accountId);
      setWallets(response.values || []);
    } catch (error) {
      console.error("Error while fetching wallets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleWalletPress = (wallet: Wallet) => {
    navigation.navigate("GoalListScreen", { walletId: wallet.id });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#264653" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Wallet</Text>
      <FlatList
        data={wallets}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderLeftColor: item.color || "#264653" }]}
            onPress={() => handleWalletPress(item)}
          >
            <View>
              <Text style={styles.walletName}>{item.name || "Unnamed"}</Text>
              <Text style={styles.walletType}>{item.type || "CASH"}</Text>
            </View>

            <Text style={styles.amount}>
              {item.amount !== undefined ? item.amount.toLocaleString() : "0"}{" "}
              MGA
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: "MoreSugar",
    color: "#264653",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  walletName: {
    fontFamily: "MoreSugar",
    fontSize: 18,
    color: "#264653",
  },
  walletType: {
    fontFamily: "MoreSugar",
    fontSize: 12,
    color: "#666",
    textTransform: "lowercase",
  },
  amount: {
    fontFamily: "MoreSugar",
    fontSize: 16,
    color: "#2a9d8f",
    fontWeight: "bold",
  },
});
