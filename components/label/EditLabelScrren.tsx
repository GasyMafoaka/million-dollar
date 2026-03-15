import { RootStackParamList } from "@/navigation";
import { session } from "@/service/session";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { updateLabel } from "./labelService";

// Utilisez le type global RootStackParamList
type Props = NativeStackScreenProps<RootStackParamList, "EditLabel">;

const color1 = "#264653";

export default function EditLabelScreen({ route, navigation }: Props) {
  const { label } = route.params;

  const [name, setName] = useState(label.name || "");
  const [color, setColor] = useState(label.color || "#00ff00");
  const [iconRef, setIconRef] = useState(label.iconRef || "");
  const [updateLabelMess, setUpdateLabelMess] = useState(false);
  const [showNameAlert, setshowNameAlert] = useState(false);
  const accountId = session.getAccount()?.id || "";

  const token = session.getToken() || "";

  const handleUpdate = async () => {
    try {
      if (!label.id) {
        console.log("Id is empty !");
        return;
      }

      const data = await updateLabel(
        accountId,
        label.id,
        name.toUpperCase(),
        color,
        token,
        iconRef,
      );

      if (data.name && data.color) {
        setUpdateLabelMess(true);
        setTimeout(() => {
          setUpdateLabelMess(false);
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
    } catch (error) {
      console.error(error);
      console.log("Label can't updated");
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
        Update Label
      </h1>
      <TextInput
        placeholder="Label name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      Text
      {showNameAlert && (
        <View style={styles.inputAlertContainer}>
          <FontAwesome name="info-circle" size={15} color="red" />
          <Text style={styles.inputAlertContainerText}>
            Label with name = {name} is already exist.
          </Text>
        </View>
      )}
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
          marginTop: 30,
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
      {updateLabelMess && (
        <Text
          style={{
            position: "absolute",
            bottom: 80,
            alignSelf: "center",
            backgroundColor: "green",
            padding: 20,
            color: "white",
            fontFamily: "MoreSugar",
            fontSize: 20,
            borderRadius: 15,
          }}
        >
          Updated Succesfully
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
