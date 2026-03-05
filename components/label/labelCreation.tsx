import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { Label } from "./label";
import { createLabel } from "./labelService";

type RootStackParamList = {
  LabelList: undefined;
  EditLabel: { label: Label };
  CreateLabel: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CreateLabel">;

export default function CreateLabelScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [iconref, setIconRef] = useState("");

  const accountId = session.getAccount()?.id || "";

  const token = session.getToken() || "";

  const handleCreate = async () => {
    try {
      await createLabel(accountId, name, color, iconref, token);

      Alert.alert("Succès", "Label created !");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de créer le label");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="color"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />
      <TextInput
        placeholder="icone reference"
        value={iconref}
        onChangeText={setIconRef}
        style={styles.input}
      />

      <Button title="Create label" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: "MoreSugar",
  },
});
