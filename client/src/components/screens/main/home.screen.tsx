import { Button } from "@/components/ui/button";
import { HomeScreenProps } from "@/routers/main.navigator";
import { Text, View } from "react-native";

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <View>
      <Text className="text-onest-bold">Home Page</Text>
      <Button text="ToMap" onPress={() => navigation.navigate("Map")} />
    </View>
  );
};
export default HomeScreen;
