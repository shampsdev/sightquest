import { GameScreen } from "@/components/screens/main/game/game.screen";
import { LobbyScreen } from "@/components/screens/main/game/lobby.screen";
import { useGame } from "@/shared/api/hooks/useGame";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { MainStackParamList } from "./main.navigator";
import { useEffect } from "react";
import { useGameStore } from "@/shared/stores/game.store";
import { useSocket } from "@/shared/hooks/useSocket";
import { useGeolocation } from "@/shared/hooks/useGeolocation";

export type GameStackParamList = {
  Lobby: undefined;
  Game: undefined;
};

type GameStackRoute = RouteProp<MainStackParamList, "GameStack">;

const Stack = createStackNavigator<GameStackParamList>();

export const GameNavigator = () => {
  const route = useRoute<GameStackRoute>();
  const { gameId } = route.params;

  const { emit, reconnect } = useSocket();
  const { game, setGame } = useGameStore();
  const { data: initialGame, isLoading, error } = useGame(gameId);

  useEffect(() => {
    if (error !== null) {
      console.info(error);
    }

    if (!isLoading && !error && initialGame !== undefined) {
      setGame(initialGame);
      emit("joinGame", { gameId: initialGame.id });
    }

    return () => {
      if (!isLoading && !error && initialGame !== undefined) {
        reconnect();
      }
    };
  }, [isLoading, error, initialGame]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
};
