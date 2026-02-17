import { useFonts } from 'expo-font';
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Wallet() {
    const navigation = useNavigation<any>();
    const [fontsLoaded] = useFonts({
        'MoreSugar': require('@/assets/fonts/MoreSugar-Thin.ttf')
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            paddingTop: 50,
        },
        backButton: {
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: "#264653",
            padding: 10,
            borderRadius: 10,
        },
        backButtonText: {
            color: 'white',
            fontFamily: 'MoreSugar',
            fontSize: 16,
        },
        title: {
            fontSize: 30,
            fontFamily: 'MoreSugar',
            color: "#264653",
        }
    });

    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigation.navigate("MainMenu")}>
                <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Text style={styles.title}>Wallet</Text>
            {/*  write content here  */}
        </View>
    )
}