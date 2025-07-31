export interface Vote {
  pollId: string;
  playerId: string;
  gameId: string;
  type: string;
  data: string;
  createdAt: Date;
}
