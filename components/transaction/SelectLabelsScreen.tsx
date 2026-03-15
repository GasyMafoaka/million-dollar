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
import { Label } from "../label/label";
import { getLabels } from "../label/labelService";

type RootStackParamList = {
  LabelList: undefined;
  TransactionForm: { selectedLabels: string[] };
};

type Props = NativeStackScreenProps<RootStackParamList, "LabelList">;

export default function LabelListScreen({ navigation }: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  const color1 = "#264653";

  const accountId = session.getAccount()?.id || "";
  const token = session.getToken() || "";

  const fetchLabels = React.useCallback(async () => {
    try {
      const data = await getLabels(accountId, token, 1, 50);
      setLabels(data.values || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [accountId, token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLabels();
    }, [fetchLabels]),
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const handleSelect = (id: string) => {
    navigation.navigate("TransactionForm", { selectedLabels: [id] });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 35,
          textAlign: "center",
          fontFamily: "MoreSugar",
        }}
      >
        Select Label
      </Text>

      <FlatList
        style={{ marginTop: 30 }}
        data={labels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item.id)}
            style={{
              padding: 18,
              backgroundColor: color1,
              marginBottom: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: item.color || "white",
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "MoreSugar",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
