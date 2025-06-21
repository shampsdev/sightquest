import { getMe, register as registerRequest } from "@/shared/api/auth.api";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { setAvatar } from "@/shared/api/styles.api";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "../ui/button";
import { ProgressBarSteps } from "../ui/progress/progress-bar-steps";
import { TextInput } from "../ui/textinput";
import { AvatarPicker } from "./avatar-picker";

export const SignUpWidget = () => {
  const { user, token, login, setToken, setUser } = useAuthStore();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState<0 | 1>(0);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const { data: avatars, isLoading } = useStyles({
    type: "avatar",
    bought: true,
  });

  const handleRegister = async () => {
    try {
      const response = await registerRequest(email, username, password, name);
      setToken(response.token);
      setUser(response.user);
      setStep(1);
    } catch (error: any) {
      console.error(error, error.response.data);
      Alert.alert("Ошибка регистрации", "Проверьте корректность данных");
    }
  };

  const handleFinish = async () => {
    if (selectedAvatar === null) {
      Alert.alert("Выбор аватара", "Пожалуйста, выбери аватар");
      return;
    }

    setAvatar(selectedAvatar.toString());
    const updatedUser = await getMe();

    if (updatedUser !== null && token !== null) {
      login(updatedUser, token);
    }
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
        <View className="flex h-[100%] items-center flex-col justify-between">
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
          </View>

          <AvatarPicker
            onSelect={setSelectedAvatar}
            avatars={avatars ?? []}
            className="mt-[15%] z-20"
          />
          <Button className="mt-32" text={"Готово!"} onPress={handleFinish} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
