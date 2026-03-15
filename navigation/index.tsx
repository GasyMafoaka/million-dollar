import * as React from "react";
// @ts-ignore
import EditLabelScreen from "@/components/label/EditLabelScrren";
import CreateLabelScreen from "@/components/label/labelCreation";
import { Label } from "@/components/label/labelModel";
import LabelScreenList from "@/screens/LabelScreenList";
import MainMenu from "@/screens/MainMenu";
import Settings from "@/screens/Settings";
import SignIn from "@/screens/SignIn";
import SignUp from "@/screens/SignUp";
import SplashScreen from "@/screens/SplashScreen";
import Transaction from "@/screens/Transaction";
import Wallet from "@/screens/Wallet";
import WalletTransaction from "@/screens/WalletTransaction";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text } from "react-native";
import CreateGoalScreen from "@/components/goal/CreateGoalScreen";
import GoalsScreen from "@/screens/GoalsScreen";
import EditGoalScreen from "@/components/goal/EditGoalScreen"
import { createGoal } from "@/components/goal/goalService";

const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootStackParamList = {
  Splash: undefined;
  MainMenu: undefined;
  Transaction: undefined;
  Wallet: undefined;
  Settings: undefined;
  SignIn: { redirectScreenName?: keyof RootStackParamList };
  SignUp: { redirectScreenName?: keyof RootStackParamList };
  LabelList: undefined;
  Goal: undefined;
  CreateLabel: undefined;
  CreateGoal: undefined;
  EditGoal: undefined;
  EditLabel: { label: Label };
  WalletTransaction: undefined;
};

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: "",
        headerStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: false,
        headerLeft: () => {
          if (navigation.canGoBack()) {
            return (
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            );
          }
          return null;
        },
      })}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainMenu"
        component={MainMenu}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Transaction" component={Transaction} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="WalletTransaction" component={WalletTransaction} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="LabelList" component={LabelScreenList} />
      <Stack.Screen name="Goal" component={GoalsScreen} />
      <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
      <Stack.Screen name="EditGoal" component={EditGoalScreen} />
      <Stack.Screen name="CreateLabel" component={CreateLabelScreen} />
      <Stack.Screen name="EditLabel" component={EditLabelScreen} />
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
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 16,
  },
});
