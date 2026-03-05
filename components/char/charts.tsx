import React from "react";
import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import CustomText from "@/components/CustomText";

export default function Charts() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>Expense Chart</CustomText>

      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              data: [50, 120, 80, 200, 150, 90],
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisSuffix="$"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(42, 157, 143, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(38, 70, 83, ${opacity})`,
        }}
        style={{
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
  },
});
