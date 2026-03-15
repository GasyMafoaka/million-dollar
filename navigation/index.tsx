import { Goal } from "@/api/goal";
import CreateGoalScreen from "@/components/goal/CreateGoalScreen";
import EditGoalScreen from "@/components/goal/EditGoal";
import GoalDetailsScreen from "@/components/goal/GoalDeatilScreen";
import GoalListScreen from "@/components/goal/GoalListScreen";
import EditLabelScreen from "@/components/label/EditLabelScrren";
import CreateLabelScreen from "@/components/label/labelCreation";
import { Label } from "@/components/label/labelModel";
import GoalWalletList from "@/screens/GoalWalletList";
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
import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootStackParamList = {
  Splash: undefined;
  MainMenu: undefined;
  Transaction: undefined;
  Wallet: undefined;
  WalletTransaction: undefined;
  Settings: undefined;
  SignIn: { redirectScreenName?: keyof RootStackParamList };
  SignUp: { redirectScreenName?: keyof RootStackParamList };
  LabelList: undefined;
  CreateLabel: undefined;
  EditLabel: { label: Label };
  GoalListScreen: { walletId: string | undefined };
  CreateGoal: { walletId: string | undefined };
  EditGoal: { goal: Goal };
  GoalWalletList: undefined;
  GoalDetail: { goal: Goal };
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
      <Stack.Screen name="CreateLabel" component={CreateLabelScreen} />
      <Stack.Screen name="EditLabel" component={EditLabelScreen} />
      <Stack.Screen name="GoalListScreen" component={GoalListScreen} />
      <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
      <Stack.Screen name="EditGoal" component={EditGoalScreen} />
      <Stack.Screen name="GoalWalletList" component={GoalWalletList} />
      <Stack.Screen name="GoalDetail" component={GoalDetailsScreen} />
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
