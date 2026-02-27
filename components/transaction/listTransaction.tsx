import { appStyles, color1 } from "@/styles/appStyles";
import { useFonts } from "expo-font";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTransactions } from "../../context/listTransactionContext";

export default function TransactionsScreen({ navigation }: any) {
  const { list, fetchMore, remove, selectedDate, setSelectedDate } =
    useTransactions();

  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={appStyles.container}>
      <Image
        source={require("@/assets/images/LogoPF.png")}
        style={appStyles.logo}
      />

      <Text style={appStyles.title}>Transactions</Text>

      <Pressable
        style={appStyles.button}
        onPress={() => navigation.navigate("TransactionForm")}
      >
        <Text style={appStyles.buttonText}>Nouvelle Transaction</Text>
      </Pressable>

      <Calendar
        onDayPress={(d) => setSelectedDate(d.dateString)}
        markedDates={{
          ...list.reduce((acc: any, t: any) => {
            const d = t.date.split("T")[0];
            acc[d] = { marked: true };
            return acc;
          }, {}),
          ...(selectedDate && {
            [selectedDate]: {
              selected: true,
              selectedColor: color1,
            },
          }),
        }}
        theme={{
          selectedDayBackgroundColor: color1,
          todayTextColor: color1,
          arrowColor: color1,
        }}
      />

      {selectedDate && (
        <Pressable
          style={[appStyles.filterButton, { marginVertical: 10 }]}
          onPress={() => setSelectedDate(null)}
        >
          <Text style={appStyles.filterText}>Afficher tout</Text>
        </Pressable>
      )}

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Aucune transaction
          </Text>
        }
        renderItem={({ item }) => (
          <View style={appStyles.card}>
            <Text style={appStyles.cardTitle}>{item.title}</Text>
            <Text style={appStyles.cardAmount}>
              {item.type === "OUT" ? "-" : "+"}
              {item.amount} Ar
            </Text>

            <View style={appStyles.cardActions}>
              <Pressable
                onPress={() =>
                  navigation.navigate("TransactionForm", {
                    transaction: item,
                  })
                }
              >
                <Text style={appStyles.edit}>Modifier</Text>
              </Pressable>

              <Pressable onPress={() => remove(String(item.id))}>
                <Text style={appStyles.delete}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
