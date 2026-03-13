import { useTransactions } from "@/context/listTransactionContext";
import { appStyles, color1 } from "@/styles/appStyles";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TransactionsScreen() {
  const navigation = useNavigation<any>();
  const { list, fetchMore, remove, selectedDate, setSelectedDate } =
    useTransactions();
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.title}>Transactions</Text>

      <Pressable
        style={styles.calendarToggle}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.calendarToggleText}>
          {showCalendar ? "Masquer le calendrier" : "Filtrer par date"}
        </Text>
      </Pressable>

      {showCalendar && (
        <Calendar
          onDayPress={(d) => setSelectedDate(d.dateString)}
          markedDates={{
            ...list.reduce((acc: any, t: any) => {
              if (!t.date) return acc;
              const d = t.date.split("T")[0];
              acc[d] = { marked: true };
              return acc;
            }, {}),
            ...(selectedDate && {
              [selectedDate]: { selected: true, selectedColor: color1 },
            }),
          }}
          theme={{
            selectedDayBackgroundColor: color1,
            todayTextColor: color1,
            arrowColor: color1,
          }}
        />
      )}

      {selectedDate && (
        <Pressable
          style={styles.filterButton}
          onPress={() => setSelectedDate(null)}
        >
          <Text style={styles.filterText}>Afficher tout</Text>
        </Pressable>
      )}

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune transaction</Text>
        }
        renderItem={({ item }) => (
          <View style={appStyles.card}>
            <Text style={appStyles.cardTitle}>{item.description}</Text>
            <Text style={appStyles.cardAmount}>
              {item.type === "OUT" ? "-" : "+"}
              {item.amount} Ar
            </Text>
            <View style={appStyles.cardActions}>
              <Pressable
                onPress={() =>
                  navigation.navigate("TransactionForm", { transaction: item })
                }
              >
                <Text style={appStyles.edit}>Modifier</Text>
              </Pressable>
              <Pressable onPress={() => remove(item.id)}>
                <Text style={appStyles.delete}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TransactionForm")}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarToggle: {
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 10,
  },
  calendarToggleText: {
    color: color1,
    fontWeight: "bold",
  },
  filterButton: {
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
  },
  filterText: {
    color: color1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: color1,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
