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
import { Camera, MapView } from "@rnmapbox/maps";
import { AVATARS, MAPBOX_STYLE_URL } from "@/constants";
import { PlayerMarker } from "../ui/map/player-marker";
import { useAuthStore } from "@/shared/stores/auth.store";
import { PlayerPreview } from "../ui/player-preview";

export interface NicknameCardProps {
  avatar: ImageSourcePropType;
  title: string;
  subtitle: string;
  buttonAction?: () => void;
  disabled?: boolean;
  withButton?: boolean;
  className?: string;
}

export const NicknameCard = ({
  avatar,
  title,
  subtitle,
  buttonAction,
  withButton,
  disabled,
  className,
}: NicknameCardProps) => {
  const { user } = useAuthStore();

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

  const cardWidth = width * 0.48;

  const clipPath = Skia.Path.Make();
  clipPath.addRRect(rrect(rect(0, 0, cardWidth, cardHeight), 30, 30));

  return (
    <View
      className={twMerge(
        "w-[48%] relative pt-[40px] flex flex-col items-center justify-center",
        className
      )}
    >
      <View className="absolute top-[-20px] left-0 w-full flex items-center z-30">
        <PlayerPreview
          name={user?.name ?? user!.username}
          nicknameType={"default"}
          avatar={
            user!.avatar
              ? AVATARS.find((x) => x.id === Number(user!.avatar))?.src
              : AVATARS[0].src
          }
          className="absolute top-[20px] z-[100]"
        />

        <Image
          source={require("@/assets/map-preview.png")}
          resizeMode="cover"
          className="flex-1 h-[120px] w-full rounded-[30px] overflow-hidden"
        />
      </View>

      <View
        onLayout={handleLayout}
        className={twMerge(
          "w-full pt-[80px]  pb-[24px] relative flex flex-col items-center justify-center gap-[24px] rounded-[30px] overflow-hidden",
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
                  colors={[
                    "rgba(83, 114, 175, 1)",
                    "rgba(63, 94, 155, 1)",
                    "rgba(34, 34, 34, 1)",
                  ]}
                  positions={[0.1, 0.2, 0.9]}
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

        {withButton && (
          <Pressable
            style={{
              backgroundColor: disabled
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(151, 93, 255, 1)",
            }}
            className="flex bg-accent_primary w-fit rounded-[40px] px-[20px] py-[9px]"
            disabled={disabled}
          >
            <Text className="text-[12px] font-bounded-regular text-text_primary">
              Применить
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
