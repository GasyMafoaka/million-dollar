import { FontAwesome } from '@expo/vector-icons';
import { navigate } from 'expo-router/build/global-state/routing';
import React from 'react';
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function SignIp(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mail, setMail] = useState("");
    return(
        <View style = {styles.container}>
            <Text style={styles.loginText}>Sign In</Text>
            <View style = {styles.viewInput}>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="user" size={24} color="blue" />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="envelope" size={24} color="blue" />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Email"
                        value={mail}
                        onChangeText={setMail}
                    />
                </View>
                <View style = {styles.inputContainer}>
                    <FontAwesome name="lock" size={24} color="blue" />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>
            </View>
            <Text style = {styles.button}>
                Sign In
            </Text>
            <Text 
                style = {styles.signUp}
                >New User ? 
                <Text
                    style = {styles.signInText}
                    onPress={()=> navigate('/pages/listTransaction')}
                   > Register Now</Text>
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        width : '100%',
        height: '100%',
        paddingTop: 100 
    },
    loginText:{
        fontSize: 60,
        fontWeight : "normal",
        fontFamily : 'sans-serif',
        color : 'blue'
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
        borderColor : 'blue',
        padding : 5,
        paddingLeft : 10,
        borderRadius : 10,
        borderWidth: 3,
        marginBottom : 20
    },
    text: {
        fontSize : 20,
        marginBottom : 20
    },
    textInput :{
        borderWidth: 0,
        borderColor: 'red',
        padding: 10,
        fontSize : 16,
        width: '90%',
    },
    button : {
        color : "white",
        backgroundColor : "blue",
        height : 60,
        width: '80%',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        fontSize : 25,
        marginTop : 12,
        borderRadius : 10
    },
    signUp : {
        marginTop : 15,
        fontSize: 17
    },
     signInText :{
        color : 'blue',
        textDecorationLine : 'underline'
    }
});