import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/textinput";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useAuthStore } from "@/shared/stores/auth.store";
import { login as loginRequest } from "@/shared/api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  Text,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export const SignInScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { login } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginRequest(username, password);
      login(response.user, response.token);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Ошибка входа", "Неверный логин или пароль");
    }
  };

  const goToRegister = () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg_primary" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-between">
            <View className="flex-1 gap-10 mt-[15%]">
              <View className="gap-2">
                <Text className="text-center text-3xl text-text_primary font-bounded-semibold">
                  Вход
                </Text>
                <Text className="text-center text-md text-text_secondary font-onest-medium">
                  Только не говори, что забыл пароль…
                </Text>
              </View>
              <View className="gap-4">
                <TextInput
                  placeholder="Никнейм"
                  value={username}
                  onChangeText={setUsername}
                  className="w-[90%] mx-auto"
                />
                <TextInput
                  secureTextEntry
                  placeholder="Пароль"
                  value={password}
                  onChangeText={setPassword}
                  className="w-[90%] mx-auto"
                />
              </View>
            </View>
            <View className="h-28 gap-5">
              <Button
                className="w-[90%] mx-auto"
                onPress={handleLogin}
                text="Войти"
              />
              <View className="flex flex-row gap-1 mx-auto">
                <Text className="font-medium text-text_secondary">
                  Нет аккаунта?
                </Text>
                <Pressable onPress={goToRegister}>
                  <Text className="font-medium text-text_primary">
                    Зарегистрироваться
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
