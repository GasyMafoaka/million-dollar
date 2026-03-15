import { session } from "@/service/session";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
  const [color, setColor] = useState("#264653");
  const [iconRef, setIconRef] = useState("");
  const [createdMess, setCreatedMess] = useState(false);
  const [showNameAlert, setshowNameAlert] = useState(false);
  const accountId = session.getAccount()?.id || "";

  const token = session.getToken() || "";

  const handleCreate = async () => {
    try {
      const data = await createLabel(
        accountId,
        name.toUpperCase(),
        color,
        iconRef,
        token,
      );

      if (data.name && data.color) {
        setCreatedMess(true);
        setTimeout(() => {
          setCreatedMess(false);
        }, 3000);
        setTimeout(() => {
          navigation.goBack();
        }, 4000);
      }
      if (data.code === 400) {
        setshowNameAlert(true);
        setTimeout(() => {
          setshowNameAlert(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Label</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Label Name</Text>
        <TextInput
          placeholder="e.g. Food"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        {showNameAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="#e63946" />
            <Text style={styles.inputAlertContainerText}>
              Label with name = {name} already exists.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Color (Hex)</Text>
        <TextInput
          placeholder="e.g. #264653"
          value={color}
          onChangeText={setColor}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Icon Reference</Text>
        <TextInput
          placeholder="e.g. tag"
          value={iconRef}
          onChangeText={setIconRef}
          style={styles.input}
        />
      </View>

      <Pressable style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create Label</Text>
      </Pressable>

      {createdMess && (
        <View style={styles.successToast}>
          <Text style={styles.successToastText}>Label created</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "MoreSugar",
    color: "#264653",
    marginBottom: 30,
  },
  inputGroup: {
    width: "90%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#264653",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "MoreSugar",
  },
  inputAlertContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  inputAlertContainerText: {
    color: "#e63946",
    fontFamily: "MoreSugar",
    fontSize: 12,
    marginLeft: 5,
  },
  createButton: {
    backgroundColor: "#264653",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "90%",
  },
  createButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 18,
  },
  successToast: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#2a9d8f",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successToastText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 16,
  },
});
