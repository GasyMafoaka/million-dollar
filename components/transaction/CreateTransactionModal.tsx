import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CreationTransaction } from "@/api/transaction/model";

interface CreateTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (transaction: CreationTransaction) => void;
}

const TRANSACTION_TYPES: Array<CreationTransaction["type"]> = ["IN", "OUT"];

export default function CreateTransactionModal({
  visible,
  onClose,
  onCreate,
}: CreateTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<CreationTransaction["type"]>("OUT");

  const handleCreate = () => {
    const amountNum = parseFloat(amount);
    if (description && !isNaN(amountNum) && type) {
      onCreate({
        description,
        amount: amountNum,
        type,
        date: new Date().toISOString(),
      });
      setDescription("");
      setAmount("");
      setType("OUT");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>New Transaction</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color="#264653" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. Groceries"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              {TRANSACTION_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeOption,
                    type === t && styles.selectedTypeOption,
                  ]}
                  onPress={() => setType(t)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === t && styles.selectedTypeOptionText,
                    ]}
                  >
                    {t === "IN" ? "Income" : "Expense"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Pressable style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Add Transaction</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#264653",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "MoreSugar",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 10,
  },
  typeOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#264653",
  },
  selectedTypeOption: {
    backgroundColor: "#264653",
  },
  typeOptionText: {
    fontFamily: "MoreSugar",
    fontSize: 14,
    color: "#264653",
  },
  selectedTypeOptionText: {
    color: "white",
  },
  createButton: {
    backgroundColor: "#264653",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 18,
  },
});
