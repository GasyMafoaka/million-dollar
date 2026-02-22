import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const SplashScreen = ({ navigation }: any) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainMenu");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
        <Image style={styles.logoWhite}
        source={require('@/assets/images/LogoPF-white.png')} />
      <Text style={styles.title}>Million Dollar</Text>
      <Text style={styles.subtitle}>Gérez vos finances intelligemment</Text>
    </View>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#224654",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
  logoWhite: {
    width: 200,
    height: 200,
  },
});