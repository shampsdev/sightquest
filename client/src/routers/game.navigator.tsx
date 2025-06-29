import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { GameScreen } from "@/components/screens/main/game/game.screen";
import { LobbyScreen } from "@/components/screens/main/game/lobby.screen";
import { useGame } from "@/shared/api/hooks/useGame";
import { useSocket } from "@/shared/hooks/useSocket";
import { useGameStore } from "@/shared/stores/game.store";
import { MainStackParamList } from "./main.navigator";
import { useGeolocationStore } from "@/shared/stores/location.store";
import { useAuthStore } from "@/shared/stores/auth.store";

export type GameStackParamList = {
  Lobby: undefined;
  Game: undefined;
};

type GameStackRoute = RouteProp<MainStackParamList, "GameStack">;

const Stack = createStackNavigator<GameStackParamList>();

export const GameNavigator = () => {
  const route = useRoute<GameStackRoute>();
  const { gameId } = route.params;

  const { emit } = useSocket();
  const { location } = useGeolocationStore();
  const { setGame } = useGameStore();
  const { data: initialGame, isLoading, error } = useGame(gameId);
  const { user } = useAuthStore();
  const { game } = useGameStore();

  useEffect(() => {
    if (isLoading || !initialGame) return;

    if (!game) setGame(initialGame);

    if (game?.players.some((x) => x.user.id === user?.id)) {
      return;
    }

    emit("joinGame", { gameId: initialGame.id });
  }, [isLoading, error, initialGame]);

  useEffect(() => {
    if (location && game?.state !== "lobby" && game) {
      emit("locationUpdate", {
        location: { lon: location[0], lat: location[1] || 0 },
      });
    }
  }, [location]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
};
