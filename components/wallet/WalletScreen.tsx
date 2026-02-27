import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import WalletList from "./WalletList";
import { FontAwesome } from "@expo/vector-icons";
import CreateWalletModal from "./CreateWalletModal";
import { getAllWallets, createOneWallet } from "@/api/wallet/index";
import {
  offlineGetAllWallets,
  offlineCreateOneWallet,
} from "@/api/wallet/offline";
import { Wallet, CreationWallet } from "@/api/wallet/model";

// Mock accountId as it's not provided by a global state in this context
const MOCK_ACCOUNT_ID = "00000000-0000-0000-0000-000000000000";

export default function WalletScreen() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllWallets(MOCK_ACCOUNT_ID);
      setWallets(response.values || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch wallets. Displaying offline data.");
      const offlineResponse = await offlineGetAllWallets(MOCK_ACCOUNT_ID);
      setWallets(offlineResponse.values || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleCreateWallet = async (newWallet: CreationWallet) => {
    try {
      const createdWallet = await createOneWallet(MOCK_ACCOUNT_ID, newWallet);
      setWallets([...wallets, createdWallet]);
      Alert.alert("Success", "Wallet created successfully");
    } catch (err) {
      console.error(err);
      const createdWallet = await offlineCreateOneWallet(
        MOCK_ACCOUNT_ID,
        newWallet,
      );
      setWallets([...wallets, createdWallet]);
      Alert.alert(
        "Notice",
        "API currently unavailable. Wallet created locally.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wallets</Text>

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
          <WalletList wallets={wallets} />
          <Pressable
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome name="plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Wallet</Text>
          </Pressable>
        </>
      )}

      <CreateWalletModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateWallet}
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
    fontSize: 30,
    fontFamily: "MoreSugar",
    color: "#264653",
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
