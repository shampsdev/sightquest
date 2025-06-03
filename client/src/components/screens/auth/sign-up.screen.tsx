import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/textinput";
import { useAuthStore } from "@/shared/stores/auth.store";
import { register as registerRequest } from "@/shared/api/auth.api";
import { useState } from "react";

export const SignUpScreen = () => {
  const { login } = useAuthStore();

  const [name, setName] = useState(""); // not sent to api
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await registerRequest(email, username, password);
      login({ username }, response.token);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Ошибка регистрации", "Проверьте корректность данных");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg_primary" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 gap-10 mt-[15%]">
              <View className="gap-2">
                <Text className="text-center text-3xl text-text_primary font-bounded-semibold">
                  Регистрация
                </Text>
                <Text className="text-center text-md text-text_secondary font-onest-medium">
                  Сможешь заполнить форму быстрее всех?
                </Text>
              </View>
              <View className="gap-4">
                <TextInput
                  placeholder="Имя"
                  value={name}
                  onChangeText={setName}
                  className="w-[90%] mx-auto"
                />
                <TextInput
                  placeholder="Никнейм"
                  value={username}
                  onChangeText={setUsername}
                  className="w-[90%] mx-auto"
                />
                <TextInput
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
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
            <View className="h-28 gap-5 mt-5">
              <Button
                className="w-[90%] mx-auto"
                onPress={handleRegister}
                text="Зарегистрироваться"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
