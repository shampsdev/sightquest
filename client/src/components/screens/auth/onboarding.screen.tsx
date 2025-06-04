import { Button } from "@/components/ui/button";
import { OnboardingWidget } from "@/components/widgets/onboarding-widget";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const OnboardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const login = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-bg_primary justify-between"
      edges={["top", "bottom"]}
    >
      <OnboardingWidget />
      <View className="h-28">
        <Button className="w-[90%] mx-auto" onPress={login} text={"Войти"} />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
