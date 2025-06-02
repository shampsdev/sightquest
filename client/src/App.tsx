import "./global.css";

import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import MapScreen from "@/components/screens/Map/MapScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeScreen from "@/components/screens/Home/HomeScreen";

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
