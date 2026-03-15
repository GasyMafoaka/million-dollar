import { Wallet } from "@/api/wallet/model";
import { walletsApi } from "@/api/wallets.api";
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

      console.log("ACCOUNT ID =", accountId);

      const data = await walletsApi.list(accountId);

      console.log("WALLETS FROM API =", data);

      setWallets(data);
    };

    load();
  }, [accountId]);

  const selectWallet = (wallet: Wallet) => {
    console.log("WALLET SELECTED =", wallet);
    setSelectedWalletId(wallet.id || "");
    navigation.goBack();
  };

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.title}>Choisir un Wallet</Text>

      <FlatList
  data={wallets}
  // On utilise l'opérateur ?? pour fournir une valeur de secours si id est undefined
  keyExtractor={(item, index) => item.id ?? index.toString()} 
  renderItem={({ item }) => (
    <Pressable style={appStyles.card} onPress={() => selectWallet(item)}>
      <Text style={appStyles.cardTitle}>{item.name}</Text>
    </Pressable>
  )}
/>
    </View>
  );
}