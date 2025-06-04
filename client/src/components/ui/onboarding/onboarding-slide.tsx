import { View, Image, Text } from "react-native";

export interface OnboardingSlideProps {
  image?: any;
  title: string;
  subtitle: string;
}

export const OnboardingSlide = ({
  image,
  title,
  subtitle,
}: OnboardingSlideProps) => {
  return (
    <View className="mx-auto px-6">
      <View className="w-96 h-96 mx-auto bg-navigation rounded-full items-center justify-center mb-8">
        {image ? (
          <Image source={image} className="w-full h-full rounded-full" />
        ) : (
          <Text className="text-text_secondary font-onest-medium">
            здесь должно быть фото
          </Text>
        )}
      </View>
      <Text className="text-text_primary text-3xl font-bounded-medium text-center mb-6">
        {title}
      </Text>
      <Text className="text-text_secondary text-lg font-onest-medium text-center">
        {subtitle}
      </Text>
    </View>
  );
};
