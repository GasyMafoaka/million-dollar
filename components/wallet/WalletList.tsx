import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import WalletItem from './WalletItem';

interface Wallet {
  id: string;
  name: string;
  reference: string;
  type: 'CASH' | 'BANK_ACCOUNT' | 'MOBILE_MONEY' | 'CRYPTO';
}

interface WalletListProps {
  wallets: Wallet[];
}

export default function WalletList({ wallets }: WalletListProps) {
  if (wallets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No wallets found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wallets}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <WalletItem wallet={item} />}
      contentContainerStyle={styles.listContainer}
      style={{ width: '100%' }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontFamily: 'MoreSugar',
    fontSize: 18,
    color: '#6c757d',
  },
});
