import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/shared/stores/auth.store";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AccountScreen = () => {
  const { logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 justify-end">
      <Button onPress={logout} className="w-[90%] mx-auto" text={"Выйти"} />
    </SafeAreaView>
  );
};
