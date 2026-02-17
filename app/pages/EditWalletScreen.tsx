import { useWallets } from "@/context/walletContext";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function EditWalletScreen({ route, navigation }: any) {
  const { wallet } = route.params;
  const { update, updateAutomaticIncome } = useWallets();

  const [name, setName] = useState(wallet.name);
  const [description, setDescription] = useState(wallet.description || "");

  const submit = async () => {
    await update(wallet.id, {
      name,
      description,
      type: wallet.type,
      isActive: wallet.isActive,
    });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={description} onChangeText={setDescription} />

      <Pressable onPress={submit}>
        <Text>Enregistrer</Text>
      </Pressable>
    </View>
  );
}
