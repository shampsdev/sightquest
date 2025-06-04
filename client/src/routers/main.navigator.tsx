import { AccountScreen } from "@/components/screens/main/account.screen";
import { HomeScreen } from "@/components/screens/main/home.screen";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

export type MainStackParamList = {
  Account: undefined;
  Home: undefined;
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
    </Stack.Navigator>
  );
};
