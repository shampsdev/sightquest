import { Route } from "@/shared/interfaces/route";
import { Camera, Location, MapView } from "@rnmapbox/maps";
import { View, Text, Pressable } from "react-native";
import { MAPBOX_STYLE_URL } from "@/constants";
import { BlurView } from "@react-native-community/blur";
import { Coords } from "@/shared/interfaces/coords";

export interface RouteCardProps {
  route: Route;
  coords: Coords;
  title: string;
  buttonAction?: () => void;
  disabled?: boolean;
}

export const RouteCard = ({
  route,
  coords,
  title,
  buttonAction,
  disabled,
}: RouteCardProps) => {
  const [lon, lat] = [coords.lon, coords.lat];
  return (
    <View className="min-w-full relative max-h-[280px]">
      <MapView
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        styleURL={MAPBOX_STYLE_URL}
        className="flex-1 h-full rounded-[30px] overflow-hidden"
      >
        <Camera
          defaultSettings={{
            centerCoordinate: [lon, lat],
            zoomLevel: 15,
          }}
        />
      </MapView>
      <View className="w-full absolute flex flex-row items-center bottom-[8px] mx-auto justify-center">
        <View className="w-[95%] flex flex-row px-[20px] py-[8px] items-center justify-between overflow-hidden rounded-[40px]">
          <BlurView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              borderRadius: 30,
            }}
            blurType="light"
            blurAmount={10}
            overlayColor="rgba(34, 34, 34, 0.8)"
          />
          <Text className="font-bounded-regular text-[12px] text-text_primary z-10">
            {title}
          </Text>
          <View className="z-10">
            {disabled && (
              <Text
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="flex w-fit rounded-[40px] text-[14px] font-bounded-regular text-text_primary px-[20px] py-[9px]"
              >
                Купить
              </Text>
            )}
            {!disabled && (
              <Pressable onPress={buttonAction}>
                <Text className="flex bg-accent_primary w-fit rounded-[40px] text-[14px] font-bounded-regular text-text_primary px-[20px] py-[9px]">
                  Купить
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
