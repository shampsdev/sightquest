import HomeScreen from "@/components/screens/main/home.screen";
import MapScreen from "@/components/screens/main/map.screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

type MainStackParamList = {
  Home: undefined;
  Map: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Home"
>;

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};
