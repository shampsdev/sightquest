import { AccountScreen } from "@/components/screens/main/account.screen";
import { MapScreen } from "@/components/screens/main/map.screen";
import { createStackNavigator } from "@react-navigation/stack";

export type MainStackParamList = {
  Account: undefined;
  Map: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
};
