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

export const isAdmin = (user: User, game: Game) => {
  return user.id == game.admin.id;
};

export const isMe = (user: User, me: User) => {
  return user.id == me.id;
};
