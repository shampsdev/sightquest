import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { MainStackParamList } from "@/routers/main.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LobbyScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const back = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 justify-end bg-bg_primary">
      <View className="absolute top-20 w-full">
        <View className="w-[90%] mx-auto flex-row justify-between items-center">
          <Pressable onPress={back}>
            <IconContainer className="bg-[#222222]">
              <Icons.Back />
            </IconContainer>
          </Pressable>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
