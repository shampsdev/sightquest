import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { View } from "react-native";

export const SignInScreen = () => {
  const { login } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center">
      <Button onPress={login} text={"войти"} />
    </View>
  );
};
