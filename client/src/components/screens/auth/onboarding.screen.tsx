import { Button } from "@/components/ui/button";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text } from "react-native";

export const OnboardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const login = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Onboarding Screen</Text>
      <Button onPress={login} text={"Войти"} />
    </View>
  );
};
