import { session } from "@/service/session";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
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
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#264653"
          style={{ marginTop: 50 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Labels Lists</Text>
      <FlatList
        data={labels}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {/* LABEL */}
            <TouchableOpacity
              onPress={() => {
                if (item.id) {
                  navigation.navigate("EditLabel", { label: item });
                } else {
                  console.warn("Label sans ID");
                }
              }}
              style={styles.labelInfo}
            >
              <View
                style={[
                  styles.iconContainer,
                  item.color ? { backgroundColor: item.color + "20" } : null,
                ]}
              >
                <FontAwesome
                  name="tag"
                  size={24}
                  color={item.color || "#264653"}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.labelName}>{item.name || "Sans nom"}</Text>
              </View>
            </TouchableOpacity>

            {/* BOUTON ARCHIVE */}
            <TouchableOpacity
              onPress={() => {
                if (item.id) {
                  handleArchive(item.id);
                }
              }}
              style={styles.archiveButton}
            >
              <FontAwesome name="archive" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun label disponible</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        style={{ width: "100%" }}
      />

      {/* PAGINATION */}
      <View style={styles.paginationContainer}>
        {/* PREVIOUS */}
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          style={[
            styles.paginationButton,
            page === 1 && styles.paginationButtonDisabled,
          ]}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>Page {page}</Text>

        {/* NEXT */}
        <TouchableOpacity
          disabled={!hasNextPage}
          onPress={() => setPage(page + 1)}
          style={[
            styles.paginationButton,
            !hasNextPage && styles.paginationButtonDisabled,
          ]}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* BOUTON CREATE */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateLabel")}
        style={styles.addButton}
      >
        <FontAwesome name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Label</Text>
      </TouchableOpacity>

      {archivedMess && (
        <View style={styles.successToast}>
          <Text style={styles.successToastText}>Archived with success</Text>
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
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: "MoreSugar",
    color: "#264653",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(38, 70, 83, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  labelName: {
    fontSize: 18,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  archiveButton: {
    backgroundColor: "#e63946",
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#264653",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    position: "absolute",
    bottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 18,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontFamily: "MoreSugar",
    fontSize: 18,
    color: "#6c757d",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
    backgroundColor: "white",
  },
  paginationButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#264653",
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
  },
  pageIndicator: {
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  successToast: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
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
