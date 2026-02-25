import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function MainMenu() {
  const navigation = useNavigation<any>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      width: "100%",
      height: "100%",
      paddingTop: 10,
      fontFamily: "MoreSugar",
    },
    logo: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginBottom: 10,
    },
    LogoTittle: {
      fontSize: 40,
      marginBottom: 20,
      fontWeight: "normal",
      fontFamily: "MoreSugar",
    },
    button: {
      color: "white",
      backgroundColor: "#264653",
      height: 60,
      width: "80%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 25,
      marginTop: 25,
      borderRadius: 10,
      fontFamily: "MoreSugar",
    },
    buttonText: {
      fontFamily: "MoreSugar",
      color: "white",
      fontSize: 25,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/LogoPF.png")}
      />
      <Text style={styles.LogoTittle}>MillionDollars</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Transaction")}
      >
        <Text style={styles.buttonText}>Transactions</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Wallet")}
      >
        <Text style={styles.buttonText}>Wallet</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}
