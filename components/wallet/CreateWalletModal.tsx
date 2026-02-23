import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CreateWalletModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (wallet: { name: string; reference: string; type: string }) => void;
}

const WALLET_TYPES = ['CASH', 'BANK_ACCOUNT', 'MOBILE_MONEY', 'CRYPTO'];

export default function CreateWalletModal({ visible, onClose, onCreate }: CreateWalletModalProps) {
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [type, setType] = useState('CASH');

  const handleCreate = () => {
    if (name && reference) {
      onCreate({ name, reference, type });
      setName('');
      setReference('');
      setType('CASH');
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
            <Text style={styles.modalTitle}>Create New Wallet</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color="#264653" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wallet Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. My Savings"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference</Text>
            <TextInput
              style={styles.input}
              value={reference}
              onChangeText={setReference}
              placeholder="e.g. SAV-001"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              {WALLET_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeOption,
                    type === t && styles.selectedTypeOption
                  ]}
                  onPress={() => setType(t)}
                >
                  <Text style={[
                    styles.typeOptionText,
                    type === t && styles.selectedTypeOptionText
                  ]}>
                    {t.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Pressable style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Create Wallet</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'MoreSugar',
    color: '#264653',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'MoreSugar',
    color: '#264653',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'MoreSugar',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#264653',
  },
  selectedTypeOption: {
    backgroundColor: '#264653',
  },
  typeOptionText: {
    fontFamily: 'MoreSugar',
    fontSize: 12,
    color: '#264653',
  },
  selectedTypeOptionText: {
    color: 'white',
  },
  createButton: {
    backgroundColor: '#264653',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontFamily: 'MoreSugar',
    fontSize: 18,
  },
});
