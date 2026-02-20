import * as React from 'react';
// @ts-ignore
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text, StyleSheet } from 'react-native';
import Transaction from "@/screens/Transaction";
import Wallet from "@/screens/Wallet";
import MainMenu from "@/screens/MainMenu";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: "",
        headerStyle: {
          backgroundColor: 'white',
        },
        headerShadowVisible: false,
        headerLeft: () => {
          if (navigation.canGoBack()) {
            return (
              <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            );
          }
          return null;
        }
      })}
    >
      <Stack.Screen
        name="MainMenu"
        component={MainMenu}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Transaction" component={Transaction} />
      <Stack.Screen name="Wallet" component={Wallet} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#264653",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  backButtonText: {
    color: 'white',
    fontFamily: 'MoreSugar',
    fontSize: 16,
  },
});