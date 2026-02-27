import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTransactions } from "../../context/listTransactionContext";

import { appStyles, color1 } from "@/styles/appStyles";

export default function TransactionsScreen() {
  const { list, fetchMore, add, remove, setSelectedDate, setFilterType } =
    useTransactions();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });

  if (!fontsLoaded) return null;

  const submit = async () => {
    if (!title || !amount || !date) return alert("Champs manquants");

    await add({
      title,
      description: "",
      amount: Number(amount),
      date,
      type,
    });

    setTitle("");
    setAmount("");
    setDate("");
  };

  return (
    <View style={appStyles.container}>
      <Image
        source={require("@/assets/images/LogoPF.png")}
        style={appStyles.logo}
      />
      <Text style={appStyles.title}>Transactions</Text>

      <Calendar
        onDayPress={(d) => setSelectedDate(d.dateString)}
        markedDates={list.reduce((acc: any, t: { date: string }) => {
          const d = t.date.split("T")[0];
          acc[d] = { marked: true };
          return acc;
        }, {})}
        theme={{
          selectedDayBackgroundColor: color1,
          todayTextColor: color1,
          arrowColor: color1,
        }}
      />

      <View style={appStyles.filterContainer}>
        <Pressable
          style={[
            appStyles.filterButton,
            type === "OUT" && appStyles.filterActive,
          ]}
          onPress={() => {
            setType("OUT");
            setFilterType("OUT");
          }}
        >
          <Text
            style={[appStyles.filterText, type === "OUT" && { color: "white" }]}
          >
            Dépenses
          </Text>
        </Pressable>

        <Pressable
          style={[
            appStyles.filterButton,
            type === "IN" && appStyles.filterActive,
          ]}
          onPress={() => {
            setType("IN");
            setFilterType("IN");
          }}
        >
          <Text
            style={[appStyles.filterText, type === "IN" && { color: "white" }]}
          >
            Revenus
          </Text>
        </Pressable>
      </View>

      <View style={appStyles.inputContainer}>
        <FontAwesome name="tag" size={22} color={color1} />
        <TextInput
          style={appStyles.textInput}
          placeholder="Titre"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={appStyles.inputContainer}>
        <FontAwesome name="money" size={22} color={color1} />
        <TextInput
          style={appStyles.textInput}
          placeholder="Montant"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={appStyles.inputContainer}>
        <FontAwesome name="calendar" size={22} color={color1} />
        <TextInput
          style={appStyles.textInput}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
      </View>

      <Pressable style={appStyles.button} onPress={submit}>
        <Text style={appStyles.buttonText}>Ajouter</Text>
      </Pressable>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        onEndReached={fetchMore}
        renderItem={({ item }) => (
          <View style={appStyles.card}>
            <Text style={appStyles.cardTitle}>{item.title}</Text>
            <Text style={appStyles.cardAmount}>{item.amount} Ar</Text>

            <View style={appStyles.cardActions}>
              <Pressable>
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
