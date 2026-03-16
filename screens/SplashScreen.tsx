import { session } from "@/service/session";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SplashScreen = ({ navigation }: any) => {
  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });

  // Valeur partagée pour l'animation (va de -1 à 1)
  const animationValue = useSharedValue(0);

  useEffect(() => {
    // Lancer l'animation de balancement en boucle
    animationValue.value = withRepeat(
      withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.sin) }),
      -1, // Infini
      true, // Retour en arrière pour un mouvement fluide
    );

    const checkSession = async () => {
      if (!fontsLoaded) return;

      await session.init();
      const token = session.getToken();

      const timer = setTimeout(() => {
        navigation.replace(token ? "MainMenu" : "SignIn");
      }, 3000);

      return () => clearTimeout(timer);
    };

    checkSession();
  }, [fontsLoaded, navigation]);

  // Style animé pour le logo unique
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animationValue.value * 80 },
        { rotateZ: `${animationValue.value * 15}deg` },
      ],
    };
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Un seul logo ici maintenant */}
      <Animated.Image
        source={require("@/assets/images/LogoPF-white.png")}
        style={[styles.logoWhite, animatedLogoStyle]}
      />

      <Text style={styles.title}>Million Dollars</Text>
      <Text style={styles.subtitle}>Manage your finances smartly</Text>
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
    marginTop: 20,
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
    resizeMode: "contain",
  },
});
