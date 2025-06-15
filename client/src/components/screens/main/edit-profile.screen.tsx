import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { TextInput } from "@/components/ui/textinput";
import { AvatarPicker } from "@/components/widgets/avatar-picker";
import { AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { getMe } from "@/shared/api/auth.api";
import { usePatchMe } from "@/shared/api/hooks/usePatchMe";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { setAvatar } from "@/shared/api/styles.api";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const EditProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const {
    data: avatars,
    isLoading,
    isError,
  } = useStyles({
    type: "avatar",
    bought: true,
  });

  const [username, setUsername] = useState<string>(user?.username || "");
  const [name, setName] = useState<string>(user?.name || "");

  const [step, setStep] = useState<0 | 1>(0);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    avatars?.find((x) => x.id === user?.styles?.avatarId)?.id!
  );

  const back = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    setStep(0);
  };

  const patchMeMutation = usePatchMe();

  const handleSubmit = async () => {
    try {
      await setAvatar(selectedAvatar?.toString() ?? "");

      await patchMeMutation.mutateAsync({
        username,
        name,
      });

      const updatedUser = await getMe();
      setUser(updatedUser);
      alert("Профиль успешно обновлен");
      back();
    } catch (error) {
      alert("Произошла ошибка при обновлении профиля");
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-bg_primary"
      style={{ paddingTop: insets.top || 20 }}
    >
      {step === 0 ? (
        <View className="flex-1">
          <ScrollView
            className="w-full"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="w-[90%] gap-[60px] mx-auto flex-col items-center">
              <View
                className="absolute w-full flex-row justify-between items-center"
                style={{ zIndex: 10 }}
              >
                <Pressable onPress={back}>
                  <IconContainer className="bg-[#222222]">
                    <Icons.Back />
                  </IconContainer>
                </Pressable>
              </View>

              <Pressable onPress={() => setStep(1)}>
                <View className="relative flex items-center justify-center">
                  <IconContainer
                    style={{ backgroundColor: "rgba(255,255,255, 0)" }}
                    className="z-20 absolute top-0 left-0 right-0 bottom-0 rounded-full w-[154px] overflow-hidden h-[154px]"
                  >
                    <Icons.Camera />
                  </IconContainer>
                  <BlurView
                    className="absolute top-0 left-0 right-0 bottom-0 z-10 rounded-full w-[154px] overflow-hidden h-[154px]"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 9999,
                      zIndex: 10,
                    }}
                    tint="dark"
                    intensity={10}
                  />
                  <Avatar
                    source={{
                      uri: avatars?.find((x) => x.id === selectedAvatar)?.style
                        .url,
                    }}
                    className="w-[154px] h-[154px]"
                  />
                </View>
              </Pressable>
            </View>

            <TextInput
              placeholder="Имя"
              value={name}
              onChangeText={setName}
              className="w-[90%] mx-auto mt-[24px]"
            />

            <TextInput
              placeholder="Никнейм"
              value={username}
              onChangeText={setUsername}
              className="w-[90%] mx-auto mt-[24px]"
            />
          </ScrollView>
          <View
            className="absolute left-0 right-0"
            style={{ bottom: insets.bottom + 28 }}
          >
            <Button
              disabled={username.length === 0}
              text={"Сохранить"}
              className="w-[90%] mx-auto"
              onPress={handleSubmit}
            />
          </View>
        </View>
      ) : (
        <View className="flex-1 flex-col justify-between">
          <View className="w-[90%] mx-auto" style={{ zIndex: 10 }}>
            <Pressable onPress={handleBackPress}>
              <IconContainer className="bg-[#222222]">
                <Icons.Back />
              </IconContainer>
            </Pressable>
          </View>
          <View className="">
            <AvatarPicker
              onSelect={setSelectedAvatar}
              avatars={avatars ?? []}
            />
          </View>
          <View style={{ bottom: insets.bottom + 28 }}>
            <Button
              onPress={() => setStep(0)}
              text={"Сохранить"}
              className="w-[90%] mx-auto"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
