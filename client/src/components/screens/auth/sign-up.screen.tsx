import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { View } from "react-native";

export const SignUpScreen = () => {
  const { login } = useAuthStore();

  return (
    <View className="flex-1 bg-bg_primary justify-center items-center">
      <Button onPress={login} text={"Войти"} />
    </View>
  );
};
