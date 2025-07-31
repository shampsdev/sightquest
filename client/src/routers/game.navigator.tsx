import { useEffect, useRef } from "react";
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
import { RouteScreen } from "@/components/screens/main/game/route.screen";

export type GameStackParamList = {
  Lobby: undefined;
  Game: undefined;
  Route: undefined;
};

type GameStackRoute = RouteProp<MainStackParamList, "GameStack">;

const Stack = createStackNavigator<GameStackParamList>();

export const GameNavigator = () => {
  const route = useRoute<GameStackRoute>();
  const { gameId } = route.params;

  const { emit } = useSocket();
  const { setGame } = useGameStore();
  const { data: initialGame, isLoading } = useGame(gameId);
  const hasJoinedGame = useRef(false);

  useEffect(() => {
    if (isLoading || !initialGame) return;
    if (hasJoinedGame.current) return;

    setGame(initialGame);
    emit("joinGame", { gameId: initialGame.id });

    hasJoinedGame.current = true;
  }, [isLoading, initialGame, setGame, emit]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Route" component={RouteScreen} />
    </Stack.Navigator>
  );
};
