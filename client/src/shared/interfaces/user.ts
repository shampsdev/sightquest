import { Game } from "./game/game";

export interface User {
  id?: string;
  name: string;
  username: string;
  createdAt?: string;
  styles: UserStyles;
}

export interface UserStyles {
  avatarId?: string;
}

export const hasAvatar = (
  user: User
): user is User & { styles: { avatarId: string } } => {
  return Boolean(user.styles.avatarId);
};

export const isAdmin = (
  user: User | null | undefined,
  game: Game | null | undefined
) => {
  if (!user || !user.id || !game || !game.admin || !game.admin.id) return false;
  return user.id === game.admin.id;
};

export const isMe = (
  user: User | null | undefined,
  me: User | null | undefined
) => {
  if (!user || !me || !user.id || !me.id) return false;
  return user.id === me.id;
};
