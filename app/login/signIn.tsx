import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { navigate } from "expo-router/build/global-state/routing";
import React, { useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function SignIp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [mail, setMail] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showUsernameAlert, setShowUsernameAlert] = useState(false);
  const [showUserNotFoundAlert, setShowUserNotFoundAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [showBadPasswordAlert, setShowBadPasswordAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [fontsLoaded] = useFonts({
    MoreSugar: require("@/assets/fonts/MoreSugar-Thin.ttf"),
  });
  const color1 = "#264653";
  const baseUrl = "http://localhost:8080";

  const handleSubmit = async () => {
    if (username.length < 4) {
      setShowUsernameAlert(true);

      setTimeout(() => {
        setShowUsernameAlert(false);
      }, 3000);
    } else {
      try {
        const response = await fetch(baseUrl + "/auth/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setShowSuccessAlert(true);

          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 3000);
        }
        if (data.code === 404) {
          setShowUserNotFoundAlert(true);

          setTimeout(() => {
            setShowUserNotFoundAlert(false);
          }, 3000);
        }
        if (data.message === "Bad password") {
          setShowBadPasswordAlert(true);

          setTimeout(() => {
            setShowBadPasswordAlert(false);
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
      if (password.length < 8) {
        setShowPasswordAlert(true);

        setTimeout(() => {
          setShowPasswordAlert(false);
        }, 3000);
      }
    }
  };

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
      borderRadius: "50%",
      marginBottom: 10,
    },
    LogoTittle: {
      fontSize: 40,
      marginBottom: 20,
      fontWeight: "normal",
      fontFamily: "MoreSugar",
    },
    loginText: {
      fontSize: 20,
      fontWeight: "normal",
      fontFamily: "MoreSugar",
      marginBottom: 5,
    },
    viewInput: {
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    inputContainer: {
      display: "flex",
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      borderColor: color1,
      padding: 5,
      paddingLeft: 10,
      borderRadius: 10,
      borderWidth: 2,
      marginTop: 25,
    },
    text: {
      fontSize: 20,
      marginBottom: 20,
      fontFamily: "MoreSugar",
    },
    textInput: {
      borderWidth: 0,
      borderColor: "red",
      padding: 10,
      fontSize: 16,
      width: "90%",
      fontFamily: "MoreSugar",
    },
    inputAlertContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    inputAlertContainerText: {
      color: "red",
      fontFamily: "MoreSugar",
      fontSize: 14,
      marginLeft: 10,
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
    signIn: {
      marginTop: 15,
      fontSize: 17,
      fontFamily: "MoreSugar",
    },
    signInText: {
      color: color1,
      fontWeight: "bold",
      fontFamily: "MoreSugar",
    },
    signInSucces: {
      backgroundColor: "green",
      height: 60,
      width: "45%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      borderRadius: 10,
      color: "white",
      fontFamily: "MoreSugar",
      fontSize: 20,
      left: "10%",
      bottom: "5%",
      position: "absolute",
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/LogoPF.png")}
      />
      <Text style={styles.LogoTittle}>MillionDollars</Text>
      <Text style={styles.loginText}>Login to your account</Text>
      <View style={styles.viewInput}>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color={color1} />
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
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
        {showUserNotFoundAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="red" />
            <Text style={styles.inputAlertContainerText}>User not found.</Text>
          </View>
        )}
        {/* <View style = {styles.inputContainer}>
                    <FontAwesome name="envelope" size={24} color={color1} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Email"
                        value={mail}
                        onChangeText={setMail}
                    />
                </View> */}
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
        {showBadPasswordAlert && (
          <View style={styles.inputAlertContainer}>
            <FontAwesome name="info-circle" size={15} color="red" />
            <Text style={styles.inputAlertContainerText}>
              Your password is wrong.
            </Text>
          </View>
        )}
      </View>
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Text style={styles.signIn}>
        New User ?
        <Text
          style={styles.signInText}
          onPress={() => navigate("/login/signUp")}
        >
          {" "}
          Register Now
        </Text>
      </Text>
      {showSuccessAlert && (
        <Text style={styles.signInSucces}>Sign In successfull</Text>
      )}
    </View>
  );
}
