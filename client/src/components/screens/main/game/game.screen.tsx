import { PlayerMarker } from '@/components/ui/map/player-marker';
import { Camera } from '@rnmapbox/maps';
import { View } from "react-native";
import { Map } from "@/components/widgets/map";
import { StatusBar } from 'expo-status-bar';

export const GameScreen = () => {
  return (
    <View className="flex-1">
      <Map>
        {/* {location && user && (
          <>
            <PlayerMarker
              coordinate={location}
              name={user?.name ?? user.username}
              avatarSrc={
                user.avatar
                  ? AVATARS.find((x) => x.id === Number(user.avatar))?.src
                  : AVATARS[0].src
              }
            />
            <Camera
              defaultSettings={{
                centerCoordinate: location,
                zoomLevel: 15,
              }}
            />
          </>
        )} */}
      </Map>

      <StatusBar style="dark" />
    </View>
  );
};
