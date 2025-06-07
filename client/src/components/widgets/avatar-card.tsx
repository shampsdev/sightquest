import { useState, useCallback } from "react";
import {
  View,
  Text,
  ImageSourcePropType,
  LayoutChangeEvent,
  useWindowDimensions,
  Pressable,
  Image,
} from "react-native";
import { Avatar } from "../ui/avatar";
import { twMerge } from "tailwind-merge";
import {
  Canvas,
  Fill,
  LinearGradient,
  vec,
  Group,
  rrect,
  rect,
} from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia/lib/module/skia";
import { usePixelColor } from "@/shared/hooks/usePixelColor";

export interface AvatarCardProps {
  avatar: ImageSourcePropType;
  title: string;
  subtitle: string;
  buttonAction?: () => void;
  disabled?: boolean;
  withButton?: boolean;
  className?: string;
}

export const AvatarCard = ({
  avatar,
  title,
  subtitle,
  buttonAction,
  withButton,
  disabled,
  className,
}: AvatarCardProps) => {
  const { width } = useWindowDimensions();
  const [cardHeight, setCardHeight] = useState(100);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height !== cardHeight) {
        setCardHeight(height);
      }
    },
    [cardHeight]
  );

  const avatarUri = Image.resolveAssetSource(avatar)?.uri || "";
  const pixelColor = usePixelColor({ imageUri: avatarUri });

  const cardWidth = width * 0.48;

  const clipPath = Skia.Path.Make();
  clipPath.addRRect(rrect(rect(0, 0, cardWidth, cardHeight), 30, 30));

  return (
    <View
      className={twMerge(
        "w-[48%] relative flex flex-col items-center justify-center",
        className
      )}
    >
      <View className="absolute top-0 left-0 w-full flex items-center z-30">
        <Avatar className="top-[-60px] w-[130px] h-[130px]" source={avatar} />
      </View>

      <View
        onLayout={handleLayout}
        className={twMerge(
          "w-full pt-[80px] px-[20px] pb-[24px] relative flex flex-col items-center justify-center gap-[24px] rounded-[30px] overflow-hidden",
          className
        )}
      >
        <Canvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 30,
          }}
        >
          {cardWidth > 0 && cardHeight > 0 && (
            <Group clip={clipPath}>
              <Fill>
                <LinearGradient
                  start={vec(0, -cardHeight * 2)}
                  end={vec(0, cardHeight)}
                  colors={
                    pixelColor
                      ? [
                          `rgba(${pixelColor.r - 80}, ${pixelColor.g - 80}, ${
                            pixelColor.b - 80
                          }, 1)`,
                          `rgba(${pixelColor.r - 100}, ${pixelColor.g - 100}, ${
                            pixelColor.b - 100
                          },1)`,
                          "rgba(34, 34, 34, 0.2)",
                        ]
                      : [
                          "rgba(83, 114, 175, 1)",
                          "rgba(63, 94, 155, 1)",
                          "rgba(34, 34, 34, 1)",
                        ]
                  }
                  positions={[0.1, 0.4, 0.9]}
                />
              </Fill>
            </Group>
          )}
        </Canvas>

        <View className="z-10 flex flex-col items-center justify-center gap-[4px]">
          <Text className="font-bounded-regular text-text_primary text-[18px]">
            {title}
          </Text>
          <Text className="font-onest-regular text-[#b6b6b6] text-[16px] text-center">
            {subtitle}
          </Text>
        </View>

        {withButton && disabled && (
          <Text
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            className="flex w-fit rounded-[40px] text-[12px] font-bounded-regular text-text_primary px-[20px] py-[9px]"
          >
            Применить
          </Text>
        )}

        {withButton && !disabled && (
          <Pressable onPress={buttonAction}>
            <Text className="flex bg-accent_primary w-fit rounded-[40px] text-[12px] font-bounded-regular text-text_primary px-[20px] py-[9px]">
              Купить
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
