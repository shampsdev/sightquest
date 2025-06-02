import { HomeScreenProps } from "@/App";
import { Button } from "@/components/ui/Button/button";
import { Pressable, Text, View } from "react-native";

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <View>
      <Text className="text-onest-bold">Home Page</Text>
      <Button text="ToMap" onPress={() => navigation.navigate("Map")} />
    </View>
  );
};
export default HomeScreen;
