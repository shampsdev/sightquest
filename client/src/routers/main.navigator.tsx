import { AccountScreen } from "@/components/screens/main/account.screen";
import { HistoryScreen } from "@/components/screens/main/history.screen";
import { HomeScreen } from "@/components/screens/main/home.screen";
import { LobbyScreen } from "@/components/screens/main/lobby.screen";
import { createStackNavigator } from "@react-navigation/stack";

export type MainStackParamList = {
  Account: undefined;
  Home: undefined;
  Lobby: undefined;
  History: { gameId: string };
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};
