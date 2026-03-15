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
import { archiveLabel, getLabels } from "../components/label/labelService";

type RootStackParamList = {
  LabelList: undefined;
  EditLabel: { label?: Label };
  CreateLabel: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "LabelList">;

export default function LabelListScreen({ navigation }: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [archivedMess, setArchivedMess] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);

  const color1 = "#264653";

  const accountId = session.getAccount()?.id || "";
  const token = session.getToken() || "";

  const fetchLabels = React.useCallback(async () => {
    try {
      const data = await getLabels(accountId, token, page, pageSize);

      const values = data.values || [];

      setLabels(values);

      setHasNextPage(values.length === pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [accountId, token, page, pageSize]);

  const handleArchive = async (id: string) => {
    try {
      await archiveLabel(id, token, accountId);

      setLabels((prev) => prev.filter((label) => label.id !== id));

      setArchivedMess(true);

      setTimeout(() => {
        setArchivedMess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLabels();
    }, [fetchLabels]),
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "MoreSugar ",
          textAlign: "center",
          fontSize: 40,
        }}
      >
        Labels Lists
      </Text>
      <FlatList
        style={{ paddingTop: 30 }}
        data={labels}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              alignItems: "center",
              marginTop: 5,
            }}
          >
            {/* LABEL */}
            <TouchableOpacity
              onPress={() => {
                if (item.id) {
                  navigation.navigate("EditLabel", { label: item });
                } else {
                  console.warn("Label sans ID");
                }
              }}
              style={{
                flex: 1,
                padding: 15,
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
                  fontFamily: "MoreSugar",
                }}
              >
                {item.name || "Sans nom"}
              </Text>
            </TouchableOpacity>

            {/* BOUTON ARCHIVE */}
            <TouchableOpacity
              onPress={() => {
                if (item.id) {
                  handleArchive(item.id);
                }
              }}
              style={{
                marginLeft: 10,
                backgroundColor: "#e63946",
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "MoreSugar",
                }}
              >
                Archive
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text
              style={{ fontSize: 18, color: color1, fontFamily: "MoreSugar" }}
            >
              Aucun label disponible
            </Text>
          </View>
        }
      />

      {/* PAGINATION */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        {/* PREVIOUS */}
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          style={{
            padding: 10,
            marginHorizontal: 10,
            backgroundColor: page === 1 ? "#ccc" : color1,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontFamily: "MoreSugar" }}>
            Previous
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            alignSelf: "center",
            fontSize: 16,
            fontFamily: "MoreSugar",
          }}
        >
          Page {page}
        </Text>

        {/* NEXT */}
        <TouchableOpacity
          disabled={!hasNextPage}
          onPress={() => setPage(page + 1)}
          style={{
            padding: 10,
            marginHorizontal: 10,
            backgroundColor: !hasNextPage ? "#ccc" : color1,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontFamily: "MoreSugar" }}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* BOUTON CREATE */}
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

      {archivedMess && (
        <Text
          style={{
            position: "absolute",
            bottom: 40,
            alignSelf: "center",
            backgroundColor: "green",
            padding: 15,
            color: "white",
            fontFamily: "MoreSugar",
            fontSize: 18,
            borderRadius: 15,
          }}
        >
          Archived with success
        </Text>
      )}
    </View>
  );
}
