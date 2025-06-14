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
import { usePatchMe } from "@/shared/api/hooks/usePatchMe";

export const SignUpWidget = () => {
  const { login, setToken } = useAuthStore();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState<0 | 1>(0);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const patchMe = usePatchMe();
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const response = await registerRequest(email, username, password);
      setPendingToken(response.token);
      setStep(1);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Ошибка регистрации", "Проверьте корректность данных");
    }
  };

  const handleFinish = async () => {
    if (selectedAvatar === null) {
      Alert.alert("Выбор аватара", "Пожалуйста, выбери аватар");
      return;
    }

    if (!pendingToken) {
      Alert.alert("Ошибка", "Не удалось завершить регистрацию");
      return;
    }

    setToken(pendingToken);

    const updatedUser = await patchMe.mutateAsync({
      username: username,
      avatar: String(selectedAvatar),
    });

    login({ ...updatedUser, name }, pendingToken);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {step === 0 ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <ProgressBarSteps
              totalSteps={2}
              currentStep={0}
              config={{
                dotHeight: 6,
                gap: 3,
                indicatorWidth: 49,
                indicatorWidthSm: 27,
              }}
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
        </TouchableWithoutFeedback>
      ) : (
        <View className="flex-1 items-center gap-16">
          <ProgressBarSteps
            totalSteps={2}
            currentStep={1}
            config={{
              dotHeight: 6,
              gap: 3,
              indicatorWidth: 49,
              indicatorWidthSm: 27,
            }}
          />
          <View className="gap-2">
            <Text className="text-center text-3xl text-text_primary font-bounded-semibold">
              Аватар
            </Text>
            <Text className="text-center text-md text-text_secondary font-onest-medium">
              Какое лицо покажешь соперникам?
            </Text>
          </View>
          <AvatarPicker onSelect={setSelectedAvatar} />
          <Button className="mt-32" text={"Готово!"} onPress={handleFinish} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
