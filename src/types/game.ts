export type PartidaDto = {
  id: string;
  jogadorX: string;
  jogadorO: string;
  tabuleiro: unknown;
  turnoAtual: unknown;
  status: unknown;
  resultado?: unknown;
  vencedor?: string | null;
  criadoEm?: string;
  finalizadoEm?: string | null;
};

export type GameUpdatedEvent = {
  gameId: string;
  board: unknown;
  turnoAtual: unknown;
  status: unknown;
  resultado?: unknown;
  vencedor?: string | null;
  finalizadoEm?: string | null;
  jogadorX: string;
  jogadorO: string;
};
