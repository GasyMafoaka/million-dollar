import React, { useEffect } from "react";
<<<<<<< HEAD
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { CSSAnimationKeyframes } from "react-native-reanimated";
import { useFonts } from "expo-font";

const march: CSSAnimationKeyframes = {
  "0%": {
    transform: [{ translateX: -80 }, { rotateZ: "-15deg" }],
  },
  "50%": {
    transform: [{ translateX: 0 }, { rotateZ: "0deg" }],
  },
  "100%": {
    transform: [{ translateX: 80 }, { rotateZ: "15deg" }],
  },
};


const SplashScreen = ({ navigation }: any) => {
  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });
=======
import { View, Text, StyleSheet, Image } from "react-native";

const SplashScreen = ({ navigation }: any) => {
>>>>>>> refs/remotes/origin/splashscreen

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainMenu");
<<<<<<< HEAD
    }, 7000);
=======
    }, 2000);
>>>>>>> refs/remotes/origin/splashscreen

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
<<<<<<< HEAD
        <Animated.Image 
                source={require('@/assets/images/LogoPF-white.png')}
                style={[
                  styles.logoWhite,
                  {
                    animationName: march,
                    animationDuration: "2.5s",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "ease-in-out",
                    animationDirection: "alternate",
                  },
                ]}
                />
      <Text style={styles.title}>Million Dollars</Text>
=======
        <Image style={styles.logoWhite}
        source={require('@/assets/images/LogoPF-white.png')} />
      <Text style={styles.title}>Million Dollar</Text>
>>>>>>> refs/remotes/origin/splashscreen
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
<<<<<<< HEAD
    fontFamily: "MoreSugar",
=======
>>>>>>> refs/remotes/origin/splashscreen
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
<<<<<<< HEAD
    fontFamily: "MoreSugar",
=======
>>>>>>> refs/remotes/origin/splashscreen
  },
  logoWhite: {
    width: 200,
    height: 200,
  },
});