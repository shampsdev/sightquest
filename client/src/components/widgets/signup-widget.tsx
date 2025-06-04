import {
  ScrollView,
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "../ui/button";
import { TextInput } from "../ui/textinput";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useState } from "react";
import { register as registerRequest } from "@/shared/api/auth.api";
import { ProgressBarSteps } from "../ui/progress/progress-bar-steps";
import { AvatarPicker } from "./avatar-picker";

export const SignUpWidget = () => {
  const { login } = useAuthStore();

  const [name, setName] = useState(""); // not sent to api
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(0); // 0 = form, 1 = avatar
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 items-center"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1,
          backgroundColor: "red",
          zIndex: 10,
        }}
      />

      <View>
        <AvatarPicker />
      </View>

      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBarSteps
            config={{
              dotHeight: 6,
              gap: 3,
              indicatorWidth: 49,
              indicatorWidthSm: 27,
            }}
            totalSteps={2}
            currentStep={0}
          />
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
              text="Дальше"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};
