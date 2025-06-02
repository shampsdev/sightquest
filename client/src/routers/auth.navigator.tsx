import { OnboardingScreen } from "@/components/screens/auth/onboarding.screen";
import { SignInScreen } from "@/components/screens/auth/sign-in.screen";
import { SignUpScreen } from "@/components/screens/auth/sign-up.screen";
import { createStackNavigator } from "@react-navigation/stack";

export type AuthStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};
