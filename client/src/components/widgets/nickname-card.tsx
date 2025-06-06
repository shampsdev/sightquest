import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ImageSourcePropType,
  LayoutChangeEvent,
  useWindowDimensions,
  Pressable,
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
import { Camera, MapView } from "@rnmapbox/maps";
import { AVATARS, MAPBOX_STYLE_URL } from "@/constants";
import { PlayerMarker } from "../ui/map/player-marker";
import { useAuthStore } from "@/shared/stores/auth.store";

export interface NicknameCardProps {
  avatar: ImageSourcePropType;
  title: string;
  subtitle: string;
  buttonAction?: () => void;
  disabled?: boolean;
  withButton?: boolean;
  className?: string;
}

const NicknameCard = ({
  avatar,
  title,
  subtitle,
  buttonAction,
  withButton,
  disabled,
  className,
}: NicknameCardProps) => {
  const { width } = useWindowDimensions();
  const [cardHeight, setCardHeight] = useState(100);
  const { user } = useAuthStore();
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
        <MapView
          pitchEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          logoEnabled={false}
          scaleBarEnabled={false}
          attributionEnabled={false}
          styleURL={MAPBOX_STYLE_URL}
          className="flex-1 h-[120px] w-full rounded-[30px] overflow-hidden z-100"
        >
          <Camera
            defaultSettings={{
              centerCoordinate: [30.34018, 59.965526],
              zoomLevel: 12,
            }}
          />
          <PlayerMarker
            coordinate={[30.34018, 59.965526]}
            name={user?.name ?? (user?.username || "")}
            avatarSrc={
              user?.avatar
                ? AVATARS.find((x) => x.id === Number(user.avatar))?.src
                : AVATARS[0].src
            }
          />
        </MapView>
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
                  start={vec(0, 0)}
                  end={vec(0, cardHeight * 2)}
                  colors={["rgba(60, 100, 55, 0.4)", "rgba(34, 34, 34, 1)"]}
                  positions={[0, 0.3]}
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
            className="flex w-fit rounded-[40px] text-[13px] font-bounded-regular text-text_primary px-[20px] py-[9px]"
          >
            Применить
          </Text>
        )}

        {withButton && !disabled && (
          <Pressable onPress={buttonAction}>
            <Text className="flex bg-accent_primary w-fit rounded-[40px] text-[13px] font-bounded-regular text-text_primary px-[20px] py-[9px]">
              Купить
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default NicknameCard;
