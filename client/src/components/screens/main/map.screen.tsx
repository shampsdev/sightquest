import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, Image } from "react-native";
import { Map } from "@/components/widgets/map";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@/routers/main.navigator";
import Mapbox, { Camera } from "@rnmapbox/maps";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useEffect } from "react";

import Animated from "react-native-reanimated";
import { useAnimatedCoord } from "@/shared/hooks/useAnimatedCoord";
import { BlurView } from "expo-blur";

const AnimatedMarkerView = Animated.createAnimatedComponent(Mapbox.MarkerView);

export const MapScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const location = useGeolocation();
  const [animatedProps, animate] = useAnimatedCoord(location ?? [0, 0]);

  useEffect(() => {
    if (location) {
      animate({
        latitude: location[1],
        longitude: location[0],
        duration: 500,
      });
    }
  }, [location]);

  const account = () => {
    navigation.navigate("Account");
  };

  return (
    <View className="flex-1">
      <Map>
        {location && (
          <>
            <AnimatedMarkerView
              coordinate={[0, 0]}
              anchor={{ x: 0.5, y: 0.5 }}
              animatedProps={animatedProps}
              allowOverlap={false}
              allowOverlapWithPuck={false}
              isSelected={false}
            >
              <View className="items-center">
                <View className="rounded-full overflow-hidden z-10">
                  <BlurView intensity={10} tint="dark" className="px-2 py-1">
                    <Text className="font-onest-medium text-xs">Мишель </Text>
                  </BlurView>
                </View>

                <Image
                  className="h-14 w-14 rounded-full -mt-2 border-text_primary border-2 shadow-2xl"
                  source={require("@/assets/avatars/avatar-14.png")}
                  resizeMode="cover"
                />
              </View>
            </AnimatedMarkerView>
            <Camera
              defaultSettings={{
                centerCoordinate: location,
                zoomLevel: 15,
              }}
            />
          </>
        )}
      </Map>

      <Button
        className="absolute right-0 left-0 bottom-8 m-8 w-auto"
        text="Начать игру"
      />
      <IconContainer className="absolute top-16 left-5">
        <Icons.Store />
      </IconContainer>
      <Pressable className="absolute top-16 right-5" onPress={account}>
        <IconContainer>
          <Text className="text-text_primary font-bounded-bold">A</Text>
        </IconContainer>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
};
