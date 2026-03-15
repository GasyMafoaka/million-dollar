import { archiveGoal, getGoals } from "@/components/goal/goalService";
import { session } from "@/service/session";
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
import { Goal } from "../api/goal";
import { RootStackParamList } from "../navigation/index";

type Props = NativeStackScreenProps<RootStackParamList, "GoalListScreen">;

export default function GoalListScreen({ navigation }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMess, setSuccessMess] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);

  const color1 = "#264653";

  const accountId = session.getAccount()?.id || "";
  const token = session.getToken() || "";

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals(accountId, token, page, pageSize);

      const values = data.values || [];
      setGoals(values);
      setHasNextPage(data.hasNext);
    } catch (error) {
      console.error("Erreur lors de la récupération des objectifs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveGoal(id, token, accountId);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
      setSuccessMess(true);
      setTimeout(() => setSuccessMess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGoals();
    }, [page]),
  );

  if (loading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color1} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Goals List</Text>

      <FlatList
        style={{ paddingTop: 20 }}
        data={goals}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.goalRow}>
            {/* CARTE DE L'OBJECTIF */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditGoal", { goal: item });
              }}
              style={[styles.goalCard, { backgroundColor: color1 }]}
            >
              <View style={styles.cardContent}>
                <Text
                  style={[styles.goalName, { color: item.color || "#ffffff" }]}
                >
                  {item.name || "Sans nom"}
                </Text>
                <Text style={styles.goalAmount}>
                  {item.amount ? item.amount.toLocaleString() : "0"} MGA
                </Text>
              </View>
            </TouchableOpacity>

            {/* BOUTON ARCHIVE */}
            <TouchableOpacity
              onPress={() => item.id && handleArchive(item.id)}
              style={styles.archiveButton}
            >
              <Text style={styles.archiveButtonText}>Archive</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Goal</Text>
          </View>
        }
      />

      {/* PAGINATION */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          style={[
            styles.pageButton,
            { backgroundColor: page === 1 ? "#ccc" : color1 },
          ]}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageNumber}>Page {page}</Text>

        <TouchableOpacity
          disabled={!hasNextPage}
          onPress={() => setPage(page + 1)}
          style={[
            styles.pageButton,
            { backgroundColor: !hasNextPage ? "#ccc" : color1 },
          ]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateGoal")}
        style={[styles.fab, { backgroundColor: color1 }]}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      {successMess && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Operation Successful</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "MoreSugar",
    textAlign: "center",
    fontSize: 40,
    marginTop: 40,
    color: "#264653",
  },
  goalRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  goalCard: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalName: {
    fontWeight: "bold",
    fontSize: 17,
    fontFamily: "MoreSugar",
  },
  goalAmount: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 14,
  },
  archiveButton: {
    marginLeft: 10,
    backgroundColor: "#e63946",
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
  },
  archiveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "MoreSugar",
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    alignItems: "center",
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  pageButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
  },
  pageNumber: {
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: "white",
    fontSize: 35,
    lineHeight: 40,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#264653",
    fontFamily: "MoreSugar",
  },
  toast: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
    backgroundColor: "#2a9d8f",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 10,
  },
  toastText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 16,
  },
});
