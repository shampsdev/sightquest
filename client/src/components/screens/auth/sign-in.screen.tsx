import { Button } from "@/components/ui/button";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, Pressable } from "react-native";

export const SignInScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const register = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View className="flex-1 bg-bg_primary justify-center items-center">
      <Button disabled text={"Войти"} />
      <View className="flex flex-row gap-1">
        <Text className="font-medium text-text_secondary">Нет аккаунта?</Text>
        <Pressable onPress={register}>
          <Text className="font-medium text-text_primary">
            Зарегистрироваться
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
