import { Label, labelsApi } from "@/api/label.api";
import { useSession } from "@/auth/useSession";
import { useTransactions } from "@/context/listTransactionContext";
import { useSelectedWallet } from "@/context/WalletContext";
import { appStyles, color1 } from "@/styles/appStyles";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function TransactionFormScreen({ route, navigation }: any) {
  const { add, update } = useTransactions();
  const { accountId } = useSession();
  const { selectedWalletId } = useSelectedWallet();

  // On récupère l'item si on est en mode édition
  const editingItem = route.params?.transaction;

  // États du formulaire
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Date du jour par défaut
  const [type, setType] = useState<"IN" | "OUT">("OUT");

  // Gestion des labels
  const [allLabels, setAllLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // 1. Charger la liste complète des labels de l'utilisateur (pour afficher les noms)
  useEffect(() => {
    const loadLabels = async () => {
      if (!accountId) return;
      try {
        const data = await labelsApi.list(accountId);
        setAllLabels(data || []);
      } catch (e) {
        console.log("Erreur chargement labels", e);
      }
    };
    loadLabels();
  }, [accountId]);

  // 2. Initialiser le formulaire si on modifie une transaction existante
  useEffect(() => {
    if (editingItem) {
      setDescription(editingItem.description);
      setAmount(String(editingItem.amount));
      setDate(editingItem.date?.split("T")[0]);
      setType(editingItem.type);
      if (editingItem.labels) {
        setSelectedLabels(editingItem.labels.map((l: any) => l.id));
      }
    }
  }, [editingItem]);

  // 3. Écouter le retour de l'écran "SelectLabels"
  // On utilise route.params pour récupérer les données renvoyées par navigation.navigate
  useEffect(() => {
    if (route.params?.selectedLabels) {
      setSelectedLabels(route.params.selectedLabels);
    }
  }, [route.params?.selectedLabels]);

  const submit = async () => {
    if (!selectedWalletId) {
      Alert.alert("Erreur", "Veuillez sélectionner un wallet");
      return;
    }

    if (!description || !amount || !date) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }

    // Vérification sommaire de la date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      Alert.alert("Erreur", "Format de date invalide (YYYY-MM-DD)");
      return;
    }

    const payload = {
      description,
      amount: Number(amount),
      type,
      date: dateObj.toISOString(),
      // On récupère les objets Label complets depuis la liste chargée au début
      labels: allLabels.filter((label) => selectedLabels.includes(label.id)),
    };

    try {
      if (editingItem?.id) {
        await update(editingItem.id, payload);
      } else {
        await add(payload);
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Erreur", "Impossible d'enregistrer la transaction");
    }
  };

  // On récupère les noms des labels sélectionnés pour l'affichage
  const displayLabels = allLabels
    .filter((l) => selectedLabels.includes(l.id))
    .map((l) => l.name)
    .join(", ");

  return (
    <ScrollView contentContainerStyle={appStyles.container}>
      <Text style={styles.sectionTitle}>
        {editingItem ? "Modifier la transaction" : "Nouvelle transaction"}
      </Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={appStyles.textInput}
        placeholder="Ex: Courses, Loyer..."
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Montant (MGA)</Text>
      <TextInput
        style={appStyles.textInput}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Date (AAAA-MM-JJ)</Text>
      <TextInput
        style={appStyles.textInput}
        placeholder="2026-03-15"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Wallet</Text>
      <Pressable
        style={styles.selectorPressable}
        onPress={() => navigation.navigate("SelectWallet", {selectedLabels : selectedLabels})}
      >
        <Text style={styles.selectorText}>
          {selectedWalletId
            ? `Portefeuille actif: ${selectedWalletId}`
            : "Choisir un wallet"}
        </Text>
      </Pressable>

      <Text style={styles.label}>Catégories (Labels)</Text>
      <Pressable
        style={styles.selectorPressable}
        onPress={() =>
          navigation.navigate("SelectLabels", {
            currentSelectedIds: selectedLabels,
          })
        }
      >
        <Text style={styles.selectorText}>
          {selectedLabels.length ? displayLabels : "Aucun label sélectionné"}
        </Text>
      </Pressable>

      <Text style={styles.label}>Type de flux</Text>
      <View style={styles.typeRow}>
        <Pressable
          style={[
            styles.typeButton,
            { backgroundColor: type === "IN" ? "#2a9d8f" : "#eee" },
          ]}
          onPress={() => setType("IN")}
        >
          <Text
            style={[
              styles.typeButtonText,
              { color: type === "IN" ? "white" : "#666" },
            ]}
          >
            Entrée (+)
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.typeButton,
            { backgroundColor: type === "OUT" ? "#e76f51" : "#eee" },
          ]}
          onPress={() => setType("OUT")}
        >
          <Text
            style={[
              styles.typeButtonText,
              { color: type === "OUT" ? "white" : "#666" },
            ]}
          >
            Sortie (-)
          </Text>
        </Pressable>
      </View>

      <Pressable style={[appStyles.button, { marginTop: 30 }]} onPress={submit}>
        <Text style={appStyles.buttonText}>
          {editingItem ? "Mettre à jour" : "Enregistrer"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "MoreSugar",
    fontSize: 24,
    color: color1,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontFamily: "MoreSugar",
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
    marginTop: 10,
  },
  selectorPressable: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fcfcfc",
    marginBottom: 10,
  },
  selectorText: {
    fontFamily: "MoreSugar",
    fontSize: 14,
    color: "#444",
  },
  typeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 5,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  typeButtonText: {
    fontFamily: "MoreSugar",
    fontWeight: "bold",
  },
});
