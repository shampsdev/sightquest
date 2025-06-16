import { PlayerMarker } from "@/components/ui/map/player-marker";
import { Map } from "@/components/widgets/map";
import { AVATARS } from "@/constants";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { Camera } from "@rnmapbox/maps";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

export const GameScreen = () => {
  const { game } = useGameStore();

  const { user } = useAuthStore();

  const { data: avatars } = useStyles({ type: "avatar" });

  const location = useGeolocation();

  const players = game?.players;

  useEffect(() => console.log(players), [game]);
  return (
    <View className="flex-1">
      <Map>
        {location && players && (
          <>
            {players?.map((player, index) => (
              <PlayerMarker
                key={index}
                coordinate={
                  player.user.id === user?.id
                    ? { lon: location[0], lat: location[1] }
                    : player.location
                }
                name={player?.user.name ?? player.user.username}
                avatarSrc={{
                  uri: avatars?.find(
                    (x) => x.id === player.user.styles?.avatarId
                  )?.style.url,
                }}
              />
            ))}
            <Camera
              defaultSettings={{
                centerCoordinate: location,
                zoomLevel: 15,
              }}
            />
          </>
        )}
      </Map>

      <StatusBar style="dark" />
    </View>
  );
};
