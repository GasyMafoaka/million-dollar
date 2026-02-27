import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTransactions } from "../../context/listTransactionContext";
import { Transaction } from "../../types/Transaction";

export default function TransactionsScreen() {
  const { list, fetchMore, add, remove, setSelectedDate, setFilterType } =
    useTransactions();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

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

  function setEditingItem(item: Transaction): void {
    console.log("Edit item:", item);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Calendar
        onDayPress={(d) => setSelectedDate(d.dateString)}
        markedDates={list.reduce((acc: any, t: { date: string }) => {
          const d = t.date.split("T")[0];
          acc[d] = { marked: true };
          return acc;
        }, {})}
      />

      <Pressable onPress={() => setFilterType("OUT")}>
        <Text>Dépenses</Text>
      </Pressable>
      <Pressable onPress={() => setFilterType("IN")}>
        <Text>Revenus</Text>
      </Pressable>

      <TextInput placeholder="Titre" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Montant"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />

      <Pressable onPress={submit}>
        <Text>Ajouter</Text>
      </Pressable>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        onEndReached={fetchMore}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}>
            <Text>{item.title}</Text>
            <Text>{item.amount} Ar</Text>

            <Pressable onPress={() => setEditingItem(item)}>
              <Text>Modifier</Text>
            </Pressable>

            <Pressable onPress={() => remove(String(item.id))}>
              <Text>Supprimer</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
