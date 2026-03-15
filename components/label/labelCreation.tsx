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
const color1 = "#264653";

export default function CreateLabelScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
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
      <h1
        style={{
          fontFamily: "MoreSugar ",
          textAlign: "center",
          fontSize: 40,
          paddingBottom: 50,
        }}
      >
        Create Label
      </h1>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {showNameAlert && (
        <View style={styles.inputAlertContainer}>
          <FontAwesome name="info-circle" size={15} color="red" />
          <Text style={styles.inputAlertContainerText}>
            Label with name = {name} is already exist.
          </Text>
        </View>
      )}
      <TextInput
        placeholder="color"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />
      <TextInput
        placeholder="icon reference"
        value={iconRef}
        onChangeText={setIconRef}
        style={styles.input}
      />

      <Pressable
        style={{
          backgroundColor: color1,
          padding: 20,
          marginTop: 30,
          borderRadius: 15,
          width: "75%",
        }}
        onPress={handleCreate}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "MoreSugar",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          Create
        </Text>
      </Pressable>

      {createdMess && (
        <Text
          style={{
            position: "absolute",
            bottom: 90,
            alignSelf: "center",
            backgroundColor: "green",
            padding: 20,
            color: "white",
            fontFamily: "MoreSugar",
            fontSize: 20,
            borderRadius: 15,
          }}
        >
          Label created
        </Text>
      )}
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
    marginTop: 20,
    borderRadius: 10,
    fontFamily: "MoreSugar",
    fontSize: 20,
    width: "90%",
  },
  inputAlertContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  inputAlertContainerText: {
    color: "red",
    fontFamily: "MoreSugar",
    fontSize: 15,
    marginLeft: 10,
    textAlign: "center",
  },
});
