export interface User {
  id?: string;
  name?: string;
  username: string;
  avatar?: string;
  background?: string;
  createdAt?: string;
  stats?: UserStats;
}

export interface UserStats {
  wins: number;
  matches: number;
}
