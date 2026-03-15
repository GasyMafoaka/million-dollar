import { signIn, signUp } from "@/api/account";
import { session } from "@/service/session";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RootStackParamList } from "../../navigation/index";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUp({ route }: Props) {
  const { redirectScreenName = "MainMenu" } = route.params || {};
  const navigation = useNavigation<any>();
  const color1 = "#264653";

  // États du formulaire
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  // États d'affichage
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // États des alertes
  const [showUsernameAlert, setShowUsernameAlert] = useState(false);
  const [userExistAlert, setUserExistAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [showConfirmPasswordAlert, setShowConfirmPasswordAlert] =
    useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // 1. Validations Locales
    if (username.length < 4) {
      setShowUsernameAlert(true);
      return setTimeout(() => setShowUsernameAlert(false), 3000);
    }

    if (password.length < 8) {
      setShowPasswordAlert(true);
      return setTimeout(() => setShowPasswordAlert(false), 3000);
    }

    if (password !== confirmPassword) {
      setShowConfirmPasswordAlert(true);
      return setTimeout(() => setShowConfirmPasswordAlert(false), 3000);
    }

    // 2. Appel API
    try {
      setSubmitted(true);
      const data = await signUp({ username, password });

      if (data && data.id) {
        // Succès de l'inscription
        setShowSuccessAlert(true);

        // Tentative d'Auto-login
        try {
          const signInData = await signIn({ username, password });
          if (signInData.account && signInData.token) {
            await session.setSession(signInData.account, signInData.token);
          }
        } catch (loginError) {
          console.log("Auto-login failed:", loginError);
        }

        // Redirection après succès
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigation.replace(redirectScreenName);
        }, 2000);
      }
    } catch (error: any) {
      setSubmitted(false);
      console.log("Sign up error:", error);

      // Gestion de l'utilisateur déjà existant
      if (
        error.message?.includes("400") ||
        error.message?.toLowerCase().includes("exist")
      ) {
        setUserExistAlert(true);
        setTimeout(() => setUserExistAlert(false), 3000);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/LogoPF.png")}
      />
      <Text style={styles.LogoTittle}>MillionDollars</Text>
      <Text style={styles.loginText}>Create your account</Text>

      <View style={styles.viewInput}>
        {/* Champ Username */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color={color1} />
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        {showUsernameAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="red" />
            <Text style={styles.inputAlertContainerText}>
              Username must be at least 4 characters long.
            </Text>
          </View>
        )}
        {userExistAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="red" />
            <Text style={styles.inputAlertContainerText}>
              Your username is already used.
            </Text>
          </View>
        )}

        {/* Champ Password */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color={color1} />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={24}
              color={color1}
            />
          </Pressable>
        </View>
        {showPasswordAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="red" />
            <Text style={styles.inputAlertContainerText}>
              Password must be at least 8 characters long.
            </Text>
          </View>
        )}

        {/* Champ Confirm Password */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color={color1} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setconfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={24}
              color={color1}
            />
          </Pressable>
        </View>
        {showConfirmPasswordAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="red" />
            <Text style={styles.inputAlertContainerText}>
              Password confirmation is incorrect.
            </Text>
          </View>
        )}
      </View>

      {/* Bouton de soumission */}
      {!submitted ? (
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      ) : (
        <View style={[styles.button, { opacity: 0.7 }]}>
          <Text style={styles.buttonText}>Processing...</Text>
        </View>
      )}

      <Text style={styles.signIn}>
        Already have an account?{" "}
        <Text
          style={styles.signInText}
          onPress={() =>
            navigation.navigate("SignIn", {
              redirectScreenName: redirectScreenName,
            })
          }
        >
          Sign in
        </Text>
      </Text>

      {showSuccessAlert && (
        <View style={styles.signUpSuccesContainer}>
          <Text style={styles.signUpSuccesText}>User created!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  LogoTittle: {
    fontSize: 32,
    marginBottom: 10,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  loginText: {
    fontSize: 18,
    fontFamily: "MoreSugar",
    marginBottom: 20,
    color: "#666",
  },
  viewInput: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    width: "85%",
    alignItems: "center",
    borderColor: "#264653",
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 15,
    height: 55,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#264653",
  },
  inputAlertContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 5,
  },
  inputAlertContainerText: {
    color: "red",
    fontFamily: "MoreSugar",
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#264653",
    height: 55,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: "MoreSugar",
    color: "white",
    fontSize: 22,
  },
  signIn: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "MoreSugar",
    color: "#666",
  },
  signInText: {
    color: "#264653",
    fontWeight: "bold",
  },
  signUpSuccesContainer: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#2a9d8f",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  signUpSuccesText: {
    color: "white",
    fontFamily: "MoreSugar",
    fontSize: 16,
  },
});
