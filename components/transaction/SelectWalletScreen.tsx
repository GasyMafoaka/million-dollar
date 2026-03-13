import { Wallet, walletsApi } from "@/api/wallets.api";
import { useSession } from "@/auth/useSession";
import { useSelectedWallet } from "@/context/WalletContext";
import { appStyles } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function SelectWalletScreen({ navigation }: any) {
  const { accountId } = useSession();
  const { setSelectedWalletId } = useSelectedWallet();

  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!accountId) return;
      const data = await walletsApi.list(accountId);
      setWallets(data);
    };

    load();
  }, [accountId]);

  const selectWallet = (wallet: Wallet) => {
    setSelectedWalletId(wallet.id);
    navigation.goBack();
  };

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.title}>Choisir un Wallet</Text>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={appStyles.card} onPress={() => selectWallet(item)}>
            <Text style={appStyles.cardTitle}>{item.name}</Text>
            <Text>{item.walletType}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
