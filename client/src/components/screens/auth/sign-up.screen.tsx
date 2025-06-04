import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SignUpWidget } from "@/components/widgets/signup-widget";

export const SignUpScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-bg_primary" edges={["top", "bottom"]}>
      <SignUpWidget />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
