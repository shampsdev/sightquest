import { Player } from "@/shared/interfaces/game/player";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { UserPreview } from "../widgets/user/user-preview";
import { hasAvatar, isMe } from "@/shared/interfaces/user";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { Route } from "@/shared/interfaces/route";
import { View } from "react-native";
import { Header } from "../ui/header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/shared/stores/auth.store";

export interface StartGameOverlayProps {
  visible?: boolean;
  players?: Player[];
  route?: Route;
}

export const StartGameOverlay = ({
  visible,
  players,
  route,
}: StartGameOverlayProps) => {
  const { getStyle } = useStyles({ type: "avatar" });
  const opacity = useSharedValue(0);

  const { user } = useAuthStore();

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute w-full h-full flex justify-start items-center z-30 bg-bg_primary"
      pointerEvents={visible ? "auto" : "none"}
    >
      <View className="w-[90%] gap-y-10" style={{ paddingTop: insets.top }}>
        <Header
          mainText={"Участники"}
          descriptionText={`Маршрут: ${route?.title}`}
        />
        {players?.map((player) => (
          <UserPreview
            active={user ? isMe(player.user, user) : false}
            key={`startgame_player_${player.user.id}`}
            avatar={{
              uri:
                hasAvatar(player.user) &&
                getStyle(player.user.styles.avatarId)?.style.url,
            }}
            name={player.user.name}
            role={player.role}
            scores={player.score}
          />
        ))}
      </View>
    </Animated.View>
  );
};
