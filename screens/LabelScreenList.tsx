import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
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
  EditLabel: { label: Label };
};

type Props = NativeStackScreenProps<RootStackParamList, "LabelList">;

export default function LabelListScreen({ navigation }: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const accountId = "a1f479d9-44c4-4f9c-a394-23fad918e52e";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImExZjQ3OWQ5LTQ0YzQtNGY5Yy1hMzk0LTIzZmFkOTE4ZTUyZSIsInVzZXJuYW1lIjoiS2F0c2F0c2FteSIsImlhdCI6MTc3MjczMzIwMiwiZXhwIjoxNzcyNzY5MjAyfQ.0Db9UrIcR2EPA27o6ZNU8KQxo5hao3kVPO9ZAX2eXEI";

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

  useEffect(() => {
    fetchLabels();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={labels}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditLabel", { label: item })}
            style={{
              padding: 15,
              marginBottom: 10,
              backgroundColor: item.color || "#ccc",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 18, color: "#264653" }}>
              Aucun label disponible
            </Text>
          </View>
        }
      />
    </View>
  );
}
