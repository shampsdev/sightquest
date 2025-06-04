import { useState } from "react";
import { Pressable, View } from "react-native";
import { ProgressBarSteps } from "../ui/progress/progress-bar-steps";
import {
  OnboardingSlide,
  OnboardingSlideProps,
} from "../ui/onboarding/onboarding-slide";
import * as Haptics from "expo-haptics";

const SLIDES: OnboardingSlideProps[] = [
  {
    title: "Догонялки по реальным местам!",
    subtitle: "Беги, исследуй город и выполняй задания в реальном времени!",
    image: undefined,
  },
  {
    title: "Выполняй задания первее всех",
    subtitle:
      "Находи точки маршрута, делай креативные фото и обгоняй соперников",
    image: undefined,
  },
  {
    title: "Играй со своими друзьями",
    subtitle: "Отправляй друзьям код доступа, чтобы бегать вместе по городу",
    image: undefined,
  },
];

export const Onboarding = () => {
  const [screen, setScreen] = useState(0);

  const onScreenTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScreen((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <Pressable className="flex-1 justify-center gap-5" onPress={onScreenTap}>
      <OnboardingSlide {...SLIDES[screen]} />
      <View className="w-full">
        <ProgressBarSteps
          config={{
            dotHeight: 6,
            gap: 3,
            indicatorWidth: 49,
            indicatorWidthSm: 27,
          }}
          totalSteps={SLIDES.length}
          currentStep={screen}
        />
      </View>
    </Pressable>
  );
};
