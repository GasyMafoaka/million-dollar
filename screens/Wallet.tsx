import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Wallet() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            paddingTop: 10,
        },
        title: {
            fontSize: 30,
            fontFamily: 'MoreSugar',
            color: "#264653",
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wallet</Text>
            {/*  write content here  */}
        </View>
    )
}