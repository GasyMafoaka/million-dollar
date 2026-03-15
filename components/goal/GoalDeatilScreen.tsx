import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { RootStackParamList } from "../../navigation/index";

type Props = NativeStackScreenProps<RootStackParamList, "GoalDetail">;

export default function GoalDetailsScreen({ route, navigation }: Props) {
  // On place le goal dans un état local pour pouvoir le mettre à jour
  const [currentGoal, setCurrentGoal] = useState(route.params.goal);

  // useFocusEffect s'exécute à chaque fois que l'écran revient au premier plan
  useFocusEffect(
    useCallback(() => {
      // Si EditGoal a passé de nouveaux paramètres en revenant en arrière
      if (route.params?.goal) {
        setCurrentGoal(route.params.goal);
      }
    }, [route.params?.goal]),
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not defined";
    const date = new Date(dateString);
    // Utilisation du format anglais (US ou GB selon votre préférence)
    return date.toLocaleDateString("en-US");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Goal Detail</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{currentGoal.name}</Text>

        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>
          {currentGoal.amount.toLocaleString()} MGA
        </Text>

        <View style={styles.dateContainer}>
          <View>
            <Text style={styles.label}>Starting Date</Text>
            <Text style={styles.dateValue}>
              {formatDate(currentGoal.startingDate)}
            </Text>
          </View>
          <View>
            <Text style={styles.label}>Ending Date</Text>
            <Text style={styles.dateValue}>
              {formatDate(currentGoal.endingDate)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => navigation.navigate("EditGoal", { goal: currentGoal })}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "white" },
  title: {
    fontFamily: "MoreSugar",
    fontSize: 32,
    color: "#264653",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 25,
    elevation: 2,
  },
  label: {
    fontFamily: "MoreSugar",
    fontSize: 14,
    color: "#666",
    marginTop: 15,
  },
  value: { fontFamily: "MoreSugar", fontSize: 22, color: "#264653" },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dateValue: { fontFamily: "MoreSugar", fontSize: 16, color: "#2a9d8f" },
  updateButton: {
    backgroundColor: "#264653",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 40,
  },
  updateButtonText: { color: "white", fontFamily: "MoreSugar", fontSize: 20 },
});
