export type CellValue = "X" | "O" | null;

export type GameView = {
  id: string;
  jogadorX: string;
  jogadorO: string;
  board: CellValue[];
  turnoAtualRaw?: unknown;
  statusRaw?: unknown;
  resultadoRaw?: unknown;
  vencedor?: string | null;
  finalizadoEm?: string | null;
};

export function normalizeBoard(input: unknown): CellValue[] {
  if (Array.isArray(input)) {
    const arr = input.slice(0, 9).map((v) => {
      if (v === "X" || v === "O") return v;
      return null;
    });
    while (arr.length < 9) arr.push(null);
    return arr;
  }

  if (typeof input === "string") {
    const s = input.trim();
    const arr: CellValue[] = [];
    for (let i = 0; i < Math.min(9, s.length); i++) {
      const ch = s[i];
      if (ch === "X" || ch === "O") arr.push(ch);
      else arr.push(null);
    }
    while (arr.length < 9) arr.push(null);
    return arr;
  }

  return Array.from({ length: 9 }, () => null);
}

export function isFinished(statusRaw: unknown, finalizadoEm?: string | null) {
  if (finalizadoEm) return true;
  const s = String(statusRaw ?? "").toLowerCase();
  return s.includes("final") || s.includes("finish") || s.includes("ended");
}

export function isInProgress(statusRaw: unknown, finalizadoEm?: string | null) {
  if (finalizadoEm) return false;
  const s = String(statusRaw ?? "").toLowerCase();
  if (s.length === 0) return true;
  return (
    s.includes("andamento") || s.includes("progress") || s.includes("playing")
  );
}

export function isYourTurn(params: {
  turnoAtual: unknown;
  nickname: string;
  seuSimbolo?: string;
  jogadorX?: string;
  jogadorO?: string;
}) {
  const turno = String(params.turnoAtual ?? "");
  if (!turno) return false;

  const upper = turno.toUpperCase();
  if (upper === "X" || upper === "O") {
    return params.seuSimbolo?.toUpperCase() === upper;
  }

  if (turno === params.nickname) return true;
  if (turno === params.jogadorX && params.nickname === params.jogadorX)
    return true;
  if (turno === params.jogadorO && params.nickname === params.jogadorO)
    return true;

  return false;
}
