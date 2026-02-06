import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { navigate } from 'expo-router/build/global-state/routing';
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUp(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [mail, setMail] = useState("");
    const [fontsLoaded] = useFonts({
        'MoreSugar' : require('@/assets/fonts/MoreSugar-Thin.ttf')
        });
    const color1 = "#264653";
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
         width : '100%',
        height: '100%',
        paddingTop: 10,
        fontFamily: 'MoreSugar'
    },
    logo:{
            width : 200,
            height: 200,
            borderRadius: "50%",
            marginBottom: 10
    },
    LogoTittle:{
        fontSize: 40,
        marginBottom: 20,
        fontWeight : "normal",
        fontFamily : 'MoreSugar', 
    },
    loginText:{
        fontSize: 20,
        fontWeight : "normal",
        fontFamily : 'MoreSugar',
        marginBottom: 20
    },
    viewInput : {
        width: '100%',
        display : "flex",
        alignItems: 'center'
    },
    inputContainer : {
        display : 'flex',
        width : '80%',
        flexDirection : 'row',
        alignItems : 'center',
        borderColor : color1,
        padding : 5,
        paddingLeft : 10,
        borderRadius : 10,
        borderWidth: 2,
        marginBottom : 20
    },
    text: {
        fontSize : 20,
        marginBottom : 20,
        fontFamily : 'MoreSugar'
    },
    textInput :{
        borderWidth: 2,
        borderColor: 'white',
        padding: 10,
        fontSize : 16,
        fontFamily : 'MoreSugar'
    },
    button : {
        color : "white",
        backgroundColor : color1,
        height : 60,
        width: '80%',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        fontSize : 25,
        marginTop : 12,
        borderRadius : 10,
        fontFamily : 'MoreSugar'
    },
    signIn : {
        marginTop : 15,
        fontSize: 17,
        fontFamily : 'MoreSugar'
    },
    signInText :{
        color : color1,
        fontWeight: 'bold',
        fontFamily: 'MoreSugar'
    }
});
    return(
        <View style = {styles.container}>
            <Image
                style = {styles.logo}
                    source={require('@/assets/images/LogoPF.png')}
            />
            <Text style={styles.LogoTittle}>MillionDollars</Text>
            <Text style= {styles.loginText}>Login to your account</Text>
            <View style = {styles.viewInput}>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="user" size={24} color={color1} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="envelope" size={24} color={color1} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Email"
                        value={mail}
                        onChangeText={setMail}
                    />
                </View>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="lock" size={24} color={color1} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="lock" size={24} color={color1} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder=" Confirm password"
                        value={confirmPassword}
                        onChangeText={setconfirmPassword}
                    />
                </View>
            </View>
            <Text style = {styles.button}>
                Sign Up
            </Text>
            <Text style = {styles.signIn}>
                Already have an account ?  
                <Text
                    style = {styles.signInText}
                    onPress={()=> navigate('/login/signIn')}
                > Sign in</Text>
            </Text>
        </View>
    )
}