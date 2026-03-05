import { session } from "@/service/session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Label } from "../components/label/label";
import { getLabels } from "../components/label/labelService";

type RootStackParamList = {
  LabelList: undefined;
  EditLabel: { label?: Label };
  CreateLabel: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "LabelList">;

export default function LabelListScreen({ navigation }: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const color1 = "#264653";
  const accountId = session.getAccount()?.id || "";
  const token = session.getToken() || "";

  const fetchLabels = async () => {
    try {
      const data = await getLabels(accountId, token);
      setLabels(data.values);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLabels();
    }, []),
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={labels}
        keyExtractor={(item) => item.id || Math.random().toString()} // Gérez le cas où id est undefined
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (item.id) {
                // Vérifiez que l'id existe avant de naviguer
                navigation.navigate("EditLabel", { label: item });
                console.log(item);
              } else {
                console.warn("Label sans ID, impossible de modifier");
              }
            }}
            style={{
              padding: 15,
              marginBottom: 10,
              backgroundColor: color1,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: item.color || "#ffffff",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              {item.name || "Sans nom"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 18, color: color1 }}>
              Aucun label disponible
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateLabel")}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: color1,
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
