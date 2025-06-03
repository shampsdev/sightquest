import {
  View,
  Text,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/textinput";
import { AuthStackParamList } from "@/routers/auth.navigator";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export const SignUpScreen = () => {
  const { login } = useAuthStore();

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
                <Text className="text-center text-lg text-text_secondary font-onest-medium">
                  Сможешь заполнить форму быстрее всех?
                </Text>
              </View>
              <View className="gap-4">
                <TextInput placeholder="Имя" className="w-[90%] mx-auto" />
                <TextInput placeholder="Никнейм" className="w-[90%] mx-auto" />
                <TextInput
                  autoComplete="email"
                  placeholder="Email"
                  className="w-[90%] mx-auto"
                />
                <TextInput
                  secureTextEntry
                  placeholder="Пароль"
                  className="w-[90%] mx-auto"
                />
              </View>
            </View>
            <View className="h-28 gap-5 mt-5">
              <Button
                className="w-[90%] mx-auto"
                onPress={login}
                text="Войти"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
