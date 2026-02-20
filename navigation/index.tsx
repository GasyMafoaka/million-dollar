import * as React from 'react';
// @ts-ignore
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Transaction from "@/screens/Transaction";
import Wallet from "@/screens/Wallet";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Transaction" component={Transaction} />
      <Stack.Screen name="Wallet" component={Wallet} />
    </Stack.Navigator>
  );
}