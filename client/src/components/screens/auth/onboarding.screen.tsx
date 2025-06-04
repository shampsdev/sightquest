import { Button } from "@/components/ui/button";
import { ProgressBarSteps } from "@/components/ui/progress/progress-bar-steps";
import { ProgressBarStepsSimple } from "@/components/ui/progress/progress-bar-stesps-simple";
import { Onboarding } from "@/components/widgets/onboarding";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
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
      <Onboarding />
      <View className="h-28">
        <Button className="w-[90%] mx-auto" onPress={login} text={"Войти"} />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
