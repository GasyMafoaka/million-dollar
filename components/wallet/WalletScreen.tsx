import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import WalletList from './WalletList';
import { FontAwesome } from '@expo/vector-icons';
import CreateWalletModal from './CreateWalletModal';
import { API_BASE_URL } from '@/constants/api';

interface Wallet {
  id: string;
  name: string;
  reference: string;
  type: 'CASH' | 'BANK_ACCOUNT' | 'MOBILE_MONEY' | 'CRYPTO';
}

export default function WalletScreen() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const mockData = useCallback(() => {
    setWallets([
        { id: '1', name: 'Main Cash', reference: 'CASH-001', type: 'CASH' },
        { id: '2', name: 'Savings Account', reference: 'BANK-001', type: 'BANK_ACCOUNT' },
        { id: '3', name: 'Crypto Wallet', reference: 'CRYP-001', type: 'CRYPTO' },
    ]);
  }, []);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const apiKey = "your-api-key";
      const response = await fetch(`${API_BASE_URL}/wallet`, {
        headers: {
          "x-api-key": apiKey,
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setWallets(data);
      } else {
        setError("Failed to fetch wallets from server. Displaying offline data.");
        mockData();
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Fetch error:", err);
      setError("Network error. Displaying offline data.");
      mockData();
    } finally {
      setLoading(false);
    }
  }, [mockData]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleCreateWallet = async (newWallet: Omit<Wallet, 'id'>) => {
    try {
        const apiKey = "your-api-key";
        const response = await fetch(`${API_BASE_URL}/wallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify([newWallet]),
        });

        if (response.ok) {
            const data = await response.json();
            setWallets([...wallets, ...data]);
            Alert.alert("Success", "Wallet created successfully");
        } else {
            const mockNewWallet = { ...newWallet, id: Math.random().toString() } as Wallet;
            setWallets([...wallets, mockNewWallet]);
            Alert.alert("Notice", "API currently unavailable. Wallet created locally.");
        }
    } catch (err) {
        console.error(err);
        const mockNewWallet = { ...newWallet, id: Math.random().toString() } as Wallet;
        setWallets([...wallets, mockNewWallet]);
        Alert.alert("Notice", "Network error. Wallet created locally.");
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
        <ActivityIndicator size="large" color="#264653" style={{ marginTop: 50 }} />
      ) : (
        <>
            <WalletList wallets={wallets} />
            <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
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
    width: '100%',
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: 'MoreSugar',
    color: "#264653",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#264653',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    position: 'absolute',
    bottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'MoreSugar',
    fontSize: 18,
    marginLeft: 10,
  },
  inlineError: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
  },
  inlineErrorText: {
    color: '#721c24',
    fontFamily: 'MoreSugar',
    fontSize: 12,
    textAlign: 'center',
  },
});
