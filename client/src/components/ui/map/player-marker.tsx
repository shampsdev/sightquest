import Mapbox from "@rnmapbox/maps";
import Animated from "react-native-reanimated";
import { UserMarker } from "./user-marker";
import { usePlayerLocation } from "@/shared/hooks/usePlayerLocation";
import { Player } from "@/shared/interfaces/game/player";
import { hasAvatar } from "@/shared/interfaces/user";
import { useStyles } from "@/shared/api/hooks/useStyles";

const AnimatedMarkerView = Animated.createAnimatedComponent(Mapbox.MarkerView);

export const PlayerMarker = ({
  player,
  pulse = false,
}: {
  player: Player;
  pulse?: boolean;
}) => {
  if (!player || !player.user) {
    return null;
  }
  const coordinate = usePlayerLocation(player);
  const { getStyle } = useStyles({ type: "avatar" });

  const avatarSrc = hasAvatar(player.user)
    ? getStyle(player.user.styles.avatarId)?.style.url ?? ""
    : "";

  return (
    <UserMarker
      coordinate={coordinate}
      name={player.user.name}
      avatarSrc={avatarSrc}
      pulse={pulse}
    />
  );
};
