import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable } from "react-native";
import { Map } from "@/components/widgets/map";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@/routers/main.navigator";

export const MapScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const account = () => {
    navigation.navigate("Account");
  };

  return (
    <View className="flex-1">
      <Map />
      <Button
        className="absolute right-0 left-0 bottom-8 m-8 w-auto"
        text="Начать игру"
      />
      <IconContainer className="absolute top-16 left-5">
        <Icons.Store />
      </IconContainer>
      <Pressable className="absolute top-16 right-5" onPress={account}>
        <IconContainer>
          <Text className="text-text_primary font-bounded-bold">A</Text>
        </IconContainer>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
};
