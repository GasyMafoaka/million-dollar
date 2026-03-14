import CustomText from "@/components/CustomText";
import { Goal } from "@/components/goal/goalModel";
import { getGoals } from "@/components/goal/goalService";
import { session } from "@/service/session";
import { useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation";
import { NativeStackScreenProps} from "@react-navigation/native-stack";

type props = NativeStackScreenProps<RootStackParamList, "Goal">;

export default function GoalsScreen({ navigation }: props) {
  const [goals, setGoals] = useState<Goal[]>([]);

  const accountId = session.getAccount()?.id || "";
  const token = session.getToken() || "";

  const loadGoals = async () => {
    try {
      const data = await getGoals(accountId, token, 1, 20);
      setGoals(data.values || []);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={goals}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15 }}>
            <CustomText>{item.name}</CustomText>
            <CustomText>{item.amount}</CustomText>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateGoal")}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#264653",
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomText style={{ color: "white", fontSize: 30 }}>+</CustomText>
      </TouchableOpacity>
    </View>
  );
}