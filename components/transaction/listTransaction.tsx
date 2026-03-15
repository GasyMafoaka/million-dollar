import { useTransactions } from "@/context/listTransactionContext";
import { appStyles, color1 } from "@/styles/appStyles";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TransactionsScreen() {
  const navigation = useNavigation<any>();
  const { list, fetchMore, remove, selectedDate, setSelectedDate } = useTransactions();
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initial load on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchMore();
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  // 2. Memoized marked dates for calendar performance
  const markedDates = useMemo(() => {
    const marks: any = {};
    
    // Mark days with transactions
    list.forEach((t: any) => {
      if (t.date) {
        const d = t.date.split("T")[0];
        marks[d] = { marked: true, dotColor: color1 };
      }
    });

    // Mark selected day
    if (selectedDate) {
      marks[selectedDate] = { 
        ...marks[selectedDate], 
        selected: true, 
        selectedColor: color1 
      };
    }
    return marks;
  }, [list, selectedDate]);

  return (
    <View style={[appStyles.container, { flex: 1 }]}>
      <Text style={appStyles.title}>Transactions</Text>

      {/* Header with Calendar toggle */}
      <View style={styles.headerRow}>
        <Text style={styles.statusText}>
          {selectedDate ? `Filtered at: ${selectedDate}` : "All transactions"}
        </Text>
        <Pressable
          style={styles.calendarToggle}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Icon name={showCalendar ? "keyboard-arrow-up" : "date-range"} size={24} color={color1} />
        </Pressable>
      </View>

      {/* Calendar View */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(d) => {
              setSelectedDate(d.dateString);
              setShowCalendar(false); // Close after selection for better UX
            }}
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: color1,
              todayTextColor: color1,
              arrowColor: color1,
              dotColor: color1,
            }}
          />
          {selectedDate && (
            <TouchableOpacity 
              style={styles.clearFilter} 
              onPress={() => setSelectedDate(null)}
            >
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Transactions List */}
      {isLoading && list.length === 0 ? (
        <ActivityIndicator size="large" color={color1} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id?.toString()}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="receipt" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {selectedDate 
                  ? "No transactions found for this date" 
                  : "Your transaction history is empty"}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={appStyles.card}>
              <View style={styles.cardHeader}>
                <Text style={appStyles.cardTitle}>{item.description}</Text>
                <Text style={[
                  appStyles.cardAmount, 
                  { color: item.type === "OUT" ? "#e76f51" : "#2a9d8f" }
                ]}>
                  {item.type === "OUT" ? "-" : "+"} {item.amount} Ar
                </Text>
              </View>
              
              <Text style={styles.dateText}>
                {item.date ? item.date.split("T")[0] : "Unknown Date"}
              </Text>

              <View style={appStyles.cardActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("TransactionForm", { transaction: item })}
                  style={styles.actionButton}
                >
                  <Text style={appStyles.edit}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => remove(item.id)}
                  style={styles.actionButton}
                >
                  <Text style={appStyles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Action Button (Add) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TransactionForm")}
      >
        <Icon name="add" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic"
  },
  calendarToggle: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  clearFilter: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  clearFilterText: {
    color: "#e76f51",
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
    flexGrow: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
    fontFamily: "MoreSugar",
  },
  fab: {
    position: "absolute",
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 25,
    backgroundColor: color1,
    borderRadius: 35,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});