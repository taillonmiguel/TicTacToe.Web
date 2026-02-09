export type MatchJoinResult = {
  status: string;
  ticketId?: string;
  gameId?: string;
  jogadorX?: string;
  jogadorO?: string;
  seuSimbolo?: "X" | "O" | string;
};

export type MatchFoundEvent = {
  gameId: string;
  jogadorX: string;
  jogadorO: string;
  seuSimbolo: "X" | "O" | string;
};
