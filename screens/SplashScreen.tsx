import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { CSSAnimationKeyframes } from "react-native-reanimated";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainMenu");
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
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
    fontFamily: "MoreSugar",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
    fontFamily: "MoreSugar",
  },
  logoWhite: {
    width: 200,
    height: 200,
  },
});