import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useListTransactionContext } from "../context/listTransactionContext";

const ListTransactionPage = () => {
  const {
    filteredTransactions,
    markedDates,
    selectedDate,
    setSelectedDate,
    loading,
    fetchData,
    hasMore,
  } = useListTransactionContext();

  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setShowCalendar(!showCalendar);
            if (showCalendar) setSelectedDate(null);
          }}
          style={{
            padding: 10,
            backgroundColor: "#2196F3",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#fff" }}>
            {showCalendar ? "Hide Calendar" : "Show Calendar"}
          </Text>
        </TouchableOpacity>

        {selectedDate && (
          <TouchableOpacity
            onPress={() => setSelectedDate(null)}
            style={{
              padding: 10,
              backgroundColor: "#4CAF50",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff" }}>Voir toutes</Text>
          </TouchableOpacity>
        )}
      </View>

      {showCalendar && (
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />
      )}

      {selectedDate && (
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          Transactions du {selectedDate}
        </Text>
      )}

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Text style={{ fontSize: 12 }}>{item.date}</Text>
          </View>
        )}
        onEndReached={() => {
          if (!loading && hasMore) fetchData();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

export default ListTransactionPage;
