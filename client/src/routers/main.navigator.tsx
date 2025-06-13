import { AccountScreen } from "@/components/screens/main/account.screen";
import { EditProfileScreen } from "@/components/screens/main/edit-profile.screen";
import { HistoryScreen } from "@/components/screens/main/history.screen";
import { HomeScreen } from "@/components/screens/main/home.screen";
import { LobbyScreen } from "@/components/screens/main/lobby.screen";
import { ShopScreen } from "@/components/screens/main/shop.screen";
import { createStackNavigator } from "@react-navigation/stack";

export type MainStackParamList = {
  Account: undefined;
  Home: undefined;
  Lobby: undefined;
  History: { gameId: string };
  Shop: undefined;
  EditProfile: undefined;
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
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{ gestureDirection: "horizontal-inverted" }}
      />
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};
