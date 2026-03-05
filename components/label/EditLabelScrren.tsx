import { RootStackParamList } from "@/navigation";
import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { updateLabel } from "./labelService";

// Utilisez le type global RootStackParamList
type Props = NativeStackScreenProps<RootStackParamList, "EditLabel">;

export default function EditLabelScreen({ route, navigation }: Props) {
  const { label } = route.params;

  const [name, setName] = useState(label.name || "");
  const [color, setColor] = useState(label.color || "#00ff00");
  const [iconRef, setIconRef] = useState(label.iconRef || "");
  const accountId = session.getAccount()?.id || "";

  const token = session.getToken() || "";

  const handleUpdate = async () => {
    try {
      if (!label.id) {
        Alert.alert("Erreur", "ID du label manquant");
        return;
      }

      await updateLabel(accountId, label.id, name, color, token, iconRef);
      Alert.alert("Succès", "Label modifié");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de modifier le label");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Label name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Color (#FF0000)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <TextInput
        placeholder="Icon Ref"
        value={iconRef}
        onChangeText={setIconRef}
        style={styles.input}
      />

      <Button title="Update Label" onPress={handleUpdate} />
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
    borderRadius: 10,
  },
});
