import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTransactions } from "../context/listTransactionContext";

export default function TransactionsScreen() {
  const {
    list,
    fetchMore,
    loading,
    hasMore,
    add,
    remove,
    setSelectedDate,
    markedDates,
  } = useTransactions();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const submit = async () => {
    if (!title || !amount || !date) return;

    await add({
      title,
      description: "",
      amount: Number(amount),
      date,
    });

    setTitle("");
    setAmount("");
    setDate("");
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-2">Calendrier</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <Text className="text-xl font-bold mt-4">Nouvelle transaction</Text>
      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        className="border p-2 rounded mt-2"
      />
      <TextInput
        placeholder="Montant"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
        className="border p-2 rounded mt-2"
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        className="border p-2 rounded mt-2"
      />

      <Pressable onPress={submit} className="bg-green-600 p-3 rounded mt-3">
        <Text className="text-white text-center font-bold">Ajouter</Text>
      </Pressable>

      <Text className="text-xl font-bold mt-4">Transactions</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => hasMore && fetchMore()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading ? <Text>Chargement...</Text> : null}
        renderItem={({ item }) => (
          <View className="border p-3 rounded mt-2">
            <Text className="font-bold">{item.title}</Text>
            <Text>{item.amount} Ar</Text>
            <Text>{item.date}</Text>
            <Pressable onPress={() => remove(item.id)}>
              <Text className="text-red-600 mt-1">Supprimer</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
