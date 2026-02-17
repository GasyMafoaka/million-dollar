import { useWallets } from "@/context/walletContext";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function WalletListScreen({ navigation }: any) {
  const { wallets, fetchMore, archive } = useWallets();

  return (
    <FlatList
      data={wallets}
      keyExtractor={(w) => w.id}
      onEndReached={fetchMore}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderWidth: 1, margin: 8 }}>
          <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          <Text>Solde : {item.amount} Ar</Text>
          <Text>Type : {item.type}</Text>

          {/* Stats simples */}
          <Text>Stat : {item.amount > 0 ? "Positif" : "Négatif"}</Text>

          <Pressable
            onPress={() => navigation.navigate("EditWallet", { wallet: item })}
          >
            <Text>Modifier</Text>
          </Pressable>

          <Pressable onPress={() => archive(item.id)}>
            <Text>Supprimer</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("Transactions", { walletId: item.id })
            }
          >
            <Text>Voir transactions</Text>
          </Pressable>
        </View>
      )}
    />
  );
}
