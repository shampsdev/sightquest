import { Button } from "@/components/ui/button";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const OnboardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const login = () => {
    navigation.navigate("SignIn");
  };

  const [screen, setScreen] = useState(0);
  const onScreenTap = () => {
    setScreen((oldScreen) => (oldScreen + 1) % 3);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-bg_primary justify-between"
      edges={["top", "bottom"]}
    >
      <Pressable
        onPress={onScreenTap}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-text_primary">Onboarding Screen {screen}</Text>
      </Pressable>
      <View className="h-28">
        <Button className="w-[90%] mx-auto" onPress={login} text={"Войти"} />
      </View>
    </SafeAreaView>
  );
};
