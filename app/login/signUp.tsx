import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { navigate } from 'expo-router/build/global-state/routing';
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showUsernameAlert, setShowUsernameAlert] = useState(false);
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);
    const [showConfirmPasswordAlert, setShowConfirmPasswordAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    // const [mail, setMail] = useState("");
    const [fontsLoaded] = useFonts({
        'MoreSugar': require('@/assets/fonts/MoreSugar-Thin.ttf')
    });
    const color1 = "#264653";
    const urlBase = "http://localhost:8080"
    const handleSubmit = async () => {
        if (username.length < 4) {
            setShowUsernameAlert(true);

            setTimeout(() => {
                setShowUsernameAlert(false)
            }, 3000)
        } else {
            if (password.length < 8) {
                setShowPasswordAlert(true);

                setTimeout(() => {
                    setShowPasswordAlert(false);
                }, 3000)
            } else {
                if (password !== confirmPassword) {
                    setShowConfirmPasswordAlert(true);

                    setTimeout(() => {
                        setShowConfirmPasswordAlert(false);
                    }, 3000);
                }
                else {
                    try {
                        const response = await fetch(urlBase + "/auth/sign-up", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: username,
                                password: password
                            }),
                        });

                        const data = await response.json();
                        console.log(response);

                        if (response.ok) {
                            setShowSuccessAlert(true);

                            setTimeout(() => {
                                setShowSuccessAlert(false);
                            }, 3000)
                        } else {
                            console.log(data.message);

                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            width: '100%',
            height: '100%',
            paddingTop: 10,
            fontFamily: 'MoreSugar'
        },
        logo: {
            width: 200,
            height: 200,
            borderRadius: "50%",
            marginBottom: 10
        },
        LogoTittle: {
            fontSize: 40,
            marginBottom: 20,
            fontWeight: "normal",
            fontFamily: 'MoreSugar',
        },
        loginText: {
            fontSize: 20,
            fontWeight: "normal",
            fontFamily: 'MoreSugar',
            marginBottom: 5
        },
        viewInput: {
            width: '100%',
            display: "flex",
            alignItems: 'center'
        },
        inputContainer: {
            display: 'flex',
            width: '80%',
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: color1,
            padding: 5,
            paddingLeft: 10,
            borderRadius: 10,
            borderWidth: 2,
            marginTop: 20
        },
        text: {
            fontSize: 20,
            marginBottom: 20,
            fontFamily: 'MoreSugar'
        },
        textInput: {
            borderWidth: 2,
            borderColor: 'white',
            padding: 10,
            fontSize: 16,
            fontFamily: 'MoreSugar',
            width: "90%"
        },
        inputAlertContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'center'
        },
        inputAlertContainerText: {
            color: "red",
            fontFamily: "MoreSugar",
            fontSize: 14,
            marginLeft: 10
        },
        button: {
            backgroundColor: color1,
            height: 60,
            width: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            borderRadius: 10
        },
        buttonText: {
            fontFamily: 'MoreSugar',
            color: "white",
            fontSize: 25

        },
        signIn: {
            marginTop: 15,
            fontSize: 17,
            fontFamily: 'MoreSugar'
        },
        signInText: {
            color: color1,
            fontWeight: 'bold',
            fontFamily: 'MoreSugar'
        },
        signUpSucces: {
            backgroundColor: "green",
            height: 60,
            width: '45%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            borderRadius: 10,
            color: "white",
            fontFamily: "MoreSugar",
            fontSize: 20,
            left: "10%",
            bottom: "5%",
            position: "absolute"
        }
    });

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('@/assets/images/LogoPF.png')}
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
                        <FontAwesome
                            name="info-circle"
                            size={15}
                            color="red"
                        />
                        <Text style={styles.inputAlertContainerText}>Username must be at least 4 characters long.</Text>
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
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={24}
                            color={color1}
                        />
                    </Pressable>
                </View>
                {showPasswordAlert && (
                    <View style={styles.inputAlertContainer}>
                        <FontAwesome
                            name="info-circle"
                            size={15}
                            color="red"
                        />
                        <Text style={styles.inputAlertContainerText}>Password must be at least 8 characters long.</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={24} color={color1} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setconfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <FontAwesome
                            name={showConfirmPassword ? 'eye-slash' : 'eye'}
                            size={24}
                            color={color1}
                        />
                    </Pressable>
                </View>
                {showConfirmPasswordAlert && (
                    <View style={styles.inputAlertContainer}>
                        <FontAwesome
                            name="info-circle"
                            size={15}
                            color="red"
                        />
                        <Text style={styles.inputAlertContainerText}>Password confirmation is incorrect.</Text>
                    </View>
                )}
            </View>
            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    Sign Up
                </Text>
            </Pressable>
            <Text style={styles.signIn}>
                Already have an account ?
                <Text
                    style={styles.signInText}
                    onPress={() => navigate('/login/signIn')}
                > Sign in</Text>
            </Text>
            {showSuccessAlert && (
                <Text style={styles.signUpSucces}>User created</Text>
            )}
        </View>
    )
}