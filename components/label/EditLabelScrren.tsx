import { RootStackParamList } from "@/navigation";
import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { updateLabel } from "./labelService";

// Utilisez le type global RootStackParamList
type Props = NativeStackScreenProps<RootStackParamList, "EditLabel">;

const color1 = "#264653";

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
      <h1
        style={{
          fontFamily: "MoreSugar ",
          textAlign: "center",
          fontSize: 40,
          paddingBottom: 10,
        }}
      >
        Update Label
      </h1>
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

      <Pressable
        style={{
          backgroundColor: color1,
          padding: 20,
          marginTop: 20,
          borderRadius: 15,
          width: "75%",
        }}
        onPress={handleUpdate}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "MoreSugar",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          Update
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 20,
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: color1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontFamily: "MoreSugar",
    fontSize: 16,
    width: "90%",
  },
});
