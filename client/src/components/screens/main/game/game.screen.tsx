import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { PlayerMarker } from "@/components/ui/map/player-marker";
import { JoinBottomSheet } from "@/components/widgets/join-bottom-sheet";
import { Map } from "@/components/widgets/map";
import { AVATARS } from "@/constants";
import { GameStackParamList } from "@/routers/game.navigator";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useSocket } from "@/shared/hooks/useSocket";
import { socket } from "@/shared/instances/socket.instance";
import { SocketManager } from "@/shared/socket/socket-manager";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Camera } from "@rnmapbox/maps";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

type NavProp = StackNavigationProp<GameStackParamList, "Game">;

export const GameScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { game, setGame } = useGameStore();

  const { user } = useAuthStore();

  const { emit, isConnected } = useSocket();

  const { data: avatars } = useStyles({ type: "avatar" });

  const location = useGeolocation();

  const players = game?.players;

  useEffect(() => console.log(players), [game]);

  const back = () => {
    navigation.goBack();
    setGame(null);
    emit("leaveGame");
  };

  useEffect(() => {
    if (location)
      emit("locationUpdate", {
        location: { lon: location[0], lat: location[1] },
      });
  }, [location]);
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
                zoomLevel: 1,
              }}
            />
          </>
        )}
      </Map>

      <View className="absolute top-20 w-full">
        <View className="w-[90%] mx-auto flex-row justify-between items-center">
          <Pressable onPress={back}>
            <IconContainer>
              <Icons.Back />
            </IconContainer>
          </Pressable>

          <Text className="z-20">
            IS_CONNECTED: {isConnected ? "TRUE" : "FALSE"}
          </Text>
          {user && (
            <Pressable onPress={() => {}}>
              <Avatar
                className="h-12 w-12"
                source={{
                  uri: avatars?.find((x) => x.id === user.styles?.avatarId)
                    ?.style.url,
                }}
              />
            </Pressable>
          )}
        </View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
};
