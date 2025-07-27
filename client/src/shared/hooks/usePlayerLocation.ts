import { Coords } from "../interfaces/coords";
import { Player } from "../interfaces/game/player";
import { isMe } from "../interfaces/user";
import { useAuthStore } from "../stores/auth.store";
import { useGeolocationStore } from "../stores/location.store";

export const usePlayerLocation = (player: Player): Coords => {
  const { user } = useAuthStore();
  const { location } = useGeolocationStore();

  if (user !== null && location !== null && isMe(player.user, user)) {
    return { lon: location[0], lat: location[1] };
  }

  return player.location;
};
