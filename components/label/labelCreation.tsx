import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { createLabel } from "./labelService";

type RootStackParamList = {
  CreateLabel: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CreateLabel">;

export default function CreateLabelScreen({ navigation }: Props) {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#00ff00");
  const [iconRef, setIconRef] = useState<string>("");

  const accountId = "TON_ACCOUNT_ID";

  const handleCreate = async () => {
    await createLabel(accountId, {
      name,
      color,
      iconRef,
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Couleur (#xxxxxx)"
        value={color}
        onChangeText={setColor}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Créer" onPress={handleCreate} />
    </View>
  );
}
