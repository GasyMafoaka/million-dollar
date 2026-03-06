import CustomText from "@/components/CustomText";
import { Goal } from "@/components/goal/goalModel";
import { getGoals } from "@/components/goal/goalService";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals("5e878c60-5f00-4939-a0ee-038b1e4b0305");
      setGoals(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <CustomText>{item.name}</CustomText>
            <CustomText>{item.amount}</CustomText>
          </View>
        )}
      />
    </View>
  );
}
