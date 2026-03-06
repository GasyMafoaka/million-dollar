import CustomText from "@/components/CustomText";
import { Goal } from "@/components/goal/goalModel";
import { getGoals } from "@/components/goal/goalService";
import { session } from "@/service/session";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const accountId = session.getAccount()?.id || "";

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals(accountId);
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
