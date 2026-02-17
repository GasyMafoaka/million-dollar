import { useWallets } from "@/context/walletContext";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function CreateWalletScreen({ navigation }: any) {
  const { create } = useWallets();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("0");
  const [type, setType] = useState<"CASH" | "BANK" | "MOBILE_MONEY" | "DEBT">(
    "CASH",
  );

  const [autoAmount, setAutoAmount] = useState("");
  const [paymentDay, setPaymentDay] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const submit = async () => {
    await create({
      name,
      amount: Number(amount),
      type,
      isActive: true,
      description: "",
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Montant initial"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Pressable onPress={() => setIsPremium((p) => !p)}>
        <Text>Premium : {isPremium ? "Oui" : "Non"}</Text>
      </Pressable>

      {isPremium && (
        <>
          <TextInput
            placeholder="Montant auto"
            keyboardType="numeric"
            value={autoAmount}
            onChangeText={setAutoAmount}
          />
          <TextInput
            placeholder="Jour de paiement (1-28)"
            keyboardType="numeric"
            value={paymentDay}
            onChangeText={setPaymentDay}
          />
        </>
      )}

      <Pressable onPress={submit}>
        <Text>Créer</Text>
      </Pressable>
    </View>
  );
}
