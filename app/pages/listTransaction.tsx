import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTransactions } from "../../context/listTransactionContext";
import { Transaction } from "../../types/Transaction";

export default function TransactionsScreen() {
  const {
    list,
    fetchMore,
    add,
    remove,
    update,
    setSelectedDate,
    setFilterType,
    notificationHour,
    setNotificationHour,
  } = useTransactions();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);

  const submit = async () => {
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

  const confirmDelete = (id: string) => {
    Alert.alert("Confirmation", "Supprimer cette transaction ?", [
      { text: "Annuler" },
      { text: "Oui", onPress: () => remove(id) },
    ]);
  };

  const openEditModal = (item: Transaction) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingItem) return;

    await update(editingItem.id.toString(), editingItem);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Calendar
        onDayPress={(d) => setSelectedDate(d.dateString)}
        markedDates={{
          ...list.reduce((acc: any, t) => {
            const d = t.date.split("T")[0];
            acc[d] = { marked: true };
            return acc;
          }, {}),
        }}
      />

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
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchMore}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}>
            <Text>{item.title}</Text>
            <Text>{item.amount} Ar</Text>

            <Pressable onPress={() => openEditModal(item)}>
              <Text>Modifier</Text>
            </Pressable>

            <Pressable onPress={() => confirmDelete(item.id.toString())}>
              <Text>Supprimer</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ padding: 20 }}>
          <Text>Modifier transaction</Text>

          <TextInput
            value={editingItem?.title}
            onChangeText={(v) =>
              setEditingItem((prev) => prev && { ...prev, title: v })
            }
          />

          <TextInput
            value={editingItem?.amount.toString()}
            keyboardType="numeric"
            onChangeText={(v) =>
              setEditingItem((prev) => prev && { ...prev, amount: Number(v) })
            }
          />

          <Pressable onPress={saveEdit}>
            <Text>Enregistrer</Text>
          </Pressable>

          <Pressable onPress={() => setModalVisible(false)}>
            <Text>Annuler</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
